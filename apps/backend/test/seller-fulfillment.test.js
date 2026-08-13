import { test } from 'node:test';
import assert from 'node:assert/strict';

import { BASE, api, backendUp, login } from './helpers/auth.js';

const SELLER = {
  email: 'seed.farmer@soko-africa.test',
  password: 'Seller123!@'
};

/**
 * End-to-end cover for the seller fulfillment workflow: a paid order gets a
 * shipment per seller, the seller advances their own lines, the order status
 * rolls up, and another shop cannot touch any of it.
 */

test('seller fulfillment workflow', async (t) => {
  if (!(await backendUp())) {
    t.skip('backend not reachable at ' + BASE);
    return;
  }

  const token = await login(SELLER);
  assert.ok(token, 'seller login should succeed');

  // A throwaway listing of our own. Using a real catalog product would drain
  // its stock a little on every run, which eventually breaks unrelated tests.
  const { res: createRes, data: product } = await api('/products', {
    method: 'POST',
    token,
    body: {
      name: `Fulfillment Fixture ${Date.now()}`,
      description: 'Disposable listing for the fulfillment workflow test.',
      price: 100,
      currency: 'KES',
      category: 'plums',
      status: 'PUBLISHED',
      stock: 500,
      imageUrls: ['/api/products/media/default-product.png']
    }
  });
  assert.equal(createRes.status, 201, JSON.stringify(product));

  // Place a PAID order via the cart flow, which settles immediately with a
  // stub payment — the shortest real path to an order a seller can fulfil.
  const { data: cartData } = await api('/cart', { token });
  for (const it of cartData?.cart?.items || []) {
    await api(`/cart/items/${it.id}`, { method: 'DELETE', token });
  }

  const { res: addRes, data: addData } = await api('/cart/items', {
    method: 'POST',
    token,
    body: { productId: product.id }
  });
  assert.equal(addRes.status, 201, JSON.stringify(addData));

  const { res: orderRes, data: orderBody } = await api('/orders', {
    method: 'POST',
    token,
    body: {}
  });
  assert.equal(orderRes.status, 201, JSON.stringify(orderBody));
  const orderId = orderBody.order.id;
  assert.equal(orderBody.order.status, 'PAID');

  let sellerOrder;
  let line;

  await t.test('seller sees the order with a shipping address', async () => {
    const { data } = await api('/seller/orders', { token });
    sellerOrder = (data.orders || []).find((o) => o.id === orderId);
    assert.ok(sellerOrder, 'order should appear in the seller list');
    // Sellers previously saw only a name and email. The field must now be
    // present on the payload even when this particular order has no address
    // on file, so the UI never has to guess.
    assert.ok('shippingAddress' in sellerOrder);

    line = sellerOrder.lineItems[0];
    assert.equal(line.fulfillmentStatus, 'UNFULFILLED');
    assert.deepEqual(line.nextStatuses, ['PROCESSING', 'CANCELLED']);
  });

  await t.test('illegal transitions are refused', async () => {
    const { res, data } = await api(
      `/seller/orders/${orderId}/items/${line.id}`,
      { method: 'PATCH', token, body: { fulfillmentStatus: 'DELIVERED' } }
    );
    assert.equal(res.status, 409);
    assert.match(data.message, /cannot go from unfulfilled to delivered/i);
  });

  await t.test('an unknown status is rejected by the schema', async () => {
    const { res } = await api(`/seller/orders/${orderId}/items/${line.id}`, {
      method: 'PATCH',
      token,
      body: { fulfillmentStatus: 'TELEPORTED' }
    });
    assert.equal(res.status, 400);
  });

  await t.test('seller advances the line and the order rolls up', async () => {
    const { res: p1, data: d1 } = await api(
      `/seller/orders/${orderId}/items/${line.id}`,
      { method: 'PATCH', token, body: { fulfillmentStatus: 'PROCESSING' } }
    );
    assert.equal(p1.status, 200, JSON.stringify(d1));
    assert.equal(d1.fulfillmentStatus, 'PROCESSING');
    // Order.status used to freeze at PAID forever.
    assert.equal(d1.orderStatus, 'PROCESSING');

    const { data: d2 } = await api(
      `/seller/orders/${orderId}/items/${line.id}`,
      { method: 'PATCH', token, body: { fulfillmentStatus: 'SHIPPED' } }
    );
    assert.equal(d2.fulfillmentStatus, 'SHIPPED');
    assert.equal(d2.orderStatus, 'SHIPPED');
  });

  await t.test('seller records carrier and tracking', async () => {
    const { res, data } = await api(`/seller/orders/${orderId}/shipment`, {
      method: 'POST',
      token,
      body: { carrier: 'Sendy', trackingNumber: 'SND-12345' }
    });
    assert.equal(res.status, 200, JSON.stringify(data));
    assert.equal(data.shipment.carrier, 'Sendy');
    assert.equal(data.shipment.trackingNumber, 'SND-12345');
    assert.equal(data.shipment.status, 'IN_TRANSIT');

    const { data: list } = await api('/seller/orders', { token });
    const refreshed = (list.orders || []).find((o) => o.id === orderId);
    assert.equal(refreshed.tracking, 'SND-12345');
  });

  await t.test('the buyer sees the tracking and per-line status', async () => {
    const { data } = await api(`/orders/${orderId}`, { token });
    const body = data.order || data;
    assert.equal(body.tracking, 'SND-12345');
    assert.equal(body.products[0].fulfillmentStatus, 'SHIPPED');
    assert.equal(body.uiStatus, 'shipped');
    assert.ok(body.shipments.some((s) => s.trackingNumber === 'SND-12345'));
  });

  await t.test('a line that is not ours is indistinguishable from a missing one', async () => {
    // 404 rather than 403 — a distinct code would confirm the line exists and
    // let one shop probe another's orders.
    const { res } = await api(
      `/seller/orders/${orderId}/items/00000000-0000-4000-8000-000000000000`,
      { method: 'PATCH', token, body: { fulfillmentStatus: 'PROCESSING' } }
    );
    assert.equal(res.status, 404);
  });

  await t.test('an unpaid order cannot be fulfilled', async () => {
    // Abandoned checkouts sit at PENDING_PAYMENT and still appear in the
    // seller's list; they must not be shippable.
    const { data: unpaid } = await api('/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': `unpaid-${Date.now()}-${Math.random()}` },
      body: {
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: product.minOrderQuantity ?? 1
          }
        ],
        contact: { email: 'buyer@example.test' },
        currency: product.currency
      }
    });

    const { data: list } = await api('/seller/orders', { token });
    const pending = (list.orders || []).find((o) => o.id === unpaid.orderId);
    assert.ok(pending, 'unpaid order should still be visible');
    assert.equal(pending.fulfillable, false);
    // No actions offered anywhere on it.
    assert.ok(pending.lineItems.every((l) => l.nextStatuses.length === 0));

    const { res, data } = await api(
      `/seller/orders/${unpaid.orderId}/items/${pending.lineItems[0].id}`,
      { method: 'PATCH', token, body: { fulfillmentStatus: 'PROCESSING' } }
    );
    assert.equal(res.status, 409);
    assert.match(data.message, /cannot be fulfilled yet/i);

    const { res: shipRes } = await api(
      `/seller/orders/${unpaid.orderId}/shipment`,
      { method: 'POST', token, body: { carrier: 'Sendy' } }
    );
    assert.equal(shipRes.status, 409);
  });

  await t.test('delivered is terminal', async () => {
    await api(`/seller/orders/${orderId}/items/${line.id}`, {
      method: 'PATCH',
      token,
      body: { fulfillmentStatus: 'DELIVERED' }
    });
    const { res, data } = await api(
      `/seller/orders/${orderId}/items/${line.id}`,
      { method: 'PATCH', token, body: { fulfillmentStatus: 'SHIPPED' } }
    );
    assert.equal(res.status, 409);
    assert.match(data.message, /final/i);
  });

  await api(`/products/${product.id}`, { method: 'DELETE', token });
});

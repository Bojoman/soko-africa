import { test } from 'node:test';
import assert from 'node:assert/strict';

import { BASE, api, backendUp, login } from './helpers/auth.js';

const SELLER = {
  email: 'seed.farmer@soko-africa.test',
  password: 'Seller123!@'
};

/**
 * End-to-end cover for sale units: a seller lists goods priced per kilogram
 * and per pack, and a buyer orders a fractional quantity that must price
 * exactly.
 */

const PLUMS = {
  name: `Test Plums ${Date.now()}`,
  description: 'Fixture for fractional-quantity pricing.',
  price: 180,
  currency: 'KES',
  category: 'plums',
  status: 'PUBLISHED',
  stock: 20,
  saleUnit: 'KILOGRAM',
  quantityStep: 0.5,
  minOrderQuantity: 1,
  imageUrls: ['/api/products/media/default-product.png']
};

const CRATE = {
  name: `Test Mango Crate ${Date.now()}`,
  description: 'Fixture for pack comparison pricing.',
  price: 360,
  currency: 'KES',
  category: 'plums',
  status: 'PUBLISHED',
  stock: 10,
  saleUnit: 'CRATE',
  quantityStep: 1,
  minOrderQuantity: 1,
  netContentValue: 2,
  netContentUnit: 'KILOGRAM',
  imageUrls: ['/api/products/media/default-product.png']
};

test('sale units end to end', async (t) => {
  if (!(await backendUp())) {
    t.skip('backend not reachable at ' + BASE);
    return;
  }

  const token = await login(SELLER);
  assert.ok(token, 'seller login should succeed');

  // ---- seller creates a per-kilogram listing ----
  const { res: createRes, data: plums } = await api('/products', {
    method: 'POST',
    token,
    body: PLUMS
  });
  assert.equal(createRes.status, 201, JSON.stringify(plums));

  const { data: crate } = await api('/products', {
    method: 'POST',
    token,
    body: CRATE
  });

  await t.test('unit terms survive the round trip', async () => {
    const { data } = await api(`/products/${plums.id}`);
    assert.equal(data.saleUnit, 'KILOGRAM');
    assert.equal(data.quantityStep, 0.5);
    assert.equal(data.minOrderQuantity, 1);
    assert.equal(data.stockQuantity, 20);
    assert.equal(data.unitSuffix, '/kg');
    // Numbers, not Prisma Decimal strings.
    assert.equal(typeof data.quantityStep, 'number');
    assert.equal(typeof data.stockQuantity, 'number');
  });

  await t.test('a pack derives a comparison price', async () => {
    const { data } = await api(`/products/${crate.id}`);
    // A 2 kg crate at KES 360 is KES 180/kg.
    assert.equal(data.pricePerBaseUnit, 180);
    assert.equal(data.baseUnit, 'KILOGRAM');
  });

  await t.test('seller cannot save a nonsense unit spec', async () => {
    const { res, data } = await api('/products', {
      method: 'POST',
      token,
      body: { ...PLUMS, name: 'Bad step', minOrderQuantity: 1.2 }
    });
    assert.equal(res.status, 400);
    assert.match(data.message, /multiple of the quantity step/i);
  });

  await t.test('a crate cannot be sold in half units', async () => {
    const { res } = await api('/products', {
      method: 'POST',
      token,
      body: { ...CRATE, name: 'Half crate', quantityStep: 0.5 }
    });
    assert.equal(res.status, 400);
  });

  // ---- cart accepts fractional quantities ----
  await t.test('cart accepts 1.5 kg and rejects off-step amounts', async () => {
    const { data: cartData } = await api('/cart', { token });
    for (const it of cartData?.cart?.items || []) {
      await api(`/cart/items/${it.id}`, { method: 'DELETE', token });
    }

    const { res, data } = await api('/cart/items', {
      method: 'POST',
      token,
      body: { productId: plums.id, quantity: 1.5 }
    });
    assert.equal(res.status, 201, JSON.stringify(data));

    const line = data.cart.items.find((i) => i.variant?.product?.id === plums.id);
    assert.equal(line.quantity, 1.5);
    assert.equal(typeof line.quantity, 'number', 'must not be a Decimal string');

    // Adding another 1.5 kg accumulates rather than concatenating to "1.51.5".
    const { data: merged } = await api('/cart/items', {
      method: 'POST',
      token,
      body: { productId: plums.id, quantity: 1.5 }
    });
    const mergedLine = merged.cart.items.find(
      (i) => i.variant?.product?.id === plums.id
    );
    assert.equal(mergedLine.quantity, 3);

    // Above the 1 kg minimum but not a multiple of the 0.5 kg step. (Below
    // the minimum the minimum check fires first, which is the more useful
    // message.)
    const { res: offStep, data: offStepData } = await api('/cart/items', {
      method: 'POST',
      token,
      body: { productId: plums.id, quantity: 1.25 }
    });
    assert.equal(offStep.status, 400);
    assert.match(offStepData.message, /increments of 0\.5 kg/i);

    const { res: belowMin, data: belowMinData } = await api('/cart/items', {
      method: 'POST',
      token,
      body: { productId: plums.id, quantity: 0.5 }
    });
    assert.equal(belowMin.status, 400);
    assert.match(belowMinData.message, /minimum order/i);
  });

  // ---- checkout prices fractional quantities exactly ----
  await t.test('1.5 kg at KES 180/kg is exactly KES 270.00', async () => {
    const { res, data } = await api('/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': `test-${Date.now()}-${Math.random()}` },
      body: {
        items: [{ productId: plums.id, name: PLUMS.name, price: 180, quantity: 1.5 }],
        contact: { email: 'buyer@example.test' },
        shippingAddress: { line1: '1 Test Rd', city: 'Nairobi', country: 'KE' },
        currency: 'KES',
        shippingMethod: 'standard',
        // Deliberately wrong — the server must ignore client totals.
        totals: { subtotal: 1, shipping: 0, tax: 0, total: 1 }
      }
    });

    assert.equal(res.status, 201, JSON.stringify(data));
    assert.equal(data.totals.subtotal, 270);
    // 270 is over the free-shipping threshold, so total == subtotal.
    assert.equal(data.totals.total, 270);
  });

  await t.test('checkout rejects an off-step quantity outright', async () => {
    const { res, data } = await api('/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': `test-bad-${Date.now()}-${Math.random()}` },
      body: {
        items: [{ productId: plums.id, name: PLUMS.name, price: 180, quantity: 1.75 }],
        contact: { email: 'buyer@example.test' },
        currency: 'KES'
      }
    });
    assert.equal(res.status, 400);
    assert.match(data.message, /increments/i);
  });

  await t.test('checkout rejects more than the seller has in stock', async () => {
    const { res, data } = await api('/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': `test-stock-${Date.now()}-${Math.random()}` },
      body: {
        items: [{ productId: plums.id, name: PLUMS.name, price: 180, quantity: 25 }],
        contact: { email: 'buyer@example.test' },
        currency: 'KES'
      }
    });
    assert.equal(res.status, 400);
    assert.match(data.message, /stock/i);
  });

  // ---- cleanup ----
  await api(`/products/${plums.id}`, { method: 'DELETE', token });
  await api(`/products/${crate.id}`, { method: 'DELETE', token });
});

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { BASE, api, backendUp, login } from './helpers/auth.js';

const TEST_USER = {
  email: 'seed.farmer@soko-africa.test',
  password: 'Seller123!@'
};

function cartItems(data) {
  return data?.cart?.items || [];
}

function itemForProduct(items, productId) {
  return items.find((it) => it.variant?.product?.id === productId);
}

test('cart CRUD lifecycle', async (t) => {
  if (!(await backendUp())) {
    t.skip('backend not reachable at ' + BASE);
    return;
  }

  const token = await login(TEST_USER);
  assert.ok(token, 'access token required');

  // Clear existing cart
  let { data: cartData } = await api('/cart', { token });
  for (const it of cartItems(cartData)) {
    const { res: deleteRes } = await api(`/cart/items/${it.id}`, {
      method: 'DELETE',
      token
    });
    assert.equal(deleteRes.status, 200, 'existing cart item cleanup should succeed');
  }

  const { data: productsData } = await api('/products?limit=2');
  const [p1, p2] = productsData.products || [];
  assert.ok(p1?.id && p2?.id, 'need at least two seeded products');

  // CREATE
  const { res: createRes, data: createData } = await api('/cart/items', {
    method: 'POST',
    token,
    body: { productId: p1.id, quantity: 2 }
  });
  assert.equal(createRes.status, 201, 'POST /cart/items');
  assert.equal(cartItems(createData).length, 1);
  assert.equal(itemForProduct(cartItems(createData), p1.id).quantity, 2);

  // CREATE merges quantity for same product
  const { data: mergeData } = await api('/cart/items', {
    method: 'POST',
    token,
    body: { productId: p1.id, quantity: 1 }
  });
  assert.equal(itemForProduct(cartItems(mergeData), p1.id).quantity, 3);

  // CREATE second line
  const { data: secondData } = await api('/cart/items', {
    method: 'POST',
    token,
    body: { productId: p2.id, quantity: 1 }
  });
  assert.equal(cartItems(secondData).length, 2);

  // READ
  const { res: readRes, data: readData } = await api('/cart', { token });
  assert.equal(readRes.status, 200);
  assert.equal(cartItems(readData).length, 2);

  const line1 = itemForProduct(cartItems(readData), p1.id);
  const line2 = itemForProduct(cartItems(readData), p2.id);
  assert.ok(line1?.id && line2?.id);

  // UPDATE
  const { res: patchRes, data: patchData } = await api(`/cart/items/${line1.id}`, {
    method: 'PATCH',
    token,
    body: { quantity: 5 }
  });
  assert.equal(patchRes.status, 200);
  assert.equal(itemForProduct(cartItems(patchData), p1.id).quantity, 5);

  // DELETE
  const { res: delRes, data: delData } = await api(`/cart/items/${line2.id}`, {
    method: 'DELETE',
    token
  });
  assert.equal(delRes.status, 200);
  assert.equal(cartItems(delData).length, 1);

  // Invalid productId rejected
  const { res: badRes } = await api('/cart/items', {
    method: 'POST',
    token,
    body: { productId: 'not-a-uuid', quantity: 1 }
  });
  assert.equal(badRes.status, 400);

  // SYNC
  const { res: syncRes, data: syncData } = await api('/cart/sync', {
    method: 'POST',
    token,
    body: {
      items: [{ productId: p2.id, quantity: 2 }]
    }
  });
  assert.equal(syncRes.status, 200);
  assert.ok(cartItems(syncData).length >= 2);
});

import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { test } from 'node:test';
import Fastify from 'fastify';
import jwtPlugin from '../plugins/jwt.js';
import ordersRoutes from '../routes/orders/index.js';
import mpesaRoutes from '../routes/payments/mpesa/index.js';
import stripeRoutes from '../routes/payments/stripe/index.js';
import paypalRoutes from '../routes/payments/paypal/index.js';
import { validateCheckout } from '../lib/checkout-validation.js';
import { backendUp } from './helpers/auth.js';

process.env.JWT_SECRET = 'isolated-regression-test-secret-at-least-32-characters';

async function fixture(t) {
  const orders = new Map();
  const users = new Map([
    ['buyer', { role: 'CUSTOMER', isActive: true }],
    ['other', { role: 'CUSTOMER', isActive: true }],
    ['disabled', { role: 'CUSTOMER', isActive: false }]
  ]);
  const catalog = {
    usd: { id: 'usd', name: 'USD product', currency: 'USD', price: 10 },
    kes: { id: 'kes', name: 'KES product', currency: 'KES', price: 180 }
  };
  const prisma = {
    user: { findUnique: async ({ where }) => users.get(where.id) || null },
    product: { findFirst: async ({ where }) => catalog[where.id]
      ? { ...catalog[where.id], images: [], sellerId: 'seller', saleUnit: 'PIECE' } : null },
    productVariant: { findFirst: async ({ where }) => ({ id: where.productId, stockQuantity: 5 }) },
    order: {
      findUnique: async ({ where }) => where.id ? orders.get(where.id) || null
        : [...orders.values()].find(o => o.idempotencyKey === where.idempotencyKey) || null,
      create: async ({ data }) => {
        const order = { ...data, id: randomUUID(), items: data.items.create, payments: [] };
        orders.set(order.id, order);
        return order;
      }
    },
    payment: { findFirst: async () => null }
  };
  const app = Fastify();
  app.decorate('prisma', prisma);
  app.decorate('payments', {
    stripe: { paymentIntents: { create: async () => { throw new Error('Provider must not be called'); } } }
  });
  await app.register(jwtPlugin);
  app.get('/protected', { onRequest: [app.authenticate] }, req => ({ role: req.user.role }));
  await app.register(ordersRoutes, { prefix: '/orders' });
  await app.register(mpesaRoutes, { prefix: '/payments/mpesa' });
  await app.register(stripeRoutes, { prefix: '/payments/stripe' });
  await app.register(paypalRoutes, { prefix: '/payments/paypal' });
  await app.ready();
  t.after(() => app.close());
  const auth = (sub = 'buyer', type = 'access') => ({
    authorization: `Bearer ${app.jwt.sign({ sub, type, role: 'ADMIN' })}`
  });
  const guest = { 'x-guest-order-token': randomBytes(32).toString('hex') };
  const payload = (id = 'usd') => ({
    items: [{ productId: id, name: 'Client name', price: 0.01, quantity: 1 }],
    contact: { email: 'buyer@example.test' },
    shippingAddress: { line1: '1 Test Road', city: 'Nairobi', country: 'KE' }
  });
  const create = (headers = guest, body = payload()) => app.inject({ method: 'POST', url: '/orders', headers, payload: body });
  return { app, orders, prisma, auth, guest, payload, create };
}

test('legacy checkout cannot create a paid order', async t => {
  const { create, auth, orders } = await fixture(t);
  for (const payload of [{}, { items: [] }]) {
    assert.equal((await create(auth(), payload)).statusCode, 400);
  }
  assert.equal(orders.size, 0);
});

test('access routes reject refresh, expired, invalid and disabled-account tokens', async t => {
  const { app, auth, create } = await fixture(t);
  const expired = { authorization: `Bearer ${app.jwt.sign({ sub: 'buyer', type: 'access' }, { expiresIn: -1 })}` };
  for (const headers of [auth('buyer', 'refresh'), auth('disabled'), expired, { authorization: 'Bearer invalid' }]) {
    assert.equal((await app.inject({ url: '/protected', headers })).statusCode, 401);
    assert.equal((await create(headers)).statusCode, 401, 'invalid auth must not become guest checkout');
  }
  const valid = await app.inject({ url: '/protected', headers: auth() });
  assert.equal(valid.statusCode, 200);
  assert.equal(valid.json().role, 'CUSTOMER', 'authorize using live role, not token role');
});

test('guest order IDs do not grant access to receipts or payments', async t => {
  const { app, create, guest, auth } = await fixture(t);
  assert.equal((await create({})).statusCode, 401);
  const created = await create();
  assert.equal(created.statusCode, 201);
  const id = created.json().orderId;
  assert.equal(created.json().status, 'PENDING_PAYMENT');
  assert.equal(created.json().totals.subtotal, 10, 'catalog price overrides client price');
  const read = await app.inject({ url: `/orders/${id}`, headers: guest });
  assert.equal(read.statusCode, 200);
  assert.equal(read.json().order.email, 'buyer@example.test');
  assert.equal(read.json().order.guestAccessTokenHash, undefined);
  for (const headers of [{}, auth(), { 'x-guest-order-token': 'a'.repeat(64) }]) {
    assert.equal((await app.inject({ url: `/orders/${id}`, headers })).statusCode, 404);
    for (const provider of ['stripe/create-intent', 'paypal/create-order', 'mpesa/stk']) {
      const res = await app.inject({ method: 'POST', url: `/payments/${provider}`, headers,
        payload: { orderId: id, ...(provider.startsWith('mpesa') ? { phone: '254712345678' } : {}) } });
      assert.equal(res.statusCode, 404, provider);
    }
  }
});

test('guest credentials cannot access owned orders and expire on guest orders', async t => {
  const { app, create, auth, guest, orders } = await fixture(t);
  const id = (await create(auth())).json().orderId;
  assert.equal((await app.inject({ url: `/orders/${id}`, headers: auth() })).statusCode, 200);
  for (const headers of [guest, auth('other')]) {
    assert.equal((await app.inject({ url: `/orders/${id}`, headers })).statusCode, 404);
  }
  const guestId = (await create()).json().orderId;
  orders.get(guestId).guestAccessExpiresAt = new Date(0);
  assert.equal((await app.inject({ url: `/orders/${guestId}`, headers: guest })).statusCode, 404);
});

test('idempotent retries retain ownership and do not create duplicate orders', async t => {
  const { create, guest, auth, orders } = await fixture(t);
  const headers = { ...guest, 'idempotency-key': 'retry-key-12345678' };
  const first = await create(headers);
  const retry = await create(headers);
  assert.equal(retry.statusCode, 200);
  assert.equal(retry.json().orderId, first.json().orderId);
  assert.equal(orders.size, 1);
  const other = await create({ ...auth(), 'idempotency-key': headers['idempotency-key'] });
  assert.notEqual(other.json().orderId, first.json().orderId);
  assert.equal(other.statusCode, 201);
});

test('checkout rejects mixed currencies and duplicate product lines', async t => {
  const { prisma, payload } = await fixture(t);
  await assert.rejects(validateCheckout(prisma, {
    items: [...payload('usd').items, ...payload('kes').items]
  }), /same currency/);
  await assert.rejects(validateCheckout(prisma, {
    items: [...payload('usd').items, ...payload('usd').items]
  }), /duplicate products/);
});

test('M-Pesa rejects USD at checkout and again when starting payment', async t => {
  const { app, create, guest, payload } = await fixture(t);
  assert.equal((await create(guest, { ...payload(), paymentMethod: 'mpesa' })).statusCode, 400);
  const id = (await create()).json().orderId;
  const res = await app.inject({ method: 'POST', url: '/payments/mpesa/stk', headers: guest,
    payload: { orderId: id, phone: '254712345678' } });
  assert.equal(res.statusCode, 400);
  assert.match(res.json().message, /KES/);
});

test('payment cannot restart after fulfillment, cancellation or refund', async t => {
  const { app, create, auth, orders, payload } = await fixture(t);
  const headers = auth();
  const id = (await create(headers, payload('kes'))).json().orderId;
  for (const status of ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'REFUNDED', 'CANCELLED']) {
    orders.get(id).status = status;
    for (const provider of ['stripe/create-intent', 'paypal/create-order', 'mpesa/stk']) {
      const res = await app.inject({ method: 'POST', url: `/payments/${provider}`, headers,
        payload: { orderId: id, ...(provider.startsWith('mpesa') ? { phone: '254712345678' } : {}) } });
      assert.equal(res.statusCode, 409, `${provider}: ${status}`);
    }
  }
});

test('address input cannot inject internal fulfillment flags', async t => {
  const { create, payload, guest, orders } = await fixture(t);
  const body = payload();
  body.shippingAddress.stockDecremented = true;
  const res = await create(guest, body);
  assert.equal(res.statusCode, 201);
  assert.equal(orders.get(res.json().orderId).shippingAddressJson.stockDecremented, undefined);
});

test('CI fails when the required integration API is unreachable', async t => {
  const before = process.env.REQUIRE_INTEGRATION_TESTS;
  process.env.REQUIRE_INTEGRATION_TESTS = '1';
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Connection refused'); });
  try {
    await assert.rejects(backendUp(), /Required integration API\/database unavailable/);
  } finally {
    if (before == null) delete process.env.REQUIRE_INTEGRATION_TESTS;
    else process.env.REQUIRE_INTEGRATION_TESTS = before;
  }
});

test('PayPal capture retries return success without charging again', async t => {
  const { app, create, guest, prisma, orders } = await fixture(t);
  const id = (await create()).json().orderId;
  orders.get(id).status = 'SHIPPED';
  prisma.payment.findFirst = async () => ({
    id: 'payment', orderId: id, status: 'SUCCESS', order: orders.get(id)
  });
  const res = await app.inject({ method: 'POST', url: '/payments/paypal/capture',
    headers: guest, payload: { paypalOrderId: 'provider-reference' } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.json().status, 'SUCCESS');
  assert.equal(res.json().orderStatus, 'SHIPPED');
});

test('M-Pesa status polling and PayPal capture enforce guest ownership', async t => {
  const { app, create, guest, prisma, orders } = await fixture(t);
  const id = (await create()).json().orderId;
  prisma.payment.findFirst = async () => ({
    id: 'payment', orderId: id, status: 'INITIATED', amount: 10, currency: 'USD', order: orders.get(id)
  });
  assert.equal((await app.inject({ url: '/payments/mpesa/status/reference', headers: guest })).statusCode, 200);
  assert.equal((await app.inject({ url: '/payments/mpesa/status/reference' })).statusCode, 404);
  assert.equal((await app.inject({ method: 'POST', url: '/payments/paypal/capture',
    payload: { paypalOrderId: 'reference' } })).statusCode, 404);
});

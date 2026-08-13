/**
 * Thin client helpers for the multi-provider payments flow. These call into
 * the Next.js API routes under `/api/payments/*` which proxy through to the
 * Fastify backend. Each helper throws on non-2xx so the checkout UI can
 * surface a friendly error.
 *
 * @typedef {Object} OrderItemPayload
 * @property {string} [id]
 * @property {string} [productId]
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {string} [image]
 * @property {string} [currency]
 *
 * @typedef {Object} CreateOrderPayload
 * @property {OrderItemPayload[]} items
 * @property {{ email?: string, phone?: string }} contact
 * @property {Record<string, string>} shippingAddress
 * @property {{ subtotal: number, shipping: number, tax: number, total: number }} totals
 * @property {string} [currency]
 * @property {string} [paymentMethod]
 */

async function jsonFetch(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  const text = await res.text();
  const data = text ? safeParse(text) : null;
  if (!res.ok) {
    const message = data?.message || data?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Create an order in PENDING_PAYMENT state. Optional `idempotencyKey` will
 * be passed as an `Idempotency-Key` header so retries don't create dupes.
 * @param {CreateOrderPayload} payload
 * @param {{ idempotencyKey?: string, authToken?: string }} [opts]
 */
export async function createOrder(payload, opts = {}) {
  const headers = {};
  if (opts.idempotencyKey) headers['Idempotency-Key'] = opts.idempotencyKey;
  if (opts.authToken) headers.Authorization = `Bearer ${opts.authToken}`;
  return jsonFetch('/api/orders', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
}

/** @param {string} orderId */
export async function getOrder(orderId) {
  return jsonFetch(`/api/orders/${encodeURIComponent(orderId)}`);
}

// ---------- M-Pesa ----------

// No `amount` param — the backend always charges the server-side order
// total and rejects a client-supplied amount (see H2 in the security
// review). Passing one here would just be misleading dead weight.
export async function startMpesaStk(orderId, phone, opts = {}) {
  return jsonFetch('/api/payments/mpesa/stk', {
    method: 'POST',
    body: JSON.stringify({
      orderId,
      phone,
      ...(opts.forceNew ? { forceNew: true } : {})
    })
  });
}

export async function pollMpesaStatus(checkoutRequestId) {
  return jsonFetch(
    `/api/payments/mpesa/status/${encodeURIComponent(checkoutRequestId)}`
  );
}

// ---------- PayPal ----------

export async function createPaypalOrder(orderId, urls = {}) {
  return jsonFetch('/api/payments/paypal/create-order', {
    method: 'POST',
    body: JSON.stringify({
      orderId,
      returnUrl: urls.returnUrl,
      cancelUrl: urls.cancelUrl
    })
  });
}

export async function capturePaypal(paypalOrderId) {
  return jsonFetch('/api/payments/paypal/capture', {
    method: 'POST',
    body: JSON.stringify({ paypalOrderId })
  });
}

// ---------- Stripe ----------

export async function createStripeIntent(orderId) {
  return jsonFetch('/api/payments/stripe/create-intent', {
    method: 'POST',
    body: JSON.stringify({ orderId })
  });
}

/**
 * Poll a payment terminal state. Resolves when the underlying status leaves
 * the in-flight set (`INITIATED`, `PENDING`) or rejects on `timeoutMs`.
 *
 * @param {() => Promise<{ status: string } & Record<string, any>>} fn poll fn
 * @param {{ intervalMs?: number, timeoutMs?: number, terminal?: string[] }} [opts]
 */
export async function pollUntilTerminal(fn, opts = {}) {
  const interval = opts.intervalMs ?? 3000;
  const timeout = opts.timeoutMs ?? 60000;
  const terminal = new Set(
    opts.terminal ?? ['SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED']
  );
  const start = Date.now();
  for (;;) {
    const result = await fn();
    if (terminal.has(String(result?.status))) return result;
    if (Date.now() - start >= timeout) {
      const err = new Error('Payment status polling timed out');
      err.code = 'TIMEOUT';
      err.lastResult = result;
      throw err;
    }
    await new Promise((r) => setTimeout(r, interval));
  }
}

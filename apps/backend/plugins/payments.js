import fp from 'fastify-plugin';
import rawBody from 'fastify-raw-body';
import Stripe from 'stripe';

/**
 * Multi-provider payments plugin.
 *
 * Decorates fastify with `payments` giving routes access to a configured
 * Stripe client, an M-Pesa Daraja token helper, and a PayPal token helper.
 *
 * Also registers `fastify-raw-body` (opt-in per route via
 * `config: { rawBody: true }`) so Stripe webhooks can verify the signature
 * against the original byte payload.
 */
export default fp(async (fastify) => {
  await fastify.register(rawBody, {
    field: 'rawBody',
    global: false,
    encoding: false,
    runFirst: true,
    routes: []
  });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const stripe = stripeKey
    ? new Stripe(stripeKey, {
        // Pin a recent stable API version. Adjust when upgrading Stripe.
        apiVersion: '2024-12-18.acacia',
        appInfo: { name: 'soko-africa', version: '0.1.0' }
      })
    : null;

  if (!stripe) {
    fastify.log.warn(
      'STRIPE_SECRET_KEY not set — Stripe routes will return 503 until configured.'
    );
  } else if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_WEBHOOK_SECRET) {
    // Mirrors the JWT_SECRET / ALLOWED_ORIGINS startup guards elsewhere: a
    // half-configured payment provider (live secret key, no webhook secret)
    // is exactly the state that let the webhook route silently accept
    // unsigned payloads (H1 in the security review). Refuse to boot rather
    // than risk it.
    throw new Error(
      'STRIPE_WEBHOOK_SECRET is required in production when STRIPE_SECRET_KEY is set.'
    );
  }

  const mpesaEnv = (process.env.MPESA_ENV || 'sandbox').toLowerCase();
  const mpesaBase =
    mpesaEnv === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

  const mpesaTokenCache = { token: null, expiresAt: 0 };

  async function mpesaGetToken() {
    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;
    if (!key || !secret) {
      const err = new Error('M-Pesa credentials not configured');
      err.statusCode = 503;
      throw err;
    }
    const now = Date.now();
    if (mpesaTokenCache.token && mpesaTokenCache.expiresAt > now + 30_000) {
      return mpesaTokenCache.token;
    }
    const credentials = Buffer.from(`${key}:${secret}`).toString('base64');
    const res = await fetch(
      `${mpesaBase}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${credentials}` } }
    );
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(`Daraja auth failed (${res.status}): ${text}`);
      err.statusCode = 502;
      throw err;
    }
    const data = await res.json();
    mpesaTokenCache.token = data.access_token;
    const ttlSeconds = Number(data.expires_in || 3599);
    mpesaTokenCache.expiresAt = now + ttlSeconds * 1000;
    return mpesaTokenCache.token;
  }

  /** Format YYYYMMDDHHmmss timestamp required by Daraja. */
  function mpesaTimestamp(date = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    return (
      date.getFullYear().toString() +
      pad(date.getMonth() + 1) +
      pad(date.getDate()) +
      pad(date.getHours()) +
      pad(date.getMinutes()) +
      pad(date.getSeconds())
    );
  }

  function mpesaPassword(timestamp) {
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || '';
    return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  }

  async function mpesaStkPush({ phone, amount, accountReference, description }) {
    const token = await mpesaGetToken();
    const timestamp = mpesaTimestamp();
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const callbackUrl = process.env.MPESA_CALLBACK_URL;
    if (!callbackUrl) {
      const err = new Error('MPESA_CALLBACK_URL is not configured');
      err.statusCode = 503;
      throw err;
    }
    // Daraja does not sign or authenticate its callback requests, so a
    // pre-shared secret is embedded in the callback URL we register with
    // Safaricom. The callback route (routes/payments/mpesa/index.js) rejects
    // any request whose `key` query param doesn't match this value — without
    // it, anyone who obtains a CheckoutRequestID (returned by this same STK
    // endpoint) could forge a "payment succeeded" callback.
    const callbackSecret = process.env.MPESA_CALLBACK_SECRET;
    if (!callbackSecret) {
      const err = new Error('MPESA_CALLBACK_SECRET is not configured');
      err.statusCode = 503;
      throw err;
    }
    const signedCallbackUrl = new URL(callbackUrl);
    signedCallbackUrl.searchParams.set('key', callbackSecret);

    const body = {
      BusinessShortCode: shortcode,
      Password: mpesaPassword(timestamp),
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.max(1, Math.round(Number(amount))),
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: signedCallbackUrl.toString(),
      AccountReference: (accountReference || 'SokoAfrica').slice(0, 12),
      TransactionDesc: (description || 'Order payment').slice(0, 13)
    };
    const res = await fetch(`${mpesaBase}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(
        `Daraja STK push failed (${res.status}): ${JSON.stringify(data)}`
      );
      err.statusCode = 502;
      err.providerResponse = data;
      throw err;
    }
    return data;
  }

  async function mpesaStkQuery(checkoutRequestId) {
    const token = await mpesaGetToken();
    const timestamp = mpesaTimestamp();
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const body = {
      BusinessShortCode: shortcode,
      Password: mpesaPassword(timestamp),
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };
    const res = await fetch(`${mpesaBase}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  const paypalEnv = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
  const paypalBase =
    paypalEnv === 'live' || paypalEnv === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

  const paypalTokenCache = { token: null, expiresAt: 0 };

  async function paypalGetToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !secret) {
      const err = new Error('PayPal credentials not configured');
      err.statusCode = 503;
      throw err;
    }
    const now = Date.now();
    if (paypalTokenCache.token && paypalTokenCache.expiresAt > now + 30_000) {
      return paypalTokenCache.token;
    }
    const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64');
    const res = await fetch(`${paypalBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(`PayPal auth failed (${res.status}): ${text}`);
      err.statusCode = 502;
      throw err;
    }
    const data = await res.json();
    paypalTokenCache.token = data.access_token;
    const ttlSeconds = Number(data.expires_in || 32000);
    paypalTokenCache.expiresAt = now + ttlSeconds * 1000;
    return paypalTokenCache.token;
  }

  async function paypalFetch(path, init = {}) {
    const token = await paypalGetToken();
    const res = await fetch(`${paypalBase}${path}`, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    return { ok: res.ok, status: res.status, data };
  }

  fastify.decorate('payments', {
    stripe,
    mpesa: {
      env: mpesaEnv,
      baseUrl: mpesaBase,
      getToken: mpesaGetToken,
      stkPush: mpesaStkPush,
      stkQuery: mpesaStkQuery
    },
    paypal: {
      env: paypalEnv,
      baseUrl: paypalBase,
      getToken: paypalGetToken,
      fetch: paypalFetch
    }
  });
});

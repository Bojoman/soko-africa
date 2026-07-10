# Soko Africa — Payments cheat sheet

Multi-provider payments are wired up across three providers: **Safaricom
M-Pesa (Daraja STK Push)**, **PayPal Orders v2**, and **Stripe
PaymentIntents**. All run in sandbox / test mode by default.

This document walks through the env vars, the testing flow per provider,
and how to wire webhooks locally.

---

## 0. Environment variables

Append the values from [`.env.example`](./.env.example) into your local
`.env`. The minimum you need to test each provider:

```
# M-Pesa Daraja (sandbox)
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=174379
MPESA_PASSKEY=...
MPESA_CALLBACK_URL=https://<your-tunnel>/payments/mpesa/callback

# PayPal (sandbox)
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Stripe (test)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AY...   # for the PayPal buttons in the frontend
```

> If a provider's keys are not set, the server starts cleanly but its
> routes return `503 Service Unavailable` (Stripe) or `503` with a clear
> message (M-Pesa / PayPal). No silent failures.

---

## 1. Database migration

The schema gained:

- `Order.{ email, phone, subtotal, shipping, tax, shippingAddressJson }` (all nullable)
- `Order.userId` is now nullable to support guest checkout
- `OrderItem.{ productId, productName, productImage, subtotal }` (all nullable)
- `Payment.{ rawPayload }` + `provider` accepts the string values
  `MPESA | PAYPAL | STRIPE` (legacy values like `stub` still work)
- New enum values: `OrderStatus.{ FAILED, REFUNDED }` and
  `PaymentStatus.{ INITIATED, SUCCESS, CANCELLED }`

To apply on a clean DB:

```bash
pnpm --filter backend exec prisma migrate dev --name add-multi-provider-payments
```

> If your local DB already has these tables but no migration history (drift),
> use a non-destructive sync instead:
>
> ```bash
> pnpm --filter backend exec prisma db push
> ```
>
> ⚠️ `db push` is only safe in development. In production always go through
> `prisma migrate deploy` against a properly versioned migration.

---

## 2. M-Pesa STK Push (Daraja)

Sandbox phone numbers (these auto-respond with success/cancel):

| Number          | What it does                                  |
| --------------- | --------------------------------------------- |
| `254708374149`  | Auto-success (default test buyer)             |
| `254711222333`  | Cancelled by user (`ResultCode: 1032`)        |
| any other valid | Returns a timeout (`ResultCode != 0`)         |

Flow:

1. `POST /orders` with `items + contact + shipping + totals`
   → server returns `{ orderId, totals }`.
2. `POST /payments/mpesa/stk` with `{ orderId, phone, amount? }`
   → server initiates STK push, creates `Payment` (status `INITIATED`),
     responds with `{ checkoutRequestId, merchantRequestId }`.
3. Daraja POSTs the result to `MPESA_CALLBACK_URL`
   (`POST /payments/mpesa/callback`).
4. The frontend polls `GET /payments/mpesa/status/:checkoutRequestId`
   every ~3 s until the payment leaves `INITIATED` / `PENDING`.

### Local webhook tunnel

Daraja needs a public HTTPS URL. Use any tunnel:

```bash
# ngrok
ngrok http 3001
# cloudflared
cloudflared tunnel --url http://localhost:3001
```

Set `MPESA_CALLBACK_URL=https://<random>.ngrok-free.app/payments/mpesa/callback`
in `.env`, then restart the backend.

---

## 3. PayPal Orders v2

Sandbox test accounts live at
<https://developer.paypal.com/dashboard/accounts>. Each app comes with a
buyer (`sb-...@personal.example.com`) and a business account; the buyer's
default password is shown on the same page.

Flow:

1. `POST /orders` → returns `orderId`.
2. `POST /payments/paypal/create-order` with `{ orderId, returnUrl, cancelUrl }`
   → server creates a PayPal Order and stores it as a `Payment`
     (status `INITIATED`, `providerRef = paypalOrderId`).
   Returns `{ paypalOrderId, approveUrl }`.
3. The frontend either renders the PayPal Buttons (`@paypal/react-paypal-js`)
   or redirects the buyer to `approveUrl`.
4. After approval, the frontend calls
   `POST /payments/paypal/capture` with `{ paypalOrderId }`.
5. Optional: webhooks at `POST /payments/paypal/webhook` finalise
   `PAYMENT.CAPTURE.COMPLETED / DENIED / REFUNDED / CHECKOUT.ORDER.VOIDED`.

### Local webhook tunnel

PayPal webhooks need a public HTTPS URL too. Use the same tunnel
(`ngrok http 3001`) and register
`https://<tunnel>/payments/paypal/webhook` as a webhook on your sandbox
app. Subscribe at minimum to:

- `CHECKOUT.ORDER.APPROVED`
- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.DENIED`
- `PAYMENT.CAPTURE.REFUNDED`
- `CHECKOUT.ORDER.VOIDED`

> Signature verification via `PAYPAL_WEBHOOK_ID` is not yet enabled.
> Production deployments should add the
> `/v1/notifications/verify-webhook-signature` call.

---

## 4. Stripe Payment Intents (cards)

Test cards from <https://docs.stripe.com/testing>:

| Card                  | Outcome                                  |
| --------------------- | ---------------------------------------- |
| `4242 4242 4242 4242` | Always succeeds                          |
| `4000 0000 0000 9995` | Insufficient funds                       |
| `4000 0025 0000 3155` | Requires authentication (3DS)            |
| `4000 0000 0000 0002` | Always declined                          |

Any future expiry date, any CVV, any postal code.

Flow:

1. `POST /orders` → returns `orderId`.
2. `POST /payments/stripe/create-intent` with `{ orderId }`
   → server creates / updates a `PaymentIntent`, returns
     `{ clientSecret, paymentIntentId }`.
3. Frontend renders `<Elements stripe={...} options={{ clientSecret }}>`
   with `<PaymentElement />` and calls `stripe.confirmPayment` on submit.
4. Stripe POSTs `payment_intent.succeeded` / `payment_intent.payment_failed`
   to `POST /payments/stripe/webhook`, which **requires the raw body** for
   signature verification (handled by `fastify-raw-body`).

### Local webhook with Stripe CLI

```bash
# install: https://docs.stripe.com/stripe-cli
stripe login
stripe listen --forward-to localhost:3001/payments/stripe/webhook
```

The CLI prints a `whsec_...` secret — copy it into `STRIPE_WEBHOOK_SECRET`
and restart the backend. The CLI keeps a websocket open and rewrites
signatures as it forwards events.

---

## 5. Manual end-to-end test (curl)

```bash
# 1. Create the order (no auth)
curl -X POST http://localhost:3001/orders \
  -H 'content-type: application/json' \
  -d '{
    "items":[{"name":"Sample","price":12.50,"quantity":2}],
    "contact":{"email":"buyer@example.com","phone":"254708374149"},
    "shippingAddress":{"line1":"123 Demo","city":"Nairobi","country":"Kenya"},
    "totals":{"subtotal":25,"shipping":9.99,"tax":0,"total":34.99},
    "currency":"USD"
  }'
# => { "orderId": "...", "totals": { ... } }

# 2a. M-Pesa
curl -X POST http://localhost:3001/payments/mpesa/stk \
  -H 'content-type: application/json' \
  -d '{ "orderId":"<id>", "phone":"254708374149", "amount":1 }'

# 2b. PayPal
curl -X POST http://localhost:3001/payments/paypal/create-order \
  -H 'content-type: application/json' \
  -d '{ "orderId":"<id>", "returnUrl":"http://localhost:3000/orders/<id>", "cancelUrl":"http://localhost:3000/checkout" }'

# 2c. Stripe
curl -X POST http://localhost:3001/payments/stripe/create-intent \
  -H 'content-type: application/json' \
  -d '{ "orderId":"<id>" }'

# 3. Poll order status (no auth required for guest orders)
curl http://localhost:3001/orders/<id>
```

---

## 6. What the sibling security/perf agent still owns

- Rate-limit tuning for `/payments/*` non-webhook routes (the webhook routes
  are already `rateLimit: false`).
- CSP relaxation in `apps/frontend/next.config.mjs` for Stripe + PayPal
  hosts (`js.stripe.com`, `api.stripe.com`, `*.paypal.com`,
  `*.paypalobjects.com`). This file has been touched here only to add the
  minimum CSP/img-src entries needed for Stripe + PayPal to load — feel
  free to harden further but keep those hosts allow-listed.
- Optional: enable PayPal webhook signature verification with
  `PAYPAL_WEBHOOK_ID` once provisioned.

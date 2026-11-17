# Checkout safety and regression checks

Every order now starts in `PENDING_PAYMENT`. `POST /orders` requires a nonempty
`items` array; the former cart-only stub-payment endpoint has been removed.
Only verified payment handlers may settle a purchase. The server always loads
catalog prices and rejects mixed currencies, duplicate product lines and
non-KES M-Pesa payments. Existing paid, processing, shipped, delivered, cancelled
and refunded orders cannot start another payment.

## Deploying this change

Run `pnpm --filter backend exec prisma generate` and
`pnpm --filter backend exec prisma migrate deploy` before starting the updated
backend. Migration `20261117090000_guest_order_access` adds nullable credential
hash and expiry columns to `Order`. Deploy the frontend and backend together:
old anonymous clients no longer have permission to retrieve or pay guest orders.

Existing account orders remain accessible to their owners. Existing guest orders
have no private credential and are deliberately denied by the public order API;
support must verify ownership before arranging access. Clearing browser cookies,
using a different browser, or reaching the 30-day guest-access expiry also requires
support. An order ID or email address alone must never be used as proof of ownership.

## Guest checkout contract

The browser first calls `POST /api/checkout/session`. It establishes a random,
HttpOnly, SameSite=Lax cookie, Secure in production, before order creation so a lost
response can be retried. The Next.js proxy forwards the cookie privately to the
backend as `X-Guest-Order-Token`; JavaScript and URLs never contain that credential.
The database stores only its SHA-256 hash. Receipt reads, all payment starts,
PayPal capture and M-Pesa status polling require the matching unexpired credential.

Direct API clients must generate and privately retain 32 random bytes encoded as
64 lowercase hexadecimal characters, and send them in `X-Guest-Order-Token` when
creating and accessing guest orders. Account clients use an access JWT. Refresh
JWTs, expired JWTs and disabled accounts are rejected; invalid credentials never
fall back to an anonymous checkout. Idempotency keys are scoped to the account or
guest credential rather than shared across customers.

## Tests

Offline checks, from the repository root:

```sh
node --test apps/backend/test/checkout-security.test.js apps/backend/test/money.test.js apps/backend/test/fulfillment.test.js packages/units/test/rules.test.js
pnpm --filter frontend lint
```

The GitHub Actions workflow provisions a fresh `soko_africa_test` database, applies
all migrations, seeds it, starts the API and waits for database readiness. It then
runs backend integration tests, shared-package tests, the frontend build and
Playwright browser tests. Required integration tests fail when the API is missing.

For local integration runs, use an isolated local database whose name ends in
`_test`. Set both `DATABASE_URL` and `TEST_DATABASE_URL` to that database, set
`NODE_ENV=test`, `REQUIRE_INTEGRATION_TESTS=1`, and `API_URL` to the test API.
Generate, migrate and seed only that disposable database, then start the API and
run `pnpm --filter backend test`. The seed script deletes catalog data, so never
point it at an application database. Paid fulfillment fixtures are created directly
in this test database; there is no test payment endpoint in the application.

For browser tests, build with `NEXT_PUBLIC_API_URL` and `BACKEND_URL` pointing to
the test API, leave public payment-provider keys empty, install Chromium using
`pnpm --filter frontend exec playwright install chromium`, then run
`pnpm --filter frontend test:e2e`. Playwright starts the production frontend on
`http://localhost:3100`; Chromium permits Secure cookies on localhost. Tests cover
login, real guest checkout up to payment initiation, and receipt isolation. They do
not charge a card, call Daraja or complete a live PayPal transaction.

## Remaining commerce work

Inventory reservations across simultaneous orders, durable payment reconciliation,
seller payouts and refunds remain separate work. Duplicate-line rejection closes
one stock-validation bypass; it does not provide concurrent inventory reservations.
Provider sandbox end-to-end payment verification still requires configured accounts
and public webhook URLs. Shipping tariffs, currency conversion and tax policy are
not implemented by this change.

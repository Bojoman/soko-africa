# Soko Africa — Test Plan (Pre-Deploy)

**Version:** 1.0  
**Date:** 2026-06-24  
**Stack:** Next.js 16 (frontend) · Fastify 5 + Prisma 7 + PostgreSQL (backend)

---

## 1. Test environment

| Item | Value |
|------|--------|
| Node | ≥ 20 (`.nvmrc` / `engines`) |
| Package manager | pnpm 9+ |
| Database | Postgres 16 (`docker compose up -d`) |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| API docs | http://localhost:3001/api/docs |

### Seed data (run before testing)

```bash
pnpm --filter backend run db:seed
# or: pnpm --filter backend exec prisma db seed
```

| Role | Email | Password |
|------|-------|----------|
| Admin | `seed.admin@soko-africa.test` | `Seller123!@` |
| Seller | `seed.farmer@soko-africa.test` | `Seller123!@` |
| Seller 2 | `seed.craft@soko-africa.test` | `Seller123!@` |

**Important:** For **browser login** on `http://localhost`, use `pnpm dev` (not `next start`). Production mode sets `Secure` cookies, which browsers will not send over plain HTTP.

---

## 2. Automated checks (CI)

Run locally before every deploy:

```bash
pnpm install
docker compose up -d
pnpm --filter backend exec prisma migrate deploy
pnpm --filter backend exec prisma generate
pnpm --filter backend run db:seed        # optional for fresh DB
pnpm --filter frontend lint
pnpm --filter frontend build
pnpm --filter backend test
```

GitHub Actions (`.github/workflows/ci.yml`) runs lint, build, migrations, and backend tests on push/PR.

---

## 3. UI test results (2026-06-24)

| Area | Result | Notes |
|------|--------|-------|
| Homepage `/` | **PASS** | Hero, categories, seasonal picks, 32 seeded products, testimonials section |
| Products `/products` | **PASS** | Catalog loads, pagination (12 of 32), filters, sort |
| About `/about` | **PASS** | Page renders; stats fetch from `/api/stats/platform` |
| Login form `/auth/login` | **BLOCKED locally** | `next start` + HTTP → Secure cookies not stored; use `pnpm dev` |
| Admin dashboard | **API PASS** | `GET /admin/dashboard` with Bearer token returns live stats |
| Seller analytics | **API PASS** | `GET /seller/analytics?range=30d` returns data |
| Platform stats | **PASS** | `GET /stats/platform` → 2 artisans, products count |
| Testimonials API | **PASS** | `GET /stats/testimonials` → 200 |
| BFF proxy (auth) | **VERIFY** | After login via browser in dev mode, hit `/api/admin/dashboard` |

### Backend fixes applied during test session

- `productIdParam` hoisting in `routes/products/index.js` (startup crash)
- `seller/analytics` import path → `../../../lib/analytics-range.js`
- Prisma seed command registered in `prisma.config.ts`

---

## 4. Manual test matrix

### 4.1 Public (no login)

- [ ] Homepage loads without console errors
- [ ] Search returns products
- [ ] Category pages show filtered products
- [ ] Product detail page: images, price, add to cart
- [ ] Cart: add/remove items, coupon `WELCOME10` / `SOKO10`
- [ ] About page stats animate from live API
- [ ] Testimonials section shows fallback or live reviews
- [ ] Register new customer account
- [ ] Forgot password email (or JSON log in dev)

### 4.2 Customer (BUYER)

- [ ] Login / logout / session refresh
- [ ] Account dashboard shows orders
- [ ] Profile: update name, phone, country, bio
- [ ] Addresses: CRUD
- [ ] Payment methods: add M-Pesa number, set default, delete
- [ ] Wishlist add/remove
- [ ] Checkout: totals match cart (subtotal, coupon, shipping, free ship > $75)
- [ ] Place order (without payment) or complete Stripe/PayPal/M-Pesa sandbox flow

### 4.3 Seller

- [ ] Login as `seed.farmer@soko-africa.test`
- [ ] Seller dashboard: products + orders from API
- [ ] Products CRUD: create, edit, delete
- [ ] Analytics: change 7d / 30d / 90d / 1y ranges
- [ ] Seller apply flow from `/sell`

### 4.4 Admin

- [ ] Login as `seed.admin@soko-africa.test`
- [ ] Dashboard stats (users, sellers, products, revenue)
- [ ] Pending approvals list
- [ ] Approve seller / publish draft product
- [ ] System status indicators (API, DB, payments, email)

### 4.5 Payments (sandbox)

Configure keys in `apps/backend/.env` and `apps/frontend/.env.local`:

- [ ] Stripe test card `4242…` — intent + webhook or capture flow
- [ ] PayPal sandbox — create + capture order
- [ ] M-Pesa Daraja sandbox — STK push (requires public HTTPS callback via ngrok/cloudflared)

### 4.6 Security

- [ ] JWT secret is unique in production (not default)
- [ ] Admin routes return 403 for non-admin
- [ ] Seller routes return 403 without seller profile
- [ ] Rate limiting on auth endpoints
- [ ] httpOnly cookies; no tokens in localStorage (legacy keys cleared)
- [ ] CORS `ALLOWED_ORIGINS` matches production domain only

---

## 5. Regression smoke script (API)

```powershell
# Health
Invoke-RestMethod http://localhost:3001/health

# Public stats
Invoke-RestMethod http://localhost:3000/api/stats/platform

# Admin (Bearer)
$login = Invoke-RestMethod -Uri http://localhost:3001/auth/login -Method POST -ContentType "application/json" -Body '{"email":"seed.admin@soko-africa.test","password":"Seller123!@"}'
$h = @{ Authorization = "Bearer $($login.tokens.accessToken)" }
Invoke-RestMethod -Uri http://localhost:3001/admin/dashboard -Headers $h
```

---

## 6. Known gaps / post-MVP

| Item | Priority |
|------|----------|
| E2E tests (Playwright) for login + checkout | High |
| Stripe SetupIntent for full card save | Medium |
| Email SMTP in production | High |
| Payment webhooks on public HTTPS URL | High |
| FAQ seed data (about page shows empty FAQs if backend unreachable at build) | Low |
| Turbopack dev crash on long-running `pnpm dev` (restart if frontend dies) | Medium |

---

## 7. Sign-off checklist

Before production deploy, confirm:

- [ ] All **§4** critical paths checked (at minimum: public browse, login, cart, checkout math, seller CRUD, admin dashboard)
- [ ] CI green on `main`
- [ ] Migrations applied on staging DB
- [ ] Production env vars set (see `DEPLOYMENT_PLAN.md`)
- [ ] Smoke script passes against staging URLs
- [ ] Rollback plan documented (previous image + DB backup)

**Tested by:** _______________  
**Date:** _______________  
**Approved for deploy:** _______________

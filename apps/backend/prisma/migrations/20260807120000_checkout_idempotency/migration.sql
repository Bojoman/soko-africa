-- Client Idempotency-Key for Place Order retries.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Order_idempotencyKey_key" ON "Order"("idempotencyKey");

-- Collapse duplicate (provider, providerRef) rows before enforcing uniqueness.
-- Keep the earliest payment; clear the ref on later siblings so they remain
-- as audit rows without blocking the unique index.
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "provider", "providerRef"
      ORDER BY "createdAt" ASC, id ASC
    ) AS rn
  FROM "Payment"
  WHERE "providerRef" IS NOT NULL
)
UPDATE "Payment" p
SET "providerRef" = NULL
FROM ranked r
WHERE p.id = r.id AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS "Payment_provider_providerRef_key"
  ON "Payment"("provider", "providerRef");

-- At most one in-flight M-Pesa STK per order. Older open pushes are cancelled
-- so the unique partial index can be created safely.
WITH open_mpesa AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "orderId"
      ORDER BY "createdAt" DESC, id DESC
    ) AS rn
  FROM "Payment"
  WHERE "provider" = 'MPESA' AND "status" IN ('PENDING', 'INITIATED')
)
UPDATE "Payment" p
SET "status" = 'CANCELLED'
FROM open_mpesa o
WHERE p.id = o.id AND o.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS "Payment_one_open_mpesa_per_order"
  ON "Payment"("orderId")
  WHERE "provider" = 'MPESA' AND "status" IN ('PENDING', 'INITIATED');

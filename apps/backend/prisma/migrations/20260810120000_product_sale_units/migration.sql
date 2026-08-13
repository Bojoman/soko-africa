-- Sale units and fractional quantities.
--
-- HAND-WRITTEN, NOT GENERATED. `prisma migrate dev` renders an Int -> Decimal
-- column change as DROP COLUMN + ADD COLUMN, which would zero every live cart
-- and every historical order line's quantity. The ALTER ... USING form below
-- widens the columns in place and preserves every existing value.
--
-- Every default is a no-op: existing listings become PIECE with step 1 and
-- minimum 1, which is exactly how they behaved before this migration.

-- ---------------------------------------------------------------- enums --

CREATE TYPE "SaleUnit" AS ENUM (
  'PIECE', 'BUNCH', 'DOZEN', 'TRAY', 'CRATE', 'SACK', 'PACK', 'BUNDLE',
  'PUNNET', 'GRAM', 'KILOGRAM', 'MILLILITRE', 'LITRE', 'CENTIMETRE', 'METRE'
);

CREATE TYPE "MeasureUnit" AS ENUM (
  'GRAM', 'KILOGRAM', 'MILLILITRE', 'LITRE', 'CENTIMETRE', 'METRE'
);

-- -------------------------------------------------------------- product --

ALTER TABLE "Product"
  ADD COLUMN "saleUnit"         "SaleUnit"     NOT NULL DEFAULT 'PIECE',
  ADD COLUMN "quantityStep"     DECIMAL(12, 3) NOT NULL DEFAULT 1,
  ADD COLUMN "minOrderQuantity" DECIMAL(12, 3) NOT NULL DEFAULT 1,
  ADD COLUMN "maxOrderQuantity" DECIMAL(12, 3),
  ADD COLUMN "netContentValue"  DECIMAL(12, 3),
  ADD COLUMN "netContentUnit"   "MeasureUnit";

-- Units are NOT inferred from the denormalized `category` string. Guessing
-- "pears" -> KILOGRAM would reinterpret a 180-per-piece price as 180 per kg,
-- a 10x pricing change no seller authorised. Everything stays PIECE until a
-- seller says otherwise.

-- ------------------------------------------------------- variant stock --

ALTER TABLE "ProductVariant"
  ADD COLUMN "stockQuantity" DECIMAL(12, 3) NOT NULL DEFAULT 0;

UPDATE "ProductVariant" SET "stockQuantity" = "stock";

-- `checkout-validation.js` used to conjure a variant with stock 999 for any
-- product lacking one, from an unauthenticated guest-checkout path, which
-- made the stock check that followed unconditionally pass. That is being
-- removed, so give orphaned products a real variant at zero stock instead.
INSERT INTO "ProductVariant" ("id", "productId", "sku", "stock", "stockQuantity", "createdAt", "updatedAt")
SELECT gen_random_uuid(), p."id", 'DEFAULT', 0, 0, NOW(), NOW()
FROM "Product" p
WHERE NOT EXISTS (
  SELECT 1 FROM "ProductVariant" v WHERE v."productId" = p."id"
);

-- ----------------------------------------------- quantity: Int -> Decimal --

ALTER TABLE "CartItem"
  ALTER COLUMN "quantity" TYPE DECIMAL(12, 3) USING "quantity"::DECIMAL(12, 3);
ALTER TABLE "CartItem"
  ALTER COLUMN "quantity" SET DEFAULT 1;

ALTER TABLE "OrderItem"
  ALTER COLUMN "quantity" TYPE DECIMAL(12, 3) USING "quantity"::DECIMAL(12, 3);

-- -------------------------------------------- order line unit snapshots --

ALTER TABLE "OrderItem"
  ADD COLUMN "saleUnit"        "SaleUnit",
  ADD COLUMN "quantityStep"    DECIMAL(12, 3),
  ADD COLUMN "netContentValue" DECIMAL(12, 3),
  ADD COLUMN "netContentUnit"  "MeasureUnit";

-- Backfill history so old receipts render through the same code path as new
-- ones rather than needing a null-check branch.
UPDATE "OrderItem"
SET "saleUnit" = 'PIECE', "quantityStep" = 1
WHERE "saleUnit" IS NULL;

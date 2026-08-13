-- Per-seller fulfillment.
--
-- Shipment was order-level, so a multi-seller order had no way to express
-- "seller A shipped, seller B hasn't". Scoping a shipment to a seller is what
-- makes the fulfillment workflow representable at all.

ALTER TABLE "Shipment" ADD COLUMN "sellerId" TEXT;

ALTER TABLE "Shipment"
  ADD CONSTRAINT "Shipment_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "SellerProfile"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Shipment_sellerId_idx" ON "Shipment"("sellerId");

-- One shipment per seller per order. Postgres treats NULLs as distinct in a
-- unique index, so pre-existing order-level rows (sellerId NULL) are left
-- alone rather than colliding with each other.
CREATE UNIQUE INDEX "Shipment_orderId_sellerId_key"
  ON "Shipment"("orderId", "sellerId");

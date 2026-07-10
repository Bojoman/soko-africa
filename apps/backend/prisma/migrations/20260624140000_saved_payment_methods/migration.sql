CREATE TABLE IF NOT EXISTS "SavedPaymentMethod" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "stripePaymentMethodId" TEXT,
  "brand" TEXT,
  "last4" TEXT,
  "expiryMonth" INTEGER,
  "expiryYear" INTEGER,
  "holderName" TEXT,
  "phoneNumber" TEXT,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SavedPaymentMethod_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

CREATE INDEX IF NOT EXISTS "SavedPaymentMethod_userId_idx" ON "SavedPaymentMethod"("userId");

DO $$ BEGIN
  ALTER TABLE "SavedPaymentMethod" ADD CONSTRAINT "SavedPaymentMethod_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Order"
ADD COLUMN "guestAccessTokenHash" TEXT,
ADD COLUMN "guestAccessExpiresAt" TIMESTAMP(3);

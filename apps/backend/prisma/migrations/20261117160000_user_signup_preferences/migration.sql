-- Signup choices collected on the register form.
-- sellerIntent records that the person asked to sell. It does not grant Role.SELLER.
ALTER TABLE "User" ADD COLUMN "sellerIntent" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "newsletterOptIn" BOOLEAN NOT NULL DEFAULT false;

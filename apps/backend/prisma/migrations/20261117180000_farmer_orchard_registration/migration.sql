-- Orchard producer registrations. Not a seller licence and not a payment.
CREATE TYPE "FarmerOwnership" AS ENUM ('INDEPENDENT', 'COMPANY');

CREATE TYPE "FarmerRegistrationStatus" AS ENUM ('SUBMITTED', 'REVIEWED');

CREATE TABLE "FarmerRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sellerProfileId" TEXT,
    "fullName" TEXT NOT NULL,
    "nationalIdNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "ownership" "FarmerOwnership" NOT NULL DEFAULT 'INDEPENDENT',
    "acceptedFullName" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL,
    "status" "FarmerRegistrationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "notes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmerRegistration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Orchard" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "pinDescription" TEXT,
    "acreage" DECIMAL(10,2),
    "treeCount" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orchard_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrchardCrop" (
    "id" TEXT NOT NULL,
    "orchardId" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "variety" TEXT,
    "yearPlanted" INTEGER,
    "lastSprayDate" DATE,
    "estimatedKgPerSeason" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrchardCrop_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SourcingTarget" (
    "id" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "goalCount" INTEGER NOT NULL,
    "deadline" DATE NOT NULL,
    "priorityVillages" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourcingTarget_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SourcingTarget_crop_key" ON "SourcingTarget"("crop");
CREATE INDEX "FarmerRegistration_userId_idx" ON "FarmerRegistration"("userId");
CREATE INDEX "FarmerRegistration_sellerProfileId_idx" ON "FarmerRegistration"("sellerProfileId");
CREATE INDEX "FarmerRegistration_village_idx" ON "FarmerRegistration"("village");
CREATE INDEX "FarmerRegistration_ownership_idx" ON "FarmerRegistration"("ownership");
CREATE INDEX "FarmerRegistration_status_idx" ON "FarmerRegistration"("status");
CREATE INDEX "FarmerRegistration_createdAt_idx" ON "FarmerRegistration"("createdAt");
CREATE INDEX "FarmerRegistration_reviewedById_idx" ON "FarmerRegistration"("reviewedById");
CREATE INDEX "Orchard_registrationId_idx" ON "Orchard"("registrationId");
CREATE INDEX "Orchard_name_idx" ON "Orchard"("name");
CREATE INDEX "OrchardCrop_orchardId_idx" ON "OrchardCrop"("orchardId");
CREATE INDEX "OrchardCrop_crop_idx" ON "OrchardCrop"("crop");
CREATE INDEX "SourcingTarget_deadline_idx" ON "SourcingTarget"("deadline");

ALTER TABLE "FarmerRegistration"
  ADD CONSTRAINT "FarmerRegistration_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "FarmerRegistration"
  ADD CONSTRAINT "FarmerRegistration_sellerProfileId_fkey"
  FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "FarmerRegistration"
  ADD CONSTRAINT "FarmerRegistration_reviewedById_fkey"
  FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Orchard"
  ADD CONSTRAINT "Orchard_registrationId_fkey"
  FOREIGN KEY ("registrationId") REFERENCES "FarmerRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrchardCrop"
  ADD CONSTRAINT "OrchardCrop_orchardId_fkey"
  FOREIGN KEY ("orchardId") REFERENCES "Orchard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Goals are data. Meeting a goal does not reject later registrations.
INSERT INTO "SourcingTarget" ("id", "crop", "goalCount", "deadline", "priorityVillages", "createdAt", "updatedAt")
VALUES
  (
    '11111111-1111-4111-8111-111111111101',
    'avocado',
    30,
    DATE '2026-12-15',
    ARRAY['Kahohi', 'Karimamwaro', 'Maganjo', 'Kairungu', 'Kiamambo', 'Sagana'],
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'macadamia',
    20,
    DATE '2026-12-15',
    ARRAY['Kahohi', 'Karimamwaro', 'Maganjo', 'Kairungu', 'Kiamambo', 'Sagana'],
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("crop") DO NOTHING;

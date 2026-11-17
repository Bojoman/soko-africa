import 'dotenv/config';
import pg from 'pg';
import { PrismaClient } from './generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Idempotent demo data for the test database only:
 * company orchards Kahohi 1 and Kahohi 2, plus the sourcing targets
 * if the migration has not inserted them yet.
 * Refuses any database whose name does not end in _test.
 */

const PRIORITY_VILLAGES = ['Kahohi', 'Karimamwaro', 'Maganjo', 'Kairungu', 'Kiamambo', 'Sagana'];
const COMPANY_ORCHARDS = [
  {
    name: 'Kahohi 1',
    crop: 'avocado',
    variety: 'Hass',
    acreage: 12,
    treeCount: 400,
    yearPlanted: 2016,
    estimatedKgPerSeason: 8000
  },
  {
    name: 'Kahohi 2',
    crop: 'macadamia',
    variety: 'Beaumont',
    acreage: 9,
    treeCount: 260,
    yearPlanted: 2018,
    estimatedKgPerSeason: 4200
  }
];

function databaseNameFromUrl(url) {
  return decodeURIComponent(new URL(url).pathname.replace(/^\//, ''));
}

function assertTestName(name, source) {
  if (!name || !String(name).endsWith('_test')) {
    throw new Error(`Refusing to write to ${source} database "${name || ''}". The name must end in _test.`);
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required');
  assertTestName(databaseNameFromUrl(url), 'DATABASE_URL');

  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    const current = await client.query('SELECT current_database() AS name');
    const name = current.rows[0]?.name;
    assertTestName(name, 'connected');
    console.log(`Connected to test database ${name}`);
  } finally {
    await client.end();
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  try {
    const deadline = new Date(Date.UTC(2026, 11, 15));
    for (const target of [
      { crop: 'avocado', goalCount: 30 },
      { crop: 'macadamia', goalCount: 20 }
    ]) {
      await prisma.sourcingTarget.upsert({
        where: { crop: target.crop },
        update: {},
        create: {
          crop: target.crop,
          goalCount: target.goalCount,
          deadline,
          priorityVillages: PRIORITY_VILLAGES
        }
      });
    }

    const existing = await prisma.orchard.findMany({
      where: { name: { in: COMPANY_ORCHARDS.map((orchard) => orchard.name) } },
      select: { name: true, registrationId: true }
    });
    const have = new Set(existing.map((orchard) => orchard.name));
    if (COMPANY_ORCHARDS.every((orchard) => have.has(orchard.name))) {
      console.log('Kahohi 1 and Kahohi 2 already exist. Nothing inserted.');
      return;
    }

    let registrationId = existing[0]?.registrationId;
    if (!registrationId) {
      const registration = await prisma.farmerRegistration.create({
        data: {
          fullName: 'Kahohi Orchards',
          nationalIdNumber: 'COKAHOHI0001',
          phone: '+254700111001',
          village: 'Kahohi',
          ownership: 'COMPANY',
          acceptedFullName: 'Kahohi Orchards',
          acceptedAt: new Date('2026-11-01T08:00:00.000Z'),
          status: 'SUBMITTED',
          notes: 'Demo company orchards for sourcing. No payment and no seller licence.'
        }
      });
      registrationId = registration.id;
    }

    for (const orchard of COMPANY_ORCHARDS) {
      if (have.has(orchard.name)) continue;
      await prisma.orchard.create({
        data: {
          registrationId,
          name: orchard.name,
          acreage: orchard.acreage,
          treeCount: orchard.treeCount,
          pinDescription: `${orchard.name}, Kahohi`,
          crops: {
            create: {
              crop: orchard.crop,
              variety: orchard.variety,
              yearPlanted: orchard.yearPlanted,
              lastSprayDate: new Date(Date.UTC(2026, 5, 15)),
              estimatedKgPerSeason: orchard.estimatedKgPerSeason
            }
          }
        }
      });
      console.log(`Inserted company orchard ${orchard.name}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : 'Seed failed';
  if (message.startsWith('Refusing') || message === 'DATABASE_URL is required') console.error(message);
  else console.error(err?.code || 'Seed failed');
  process.exit(1);
});

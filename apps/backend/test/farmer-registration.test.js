import assert from 'node:assert/strict';
import { test } from 'node:test';
import Fastify from 'fastify';
import farmerRoutes, { mountAdminFarmerRoutes } from '../routes/farmers/index.js';
import { farmerRegistrationMessage, usesLiveMailProvider } from '../plugins/mail.js';
import {
  buildFarmerReport,
  maskNationalId,
  toFarmerListItem,
  toPublicRegistration,
  validateRegistration
} from '../lib/farmer-registration.js';

const NATIONAL_ID = 'QX988421';
const NOW = new Date('2026-11-17T12:00:00.000Z');

function crop(overrides = {}) {
  return {
    crop: 'avocado',
    variety: 'Hass',
    yearPlanted: 2018,
    lastSprayDate: '2026-06-01',
    estimatedKgPerSeason: 1200,
    ...overrides
  };
}

function orchard(overrides = {}) {
  return {
    name: 'North block',
    acreage: 2.5,
    treeCount: 80,
    crops: [crop()],
    ...overrides
  };
}

function body(overrides = {}) {
  return {
    fullName: 'Wanjiku Mwangi',
    nationalIdNumber: NATIONAL_ID,
    phone: '+254 700 111 222',
    village: 'Kahohi',
    ownership: 'INDEPENDENT',
    accepted: true,
    acceptedFullName: 'Wanjiku Mwangi',
    orchards: [orchard()],
    ...overrides
  };
}

function fieldError(result, field) {
  assert.equal(result.ok, false);
  return result.details.find((detail) => detail.field === field);
}

test('masks a national ID to the last 4 characters', () => {
  assert.equal(maskNationalId('QX9 88421'), '••••8421');
  assert.equal(maskNationalId('1234'), '••••');
  assert.equal(maskNationalId(''), '');
});

test('accepts suggested and unlisted crops and villages', () => {
  const suggested = validateRegistration(body(), NOW);
  assert.equal(suggested.ok, true);
  assert.equal(suggested.value.nationalIdNumber, NATIONAL_ID);

  const open = validateRegistration(
    body({
      village: 'Thika',
      orchards: [
        orchard({
          name: 'River field',
          crops: [crop({ crop: 'mango', variety: 'Apple' })]
        }),
        orchard({
          name: 'Macadamia ridge',
          crops: [crop({ crop: 'Macadamia', variety: 'Beaumont' })]
        })
      ]
    }),
    NOW
  );
  assert.equal(open.ok, true);
  assert.deepEqual(
    open.value.orchards.map((item) => item.crops[0].crop),
    ['mango', 'Macadamia']
  );
  assert.equal(open.value.village, 'Thika');
});

test('rejects bad numbers, a future spray date, a nonsense year, and a missing signature', () => {
  const result = validateRegistration(
    body({
      accepted: false,
      acceptedFullName: 'Someone Else',
      orchards: [
        orchard({
          acreage: -1,
          treeCount: -3,
          latitude: 0.1,
          crops: [
            crop({
              yearPlanted: 1800,
              lastSprayDate: '2026-12-01',
              estimatedKgPerSeason: -5
            })
          ]
        })
      ]
    }),
    NOW
  );
  assert.ok(fieldError(result, 'accepted'));
  assert.ok(fieldError(result, 'acceptedFullName'));
  assert.ok(fieldError(result, 'orchards.0.acreage'));
  assert.ok(fieldError(result, 'orchards.0.treeCount'));
  assert.ok(fieldError(result, 'orchards.0.latitude'));
  assert.ok(fieldError(result, 'orchards.0.crops.0.yearPlanted'));
  assert.ok(fieldError(result, 'orchards.0.crops.0.lastSprayDate'));
  assert.ok(fieldError(result, 'orchards.0.crops.0.estimatedKgPerSeason'));
  assert.equal(JSON.stringify(result).includes(NATIONAL_ID), false);
});

test('list and owner payloads mask the ID and the report does not repeat it', () => {
  const row = {
    id: 'reg-1',
    fullName: 'Wanjiku Mwangi',
    nationalIdNumber: NATIONAL_ID,
    phone: '+254 700 111 222',
    village: 'Kahohi',
    ownership: 'INDEPENDENT',
    status: 'SUBMITTED',
    orchards: [{ id: 'o1', name: 'North block', crops: [{ crop: 'avocado' }] }],
    createdAt: NOW
  };
  const list = toFarmerListItem(row);
  const owner = toPublicRegistration(row, { includeFullId: false });
  const admin = toPublicRegistration(row, { includeFullId: true });
  assert.equal(list.nationalIdMasked, '••••8421');
  assert.equal('nationalIdNumber' in list, false);
  assert.equal('nationalIdNumber' in owner, false);
  assert.equal(admin.nationalIdNumber, NATIONAL_ID);
  assert.equal(JSON.stringify({ list, owner }).includes(NATIONAL_ID), false);

  const report = buildFarmerReport(
    [{ ...row, nationalIdNumber: NATIONAL_ID }],
    [{ crop: 'avocado', goalCount: 30, deadline: '2026-12-15', priorityVillages: ['Kahohi'] }]
  );
  assert.equal(JSON.stringify(report).includes(NATIONAL_ID), false);
});

test('counts farmers toward targets without treating a met target as a block', () => {
  const registrations = [
    {
      id: 'a',
      village: 'Kahohi',
      ownership: 'INDEPENDENT',
      orchards: [
        { crops: [{ crop: 'avocado' }, { crop: 'avocado' }] },
        { crops: [{ crop: 'Macadamia' }] }
      ]
    },
    {
      id: 'b',
      village: 'Maganjo',
      ownership: 'COMPANY',
      orchards: [{ crops: [{ crop: 'avocado' }] }, { crops: [{ crop: 'avocado' }] }]
    },
    {
      id: 'c',
      village: 'Thika',
      ownership: 'INDEPENDENT',
      orchards: [{ crops: [{ crop: 'mango' }] }]
    }
  ];
  const report = buildFarmerReport(registrations, [
    {
      crop: 'avocado',
      goalCount: 30,
      deadline: new Date('2026-12-15T00:00:00.000Z'),
      priorityVillages: ['Kahohi', 'Karimamwaro', 'Maganjo', 'Kairungu', 'Kiamambo', 'Sagana']
    },
    {
      crop: 'macadamia',
      goalCount: 20,
      deadline: '2026-12-15',
      priorityVillages: ['Kahohi', 'Sagana']
    }
  ]);

  const avocado = report.targets.find((target) => target.crop === 'avocado');
  const macadamia = report.targets.find((target) => target.crop === 'macadamia');
  assert.equal(avocado.farmerCount, 2);
  assert.equal(avocado.remaining, 28);
  assert.equal(avocado.deadline, '2026-12-15');
  assert.equal(avocado.farmersInPriorityVillages, 2);
  assert.equal(avocado.met, false);
  assert.equal(macadamia.farmerCount, 1);
  assert.equal(macadamia.remaining, 19);
  assert.equal(report.byOwnership.farmers.COMPANY, 1);
  assert.equal(report.byOwnership.farmers.INDEPENDENT, 2);
  assert.equal(report.byOwnership.orchards.COMPANY, 2);
  assert.equal(report.orchards, 5);
  const mango = report.byCrop.find((row) => row.crop === 'mango');
  assert.equal(mango.farmers, 1);
  assert.equal(report.byVillage.find((row) => row.village === 'Thika').farmers, 1);

  const full = buildFarmerReport(
    Array.from({ length: 30 }, (_, index) => ({
      id: `f${index}`,
      village: 'Kahohi',
      ownership: 'INDEPENDENT',
      orchards: [{ crops: [{ crop: 'avocado' }] }]
    })),
    [{ crop: 'avocado', goalCount: 30, deadline: '2026-12-15', priorityVillages: ['Kahohi'] }]
  );
  assert.equal(full.targets[0].met, true);
  assert.equal(full.targets[0].remaining, 0);
  const extra = validateRegistration(body(), NOW);
  assert.equal(extra.ok, true);
});

test('registration email names the orchard and crop and omits the ID', () => {
  const previous = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = 'live-key';
  assert.equal(usesLiveMailProvider(), true);
  if (previous === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = previous;

  const message = farmerRegistrationMessage({
    to: 'farmer@example.test',
    farmerName: 'Wanjiku Mwangi',
    orchards: [{ name: 'North block', crops: [{ crop: 'avocado', variety: 'Hass' }] }]
  });
  assert.equal(message.subject, 'Farmer registration received');
  assert.match(message.text, /North block: avocado \(Hass\)/);
  assert.match(message.text, /No payment is due/);
  assert.equal(message.text.includes(NATIONAL_ID), false);
  assert.equal(message.html.includes(NATIONAL_ID), false);
});

function memoryDb() {
  const regs = [];
  let orchardSeq = 0;
  const farmerProfiles = [];
  const users = {
    'user-1': { id: 'user-1', email: 'wanjiku@example.test', role: 'CUSTOMER', isActive: true },
    'user-2': { id: 'user-2', email: 'other@example.test', role: 'CUSTOMER', isActive: true },
    admin: { id: 'admin', email: 'admin@example.test', role: 'ADMIN', isActive: true }
  };
  const sellers = {
    'user-1': { id: 'seller-1', userId: 'user-1', farmerExtension: null }
  };

  function materialize(data) {
    const row = {
      id: `reg-${regs.length + 1}`,
      userId: data.userId,
      sellerProfileId: data.sellerProfileId,
      fullName: data.fullName,
      nationalIdNumber: data.nationalIdNumber,
      phone: data.phone,
      village: data.village,
      ownership: data.ownership,
      acceptedFullName: data.acceptedFullName,
      acceptedAt: data.acceptedAt,
      status: data.status,
      notes: data.notes,
      reviewedAt: data.reviewedAt || null,
      reviewedById: data.reviewedById || null,
      createdAt: NOW,
      updatedAt: NOW,
      orchards: (data.orchards?.create || []).map((orchard) => ({
        id: `orchard-${++orchardSeq}`,
        name: orchard.name,
        latitude: orchard.latitude,
        longitude: orchard.longitude,
        pinDescription: orchard.pinDescription,
        acreage: orchard.acreage,
        treeCount: orchard.treeCount,
        notes: orchard.notes,
        createdAt: NOW,
        crops: (orchard.crops?.create || []).map((cropRow, index) => ({
          id: `crop-${orchardSeq}-${index}`,
          ...cropRow,
          createdAt: NOW
        }))
      }))
    };
    regs.push(row);
    return row;
  }

  const prisma = {
    user: {
      findUnique: async ({ where, select }) => {
        const user = users[where.id] || null;
        if (!user || !select) return user;
        return Object.fromEntries(Object.keys(select).map((key) => [key, user[key]]));
      },
      update: async () => {
        throw new Error('registration must not change the user role');
      }
    },
    sellerProfile: {
      findUnique: async ({ where }) => sellers[where.userId] || null
    },
    farmerProfile: {
      create: async ({ data }) => {
        farmerProfiles.push(data);
        const seller = Object.values(sellers).find((item) => item.id === data.sellerProfileId);
        if (seller) seller.farmerExtension = data;
        return data;
      }
    },
    farmerRegistration: {
      findFirst: async ({ where }) => regs.find((row) => row.userId === where.userId) || null,
      findUnique: async ({ where }) => regs.find((row) => row.id === where.id) || null,
      findMany: async ({ where } = {}) =>
        regs.filter((row) => !where?.userId || row.userId === where.userId),
      create: async ({ data }) => materialize(data),
      update: async ({ where, data }) => {
        const row = regs.find((item) => item.id === where.id);
        if (!row) {
          const error = new Error('not found');
          error.code = 'P2025';
          throw error;
        }
        Object.assign(row, data);
        return row;
      }
    },
    orchard: {
      create: async ({ data }) => {
        const row = regs.find((item) => item.id === data.registrationId);
        const orchard = {
          id: `orchard-${++orchardSeq}`,
          name: data.name,
          latitude: data.latitude,
          longitude: data.longitude,
          pinDescription: data.pinDescription,
          acreage: data.acreage,
          treeCount: data.treeCount,
          notes: data.notes,
          createdAt: NOW,
          crops: (data.crops?.create || []).map((cropRow, index) => ({
            id: `crop-${orchardSeq}-${index}`,
            ...cropRow
          }))
        };
        row.orchards.push(orchard);
        return orchard;
      }
    },
    $transaction: async (fn) => fn(prisma)
  };

  return { prisma, regs, farmerProfiles, users };
}

async function appFor(t, db, user, mailLog, lines) {
  const app = Fastify({
    logger: lines
      ? {
          level: 'info',
          stream: {
            write(line) {
              lines.push(String(line));
            }
          }
        }
      : false
  });
  app.decorate('prisma', db.prisma);
  app.decorate('authenticate', async (request) => {
    request.user = { sub: user.id, role: user.role, type: 'access' };
  });
  app.decorate('mail', {
    send: async (message) => {
      mailLog.push(message);
      return { messageId: 'logged' };
    }
  });
  await app.register(farmerRoutes);
  await app.register(async (admin) => mountAdminFarmerRoutes(admin), { prefix: '/admin' });
  t.after(() => app.close());
  return app;
}

test('saves a registration with a masked ID, extends a seller profile, and logs no ID', async (t) => {
  const previous = {
    resend: process.env.RESEND_API_KEY,
    host: process.env.SMTP_HOST,
    url: process.env.SMTP_URL
  };
  delete process.env.RESEND_API_KEY;
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_URL;
  t.after(() => {
    for (const [key, value] of Object.entries({
      RESEND_API_KEY: previous.resend,
      SMTP_HOST: previous.host,
      SMTP_URL: previous.url
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const db = memoryDb();
  const mailLog = [];
  const logs = [];
  const app = await appFor(t, db, db.users['user-1'], mailLog, logs);

  const created = await app.inject({
    method: 'POST',
    url: '/registrations',
    payload: body()
  });
  assert.equal(created.statusCode, 201);
  const payload = created.json();
  assert.equal(payload.paymentTaken, false);
  assert.equal(payload.emailSent, true);
  assert.match(payload.confirmation.headline, /Wanjiku Mwangi/);
  assert.match(payload.confirmation.detail, /North block — avocado \(Hass\)/);
  assert.match(payload.confirmation.payment, /No payment was taken/);
  assert.equal(payload.registration.nationalIdMasked, '••••8421');
  assert.equal(payload.registration.status, 'SUBMITTED');
  assert.equal('nationalIdNumber' in payload.registration, false);
  assert.equal(JSON.stringify(payload).includes(NATIONAL_ID), false);
  assert.equal(db.farmerProfiles.length, 1);
  assert.equal(db.regs[0].sellerProfileId, 'seller-1');
  assert.equal(db.users['user-1'].role, 'CUSTOMER');
  assert.equal(mailLog[0].to, 'wanjiku@example.test');
  assert.equal(mailLog[0].text.includes(NATIONAL_ID), false);
  assert.equal(logs.join('\n').includes(NATIONAL_ID), false);

  const added = await app.inject({
    method: 'POST',
    url: '/registrations',
    payload: body({
      orchards: [orchard({ name: 'Macadamia ridge', crops: [crop({ crop: 'macadamia', variety: 'Beaumont' })] })]
    })
  });
  assert.equal(added.statusCode, 200);
  assert.equal(added.json().created, false);
  assert.equal(added.json().registration.orchards.length, 2);

  const other = Fastify({ logger: false });
  other.decorate('prisma', db.prisma);
  other.decorate('authenticate', async (request) => {
    request.user = { sub: 'user-2', role: 'CUSTOMER', type: 'access' };
  });
  other.decorate('mail', { send: async () => ({}) });
  await other.register(farmerRoutes);
  await other.register(async (admin) => mountAdminFarmerRoutes(admin), { prefix: '/admin' });
  t.after(() => other.close());

  const denied = await other.inject({
    method: 'GET',
    url: `/registrations/${db.regs[0].id}`
  });
  assert.equal(denied.statusCode, 403);
  assert.equal(JSON.stringify(denied.json()).includes(NATIONAL_ID), false);

  const reportDenied = await other.inject({ method: 'GET', url: '/admin/farmers' });
  assert.equal(reportDenied.statusCode, 403);
  assert.equal(JSON.stringify(reportDenied.json()).includes(NATIONAL_ID), false);

  const adminApp = await appFor(t, db, db.users.admin, []);
  const list = await adminApp.inject({ method: 'GET', url: '/admin/farmers' });
  assert.equal(list.statusCode, 200);
  assert.equal(list.json().farmers[0].nationalIdMasked, '••••8421');
  assert.equal(JSON.stringify(list.json()).includes(NATIONAL_ID), false);

  const detail = await adminApp.inject({
    method: 'GET',
    url: `/admin/farmers/${db.regs[0].id}`
  });
  assert.equal(detail.statusCode, 200);
  assert.equal(detail.json().registration.nationalIdNumber, NATIONAL_ID);

  const reviewed = await adminApp.inject({
    method: 'PATCH',
    url: `/admin/farmers/${db.regs[0].id}`,
    payload: { status: 'REVIEWED' }
  });
  assert.equal(reviewed.statusCode, 200);
  assert.equal(reviewed.json().message, 'Marked as reviewed.');
  assert.equal(reviewed.json().registration.status, 'REVIEWED');
});

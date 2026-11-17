import assert from 'node:assert/strict';
import { test } from 'node:test';
import bcrypt from 'bcryptjs';
import Fastify from 'fastify';
import authRoutes from '../routes/auth/index.js';
import { welcomeMessage } from '../plugins/mail.js';

const PASSWORD = 'Password1!';

function validBody(overrides = {}) {
  return {
    email: 'new.user@example.test',
    password: PASSWORD,
    firstName: 'Amina',
    lastName: 'Diallo',
    phone: '+254 700 000 000',
    country: 'Kenya',
    role: 'customer',
    newsletterOptIn: true,
    ...overrides
  };
}

async function authApp(t, { users = new Map(), mail } = {}) {
  const created = [];
  const resetTokens = [];
  const refreshCalls = [];
  const logs = [];
  const app = Fastify({
    logger: {
      level: 'error',
      stream: { write(line) { logs.push(String(line)); } }
    }
  });
  const prisma = {
    user: {
      findUnique: async ({ where }) => {
        if (where.email) return users.get(where.email) || null;
        if (where.id) return [...users.values()].find((user) => user.id === where.id) || null;
        return null;
      },
      create: async ({ data }) => {
        created.push(data);
        const user = {
          id: 'user-new',
          email: data.email,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          country: data.country,
          sellerIntent: data.sellerIntent,
          newsletterOptIn: data.newsletterOptIn,
          sellerProfile: null
        };
        users.set(data.email, user);
        return user;
      }
    },
    securityEvent: {
      findMany: async () => [],
      create: async () => ({})
    },
    passwordResetToken: {
      create: async ({ data }) => {
        resetTokens.push(data);
        return data;
      }
    }
  };
  app.decorate('prisma', prisma);
  app.decorate('authenticate', async () => {});
  app.decorate('signAccessToken', () => 'access-token');
  app.decorate('signRefreshToken', async (userId) => {
    refreshCalls.push(userId);
    return 'refresh-token';
  });
  app.decorate('mail', {
    sendWelcome: async (user) => {
      mail.welcomes.push(user);
    },
    sendPasswordReset: async (email, token) => {
      mail.resets.push({ email, token });
      if (mail.failReset) throw new Error('mailbox unavailable');
    }
  });
  await app.register(authRoutes);
  await app.ready();
  t.after(() => app.close());
  return { app, created, resetTokens, refreshCalls, logs };
}

test('customer registration stores phone, country, and newsletter consent', async (t) => {
  const mail = { welcomes: [], resets: [] };
  const { app, created } = await authApp(t, { mail });
  const response = await app.inject({
    method: 'POST',
    url: '/register',
    payload: validBody({ role: 'customer', newsletterOptIn: false })
  });

  assert.equal(response.statusCode, 200);
  const body = response.json();
  assert.equal(body.user.role, 'CUSTOMER');
  assert.equal(body.user.sellerIntent, false);
  assert.equal(created[0].phone, '+254 700 000 000');
  assert.equal(created[0].country, 'Kenya');
  assert.equal(created[0].newsletterOptIn, false);
  assert.equal(created[0].sellerIntent, false);
  assert.equal(created[0].role, 'CUSTOMER');
  assert.equal(mail.welcomes[0].sellerIntent, false);
  assert.equal(mail.welcomes[0].role, 'CUSTOMER');
});

test('seller intent is stored without granting the seller role', async (t) => {
  const mail = { welcomes: [], resets: [] };
  const { app, created } = await authApp(t, { mail });
  const response = await app.inject({
    method: 'POST',
    url: '/register',
    payload: validBody({
      email: 'future.seller@example.test',
      role: 'seller',
      newsletterOptIn: true
    })
  });

  assert.equal(response.statusCode, 200);
  const body = response.json();
  assert.equal(body.user.role, 'CUSTOMER');
  assert.equal(body.user.sellerIntent, true);
  assert.equal(body.user.sellerProfile, null);
  assert.equal(created[0].role, 'CUSTOMER');
  assert.equal(created[0].sellerIntent, true);
  assert.equal(created[0].newsletterOptIn, true);
  assert.equal(mail.welcomes[0].sellerIntent, true);
  assert.notEqual(mail.welcomes[0].role, 'SELLER');
});

test('registration rejects roles other than customer or seller intent', async (t) => {
  const mail = { welcomes: [], resets: [] };
  const { app, created } = await authApp(t, { mail });
  for (const role of ['admin', 'ADMIN', 'moderator', 'MODERATOR', 'SELLER', 'seller ']) {
    const response = await app.inject({
      method: 'POST',
      url: '/register',
      payload: validBody({ email: `${role}@example.test`, role })
    });
    assert.equal(response.statusCode, 400, role);
  }
  assert.equal(created.length, 0);
  assert.equal(mail.welcomes.length, 0);
});

test('registration requires a valid phone and country', async (t) => {
  const { app, created } = await authApp(t, { mail: { welcomes: [], resets: [] } });
  const cases = [
    validBody({ phone: undefined }),
    validBody({ phone: 'abc' }),
    validBody({ phone: '123' }),
    validBody({ country: undefined }),
    validBody({ country: 'Atlantis' }),
    validBody({ country: 'kenya' })
  ];
  for (const payload of cases) {
    const response = await app.inject({ method: 'POST', url: '/register', payload });
    assert.equal(response.statusCode, 400);
  }
  assert.equal(created.length, 0);
});

test('remember-me is ignored by the login API and stays a cookie concern', async (t) => {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  const users = new Map([
    ['person@example.test', {
      id: 'person',
      email: 'person@example.test',
      role: 'CUSTOMER',
      firstName: 'Bo',
      lastName: 'Jo',
      passwordHash,
      isActive: true,
      sellerProfile: null
    }]
  ]);
  const { app, refreshCalls } = await authApp(t, { users, mail: { welcomes: [], resets: [] } });
  const response = await app.inject({
    method: 'POST',
    url: '/login',
    payload: {
      email: 'person@example.test',
      password: PASSWORD,
      rememberMe: true
    }
  });

  assert.equal(response.statusCode, 200, response.body);
  const body = response.json();
  assert.equal(body.tokens.expiresIn, 900);
  assert.equal(body.user.rememberMe, undefined);
  assert.deepEqual(refreshCalls, ['person']);
});

test('unknown and inactive emails get the generic reset response', async (t) => {
  const users = new Map([
    ['inactive@example.test', { id: 'inactive', email: 'inactive@example.test', isActive: false }]
  ]);
  const mail = { welcomes: [], resets: [] };
  const { app, resetTokens } = await authApp(t, { users, mail });

  for (const email of ['missing@example.test', 'inactive@example.test']) {
    const response = await app.inject({
      method: 'POST',
      url: '/forgot-password',
      payload: { email }
    });
    assert.equal(response.statusCode, 200);
    assert.equal(
      response.json().message,
      'If an account exists for that email, a password reset link has been sent.'
    );
  }
  assert.equal(mail.resets.length, 0);
  assert.equal(resetTokens.length, 0);
});

test('a mail failure for a known account is not reported as success', async (t) => {
  const users = new Map([
    ['known@example.test', { id: 'known-user', email: 'known@example.test', isActive: true }]
  ]);
  const mail = { welcomes: [], resets: [], failReset: true };
  const { app, logs, resetTokens } = await authApp(t, { users, mail });
  const response = await app.inject({
    method: 'POST',
    url: '/forgot-password',
    payload: { email: 'known@example.test' }
  });

  assert.equal(response.statusCode, 503);
  assert.equal(response.json().message, 'Could not send the reset email. Please try again.');
  assert.equal(resetTokens.length, 1);
  const token = resetTokens[0].token;
  assert.equal(logs.some((line) => line.includes(token)), false);
});

test('welcome copy follows seller intent and stays customer otherwise', () => {
  const seller = welcomeMessage({
    email: 'seller@example.test',
    firstName: 'Amina',
    role: 'CUSTOMER',
    sellerIntent: true
  });
  assert.match(seller.text, /Complete your seller profile/);
  assert.match(seller.text, /\/sell\?apply=true/);
  assert.doesNotMatch(seller.text, /View your account/);

  const customer = welcomeMessage({
    email: 'customer@example.test',
    firstName: 'Bo',
    role: 'CUSTOMER',
    sellerIntent: false
  });
  assert.match(customer.text, /View your account/);
  assert.match(customer.text, /\/account/);
  assert.doesNotMatch(customer.text, /Complete your seller profile/);
});

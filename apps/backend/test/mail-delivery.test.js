import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { test } from 'node:test';
import Fastify from 'fastify';
import mailPlugin, { attachMailErrorListener } from '../plugins/mail.js';

function restoreEnv(snapshot) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

test('production without a mail provider does not pretend the message was sent', async (t) => {
  const snapshot = {
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_URL: process.env.SMTP_URL,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS
  };
  t.after(() => restoreEnv(snapshot));

  process.env.NODE_ENV = 'production';
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_FROM;
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_URL;
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASS;

  const app = Fastify({ logger: false });
  await app.register(mailPlugin);
  t.after(() => app.close());

  const token = 'reset-token-must-not-leak';
  await assert.rejects(
    () => app.mail.sendPasswordReset('person@example.test', token),
    (err) => {
      assert.equal(err.message, 'Mail provider is not configured');
      assert.equal(String(err.message).includes(token), false);
      return true;
    }
  );
});

test('a mail transport error is handled instead of crashing the process', () => {
  const transport = new EventEmitter();
  const codes = [];
  attachMailErrorListener(transport, {
    error(entry) {
      codes.push(entry.code);
    }
  });

  const failure = new Error('socket hang up');
  failure.code = 'ECONNECTION';
  assert.doesNotThrow(() => transport.emit('error', failure));
  assert.deepEqual(codes, ['ECONNECTION']);
});

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Shared login for the integration tests.
 *
 * Login is rate-limited (5 attempts / 15 min) by the brute-force guard, and
 * several test files use the same seed account — so a full `pnpm test` run
 * used to burn an attempt per file and start returning 429 after a couple of
 * runs. The token is cached on disk and reused until it stops working, which
 * makes repeated runs cost zero login attempts.
 */

export const BASE = process.env.API_URL || 'http://127.0.0.1:3001';

const CACHE_DIR = join(tmpdir(), 'soko-africa-tests');
const CACHE_FILE = join(CACHE_DIR, 'tokens.json');

function readCache() {
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(cache));
  } catch {
    /* a non-writable temp dir just means we log in again next time */
  }
}

async function tokenWorks(token) {
  if (!token) return false;
  try {
    const res = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Returns an access token for the given credentials, or null. */
export async function login({ email, password }) {
  const cache = readCache();

  if (await tokenWorks(cache[email])) return cache[email];

  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json().catch(() => ({}));
  const token = data?.tokens?.accessToken || null;

  if (token) {
    cache[email] = token;
    writeCache(cache);
  }
  return token;
}

export async function backendUp() {
  try {
    const res = await fetch(`${BASE}/health/live`);
    return res.ok;
  } catch {
    return false;
  }
}

/** Thin JSON fetch wrapper shared by the integration tests. */
export async function api(path, { method = 'GET', token, body, headers = {} } = {}) {
  const h = { ...headers };
  if (body != null) h['Content-Type'] = 'application/json';
  if (token) h.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: h,
    body: body != null ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

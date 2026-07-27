/**
 * Production entry for Railway (and similar hosts).
 * Uses 0.0.0.0 so the platform proxy can reach the process; PORT is injected.
 */
import appPlugin, { buildApp } from './app.js';

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';

const app = await buildApp();
await app.register(appPlugin);

try {
  await app.listen({ port, host });
  app.log.info(`Soko Africa API listening on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

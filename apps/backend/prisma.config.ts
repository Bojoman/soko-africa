import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prefer real DATABASE_URL; allow a placeholder so `prisma generate` works
// during image builds (e.g. Railway) before the runtime DB is attached.
const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@127.0.0.1:5432/prisma_build_placeholder';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed:
      'node --experimental-strip-types --no-warnings=ExperimentalWarning prisma/seed.js',
  },
  datasource: {
    url: databaseUrl,
  },
});

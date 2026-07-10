import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed:
      'node --experimental-strip-types --no-warnings=ExperimentalWarning prisma/seed.js',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});

FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@10.15.1

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend ./apps/backend
COPY packages/units ./packages/units

RUN pnpm install --frozen-lockfile --filter backend... \
  && pnpm --filter backend exec prisma generate

WORKDIR /app/apps/backend

ENV PORT=3001
ENV HOST=0.0.0.0

EXPOSE 3001

# migrate deploy, then the package start script. Do not seed.
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm start"]

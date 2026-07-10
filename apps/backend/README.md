# Soko Africa Backend

A secure, performant, and robust Fastify + Prisma + PostgreSQL backend for the Soko Africa platform.

## Features

### Security
- **JWT Authentication** with access & refresh tokens
- **Rate Limiting** with configurable limits per endpoint
- **Brute Force Protection** for login attempts
- **Helmet Security Headers** with CSP, HSTS, and more
- **CORS** with strict origin validation
- **Input Validation** with JSON schemas
- **Security Event Logging** for audit trails
- **Password Requirements** enforcing strong passwords

### Performance
- **Connection Pooling** for database optimization
- **In-Memory Caching** for frequently accessed data
- **Query Optimization** with proper indexing
- **Pagination** with configurable limits
- **Database Health Checks** with automatic reconnection

### Robustness
- **Graceful Shutdown** handling
- **Centralized Error Handling**
- **Request Timeouts** and body size limits
- **Comprehensive Health Checks** (liveness, readiness, detailed diagnostics)
- **Audit Logging** for all critical operations
- **Database Transactions** for data consistency

## Database migrations (commerce extensions)

After pulling schema changes for cart, orders, reviews, etc., apply the Prisma schema to your database:

```bash
cd apps/backend
pnpm exec prisma generate
pnpm exec prisma db push
pnpm run db:seed   # optional — refreshes seed catalog + WELCOME10 coupon
```

For production, prefer `prisma migrate deploy` once migration SQL files are checked in.

## Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 9+
- PostgreSQL 16+

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cd apps/backend
cp .env.example .env
```

Edit `.env` and set at minimum:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A strong secret (at least 32 characters)

### 2. Start PostgreSQL

Using Docker (from repo root):

```bash
docker compose up -d postgres
```

Or use your existing PostgreSQL instance.

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
pnpm --filter backend exec prisma generate
pnpm --filter backend exec prisma migrate dev
```

### 4. Start Development Server

```bash
pnpm backend:dev
```

The API will be available at:
- API: `http://localhost:3001`
- Docs: `http://localhost:3001/api/docs`
- Health: `http://localhost:3001/health`

## API Endpoints

### Authentication
| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/auth/register` | Create new account | 5/15min |
| POST | `/auth/login` | Login with credentials | 10/15min |
| POST | `/auth/refresh` | Refresh access token | 20/15min |
| POST | `/auth/logout` | Logout and revoke tokens | - |
| GET | `/auth/me` | Get current user | - |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | List products with filters | No |
| GET | `/products/:id` | Get single product | No |
| POST | `/products` | Create product | Yes (Farmer/Seller/Admin) |

**Query Parameters for GET /products:**
- `search` - Search in name/description (max 200 chars)
- `category` - Filter by category
- `minPrice`, `maxPrice` - Price range
- `page` - Page number (default: 1)
- `limit` - Items per page (max: 100, default: 10)
- `sortBy` - Sort field: `name`, `price`, `createdAt`
- `sortOrder` - `asc` or `desc`

### Farmers
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/farmers` | List approved farmers | No |
| GET | `/farmers/:id` | Get farmer profile | No |
| POST | `/farmers` | Create farmer profile | Yes |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Detailed health check with diagnostics |
| GET | `/health/ready` | Readiness probe for Kubernetes |
| GET | `/health/live` | Liveness probe |

### Admin (requires ADMIN role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cache/stats` | Cache statistics |
| POST | `/api/cache/clear` | Clear cache |

## Environment Variables

### Required
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret for signing tokens (min 32 chars) | Generate with: `openssl rand -hex 32` |

### Security
| Variable | Default | Description |
|----------|---------|-------------|
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated allowed CORS origins |
| `TRUST_PROXY` | `false` | Trust proxy headers |
| `MAX_BODY_SIZE` | `1048576` | Max request body in bytes (1MB) |
| `REQUEST_TIMEOUT` | `30000` | Request timeout in ms |
| `CONNECTION_TIMEOUT` | `5000` | Connection timeout in ms |

### JWT
| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_ACCESS_EXPIRY` | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRY` | `7d` | Refresh token lifetime |

### Performance
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_POOL_SIZE` | `10` | Database connection pool |
| `DB_CONNECTION_TIMEOUT` | `30000` | DB connection timeout |
| `CACHE_TTL` | `300000` | Cache time-to-live in ms (5 min) |

### Server
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `LOG_LEVEL` | `info` | Log level (trace/debug/info/warn/error) |

## Security Features

### Authentication Flow
1. **Registration**: Create account with strong password requirements
2. **Login**: Returns access token (15 min) and refresh token (7 days)
3. **Access**: Use Bearer token in Authorization header
4. **Refresh**: Exchange refresh token for new access token
5. **Logout**: Revokes all refresh tokens for the user

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (@$!%*?&)

### Rate Limiting
- Global: 100 requests/minute per IP
- Auth endpoints: Stricter limits (see table above)
- Automatic security event logging on violations

### Brute Force Protection
- 5 failed login attempts = 15-minute lockout
- Attempts reset after lockout period
- Security events logged for monitoring

### Security Headers
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## Database Schema

### Models
- **User** - Core user accounts with roles
- **Farmer** - Extended farmer profiles with verification
- **Product** - Product listings with soft delete
- **RefreshToken** - Token management for sessions
- **AuditLog** - Action logging for compliance
- **SecurityEvent** - Security incident tracking

### Indexes
All primary query fields are indexed for performance:
- User: email, role, isActive, createdAt
- Farmer: userId, verificationStatus, businessName
- Product: name, category, status, price, farmerId, deletedAt
- RefreshToken: token, userId, expiresAt
- AuditLog: action, actorId, target, createdAt

## Scripts

```bash
# Development
pnpm backend:dev           # Start with hot reload

# Production
pnpm backend:start         # Start production server

# Database
pnpm --filter backend exec prisma generate      # Generate Prisma client
pnpm --filter backend exec prisma migrate dev    # Run migrations (dev)
pnpm --filter backend exec prisma migrate deploy # Run migrations (production)
pnpm --filter backend exec prisma studio         # Open Prisma Studio

# Testing
pnpm --filter backend test # Run tests
```

## Production Deployment

### Checklist
1. Set `NODE_ENV=production`
2. Generate strong `JWT_SECRET` (64+ chars recommended)
3. Configure `ALLOWED_ORIGINS` with your frontend domains
4. Set up proper `DATABASE_URL` with connection pooling
5. Enable `TRUST_PROXY=true` if behind a reverse proxy
6. Run migrations: `pnpm --filter backend exec prisma migrate deploy`
7. Review and adjust rate limiting settings

### Health Checks
Configure your load balancer or orchestrator to use:
- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`

### Monitoring
The `/health` endpoint provides:
- Database status and response time
- Memory usage statistics
- Cache hit/miss rates
- System load averages

## License

MIT

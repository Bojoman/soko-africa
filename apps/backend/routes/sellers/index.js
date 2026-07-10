import { mapProductResponse, productPublicSelect } from '../../lib/map-product.js';

const CACHE_TTL = 120000;
const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const createSellerSchema = {
  body: {
    type: 'object',
    required: ['shopName'],
    properties: {
      shopName: {
        type: 'string',
        minLength: 1,
        maxLength: 200
      },
      bio: {
        type: 'string',
        maxLength: 5000
      },
      location: {
        type: 'string',
        maxLength: 500
      },
      phoneNumber: {
        type: 'string',
        maxLength: 20
      },
      slug: {
        type: 'string',
        maxLength: 120
      },
      featuredImageUrl: {
        type: 'string',
        maxLength: 2000
      }
    },
    additionalProperties: false
  }
};

const listQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        default: 1
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: MAX_PAGE_SIZE,
        default: DEFAULT_PAGE_SIZE
      },
      search: {
        type: 'string',
        maxLength: 200
      }
    }
  }
};

function slugifyShopName(name, idSuffix) {
  const base = String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'shop'}-${(idSuffix || '').replace(/-/g, '').slice(0, 8)}`;
}

export default async function (fastify) {
  fastify.get('/', { schema: listQuerySchema }, async (request) => {
    const { page = 1, limit = DEFAULT_PAGE_SIZE, search } = request.query;

    const safeLimit = Math.min(parseInt(limit, 10), MAX_PAGE_SIZE);
    const safePage = Math.max(parseInt(page, 10), 1);

    const cacheKey = `sellers:list:${safePage}:${safeLimit}:${search || ''}`;
    const cached = fastify.cache.get(cacheKey);

    if (cached && !request.headers['x-no-cache']) {
      return cached;
    }

    const where = {
      verificationStatus: 'APPROVED'
    };

    if (search) {
      const sanitizedSearch = search.replace(/[%_]/g, '\\$&');
      where.OR = [
        { shopName: { contains: sanitizedSearch, mode: 'insensitive' } },
        { bio: { contains: sanitizedSearch, mode: 'insensitive' } },
        { slug: { contains: sanitizedSearch, mode: 'insensitive' } }
      ];
    }

    const skip = (safePage - 1) * safeLimit;

    const [sellers, total] = await Promise.all([
      fastify.prisma.sellerProfile.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          slug: true,
          shopName: true,
          bio: true,
          location: true,
          phoneNumber: true,
          verificationStatus: true,
          verifiedAt: true,
          featuredImageUrl: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          farmerExtension: { select: { id: true } },
          _count: {
            select: {
              products: {
                where: {
                  status: 'PUBLISHED',
                  deletedAt: null
                }
              }
            }
          }
        }
      }),
      fastify.prisma.sellerProfile.count({ where })
    ]);

    const sellersWithProductCount = sellers.map((s) => ({
      ...s,
      productCount: s._count.products,
      isFarmer: Boolean(s.farmerExtension),
      farmerExtension: undefined,
      _count: undefined
    }));

    const totalPages = Math.ceil(total / safeLimit);

    const result = {
      sellers: sellersWithProductCount,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1
      }
    };

    if (!request.headers['x-no-cache']) {
      fastify.cache.set(cacheKey, result, CACHE_TTL);
    }

    return result;
  });

  /** Products for a seller (slug or id). Must be registered before `/:slug` if same pattern — use explicit path. */
  fastify.get('/:slug/products', async (request, reply) => {
    const { slug } = request.params;

    const seller = await resolveSeller(fastify, slug);
    if (!seller || seller.verificationStatus !== 'APPROVED') {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Seller not found'
      });
    }

    const { page = 1, limit = DEFAULT_PAGE_SIZE } = request.query;
    const safeLimit = Math.min(parseInt(limit, 10) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const where = {
      sellerId: seller.id,
      deletedAt: null,
      status: 'PUBLISHED'
    };

    const [products, total] = await Promise.all([
      fastify.prisma.product.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
        select: productPublicSelect()
      }),
      fastify.prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      seller: {
        id: seller.id,
        slug: seller.slug,
        shopName: seller.shopName,
        bio: seller.bio,
        location: seller.location,
        featuredImageUrl: seller.featuredImageUrl
      },
      products: products.map(mapProductResponse),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1
      }
    };
  });

  fastify.get('/:slug', async (request, reply) => {
    const { slug } = request.params;

    const cacheKey = `sellers:${slug}`;
    const cached = fastify.cache.get(cacheKey);

    if (cached && !request.headers['x-no-cache']) {
      return cached;
    }

    const seller = await resolveSeller(fastify, slug);

    if (!seller || seller.verificationStatus !== 'APPROVED') {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Seller not found'
      });
    }

    const out = {
      ...seller,
      isFarmer: Boolean(seller.farmerExtension),
      farmerExtension: seller.farmerExtension
        ? { id: seller.farmerExtension.id }
        : null
    };

    if (!request.headers['x-no-cache']) {
      fastify.cache.set(cacheKey, out, CACHE_TTL);
    }

    return out;
  });

  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: createSellerSchema
  }, async (request, reply) => {
    const { sub: userId } = request.user;

    const existing = await fastify.prisma.sellerProfile.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (existing) {
      return reply.code(409).send({
        statusCode: 409,
        error: 'Conflict',
        message: 'Seller profile already exists'
      });
    }

    const body = request.body;
    const tempId = crypto.randomUUID();
    const slug =
      body.slug?.trim() ||
      slugifyShopName(body.shopName, tempId);

    const result = await fastify.prisma.$transaction(async (prisma) => {
      const seller = await prisma.sellerProfile.create({
        data: {
          userId,
          shopName: body.shopName,
          slug,
          bio: body.bio,
          location: body.location,
          phoneNumber: body.phoneNumber,
          featuredImageUrl: body.featuredImageUrl,
          verificationStatus: 'APPROVED',
          verifiedAt: new Date()
        },
        select: {
          id: true,
          slug: true,
          shopName: true,
          bio: true,
          location: true,
          phoneNumber: true,
          verificationStatus: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      await prisma.user.update({
        where: { id: userId },
        data: { role: 'SELLER' }
      });

      return seller;
    });

    fastify.cache.clear();

    await fastify.prisma.auditLog.create({
      data: {
        action: 'SELLER_PROFILE_CREATED',
        actorId: userId,
        target: result.id,
        context: { shopName: result.shopName, slug: result.slug },
        ipAddress: request.ip,
        userAgent: request.headers['user-agent']
      }
    });

    return reply.code(201).send(result);
  });
}

async function resolveSeller(fastify, slugOrId) {
  if (UUID_RE.test(slugOrId)) {
    const byId = await fastify.prisma.sellerProfile.findUnique({
      where: { id: slugOrId },
      select: sellerDetailSelect()
    });
    if (byId) return byId;
  }
  return fastify.prisma.sellerProfile.findUnique({
    where: { slug: slugOrId },
    select: sellerDetailSelect()
  });
}

function sellerDetailSelect() {
  return {
    id: true,
    slug: true,
    shopName: true,
    bio: true,
    location: true,
    phoneNumber: true,
    verificationStatus: true,
    verifiedAt: true,
    featuredImageUrl: true,
    createdAt: true,
    user: {
      select: {
        firstName: true,
        lastName: true,
        email: true
      }
    },
    farmerExtension: { select: { id: true, cooperativeName: true, farmingNotes: true } },
    products: {
      where: { status: 'PUBLISHED', deletedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        currency: true,
        category: true,
        requiresColdChain: true,
        createdAt: true,
        images: { orderBy: { position: 'asc' }, take: 1, select: { url: true, alt: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    }
  };
}

import { mapProductResponse, productPublicSelect } from '../../lib/map-product.js';
import mediaPlugin from './media.js';

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 10;
const CACHE_TTL = 60000;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const productSchema = {
  body: {
    type: 'object',
    required: ['name', 'description', 'price', 'category', 'sellerId'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 200
      },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 5000
      },
      price: {
        type: 'number',
        exclusiveMinimum: 0,
        maximum: 999999999.99
      },
      category: {
        type: 'string',
        minLength: 1,
        maxLength: 100
      },
      sellerId: {
        type: 'string',
        minLength: 1,
        maxLength: 100
      },
      slug: { type: 'string', maxLength: 200 },
      currency: { type: 'string', maxLength: 10 },
      requiresColdChain: { type: 'boolean' },
      imageUrls: {
        type: 'array',
        maxItems: 12,
        items: { type: 'string', maxLength: 2000 }
      },
      secondaryCategorySlugs: {
        type: 'array',
        maxItems: 10,
        items: { type: 'string', maxLength: 100 }
      },
      tagSlugs: {
        type: 'array',
        maxItems: 20,
        items: { type: 'string', maxLength: 100 }
      },
      stock: { type: 'integer', minimum: 0, maximum: 999999 },
      status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] }
    },
    additionalProperties: false
  }
};

const productIdParam = {
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', minLength: 1, maxLength: 200 } }
  }
};

const productUpdateSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 200 },
      description: { type: 'string', minLength: 1, maxLength: 5000 },
      price: { type: 'number', exclusiveMinimum: 0, maximum: 999999999.99 },
      category: { type: 'string', minLength: 1, maxLength: 100 },
      status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
      stock: { type: 'integer', minimum: 0, maximum: 999999 }
    },
    additionalProperties: false
  },
  params: productIdParam.params
};

const listQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      search: {
        type: 'string',
        maxLength: 200
      },
      category: {
        type: 'string',
        maxLength: 100
      },
      branchSlug: {
        type: 'string',
        maxLength: 100
      },
      coldChain: {
        type: 'string',
        enum: ['0', '1', 'true', 'false']
      },
      minPrice: {
        type: 'number',
        minimum: 0,
        maximum: 999999999.99
      },
      maxPrice: {
        type: 'number',
        minimum: 0,
        maximum: 999999999.99
      },
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
      sortBy: {
        type: 'string',
        enum: ['name', 'price', 'createdAt'],
        default: 'createdAt'
      },
      sortOrder: {
        type: 'string',
        enum: ['asc', 'desc'],
        default: 'desc'
      }
    }
  }
};

function slugifyProduct(name, id) {
  const base = String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'product'}-${String(id).replace(/-/g, '').slice(0, 8)}`;
}

export default async function (fastify) {
  // Register media route as a child plugin so /products/media/:filename is
  // served alongside the catalog endpoints. @fastify/autoload only picks up
  // index.js per directory, so siblings need to be wired explicitly.
  await fastify.register(mediaPlugin);

  fastify.get('/', { schema: listQuerySchema }, async (request) => {
    const {
      search,
      category,
      branchSlug,
      coldChain,
      minPrice,
      maxPrice,
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = request.query;

    const safeLimit = Math.min(parseInt(limit, 10), MAX_PAGE_SIZE);
    const safePage = Math.max(parseInt(page, 10), 1);
    const trimmedSearchForCache =
      typeof search === 'string' ? search.trim().toLowerCase() : '';

    const cacheKey = `products:list:${trimmedSearchForCache}:${category || ''}:${branchSlug || ''}:${coldChain || ''}:${minPrice || ''}:${maxPrice || ''}:${safePage}:${safeLimit}:${sortBy}:${sortOrder}`;
    const cached = fastify.cache.get(cacheKey);

    if (cached && !request.headers['x-no-cache']) {
      return cached;
    }

    const and = [{ deletedAt: null }, { status: 'PUBLISHED' }];

    if (branchSlug) {
      const root = await fastify.prisma.category.findUnique({
        where: { slug: String(branchSlug).toLowerCase() },
        select: { id: true }
      });
      if (root) {
        const childIds = await fastify.prisma.category.findMany({
          where: { parentId: root.id },
          select: { id: true }
        });
        const ids = [root.id, ...childIds.map((c) => c.id)];
        and.push({
          categories: {
            some: { categoryId: { in: ids } }
          }
        });
      }
    } else if (category) {
      and.push({
        OR: [
          { category: { equals: category, mode: 'insensitive' } },
          {
            categories: {
              some: {
                category: { slug: { equals: category, mode: 'insensitive' } }
              }
            }
          }
        ]
      });
    }

    if (
      coldChain === '1' ||
      coldChain === 'true' ||
      String(coldChain).toLowerCase() === 'true'
    ) {
      and.push({ requiresColdChain: true });
    }

    if (trimmedSearchForCache) {
      // Escape PG LIKE metacharacters so a query like "50% off" doesn't
      // accidentally match everything.
      const sanitizedSearch = trimmedSearchForCache.replace(/[%_]/g, '\\$&');
      and.push({
        OR: [
          { name: { contains: sanitizedSearch, mode: 'insensitive' } },
          { description: { contains: sanitizedSearch, mode: 'insensitive' } },
          { category: { contains: sanitizedSearch, mode: 'insensitive' } },
          {
            tags: {
              some: {
                tag: {
                  OR: [
                    { name: { contains: sanitizedSearch, mode: 'insensitive' } },
                    { slug: { contains: sanitizedSearch, mode: 'insensitive' } }
                  ]
                }
              }
            }
          },
          {
            categories: {
              some: {
                category: {
                  OR: [
                    { name: { contains: sanitizedSearch, mode: 'insensitive' } },
                    { slug: { contains: sanitizedSearch, mode: 'insensitive' } }
                  ]
                }
              }
            }
          },
          {
            seller: {
              OR: [
                { shopName: { contains: sanitizedSearch, mode: 'insensitive' } },
                { slug: { contains: sanitizedSearch, mode: 'insensitive' } }
              ]
            }
          }
        ]
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const range = {};
      if (minPrice !== undefined) range.gte = minPrice;
      if (maxPrice !== undefined) range.lte = maxPrice;
      and.push({ price: range });
    }

    const where = { AND: and };

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const skip = (safePage - 1) * safeLimit;

    const [rows, total] = await Promise.all([
      fastify.prisma.product.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy,
        select: productPublicSelect()
      }),
      fastify.prisma.product.count({ where })
    ]);

    const products = rows.map(mapProductResponse);

    const totalPages = Math.ceil(total / safeLimit);

    const result = {
      products,
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

  fastify.get('/:id', { schema: productIdParam }, async (request, reply) => {
    const { id } = request.params;

    const cacheKey = `products:${id}`;
    const cached = fastify.cache.get(cacheKey);

    if (cached && !request.headers['x-no-cache']) {
      return cached;
    }

    const whereClause = UUID_RE.test(id)
      ? { id }
      : { slug: id };

    const productRow = await fastify.prisma.product.findFirst({
      where: {
        ...whereClause,
        deletedAt: null
      },
      select: {
        ...productPublicSelect(),
        deletedAt: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!productRow || productRow.deletedAt) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Product not found'
      });
    }

    const { deletedAt, owner, ...restRow } = productRow;
    const safeProduct = mapProductResponse(restRow);
    safeProduct.owner = owner;

    if (!request.headers['x-no-cache']) {
      fastify.cache.set(cacheKey, safeProduct, CACHE_TTL);
    }

    return safeProduct;
  });

  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: productSchema
  }, async (request, reply) => {
    const { role, sub: userId } = request.user;

    if (role !== 'ADMIN' && role !== 'MODERATOR' && role !== 'SELLER') {
      return reply.code(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Only sellers or admins can create products'
      });
    }

    const body = request.body;
    const seller = await fastify.prisma.sellerProfile.findUnique({
      where: { id: body.sellerId },
      select: { userId: true, verificationStatus: true, shopName: true }
    });

    if (!seller) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Seller not found'
      });
    }

    if (role === 'SELLER' && seller.userId !== userId) {
      return reply.code(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'You can only create products for your own seller profile'
      });
    }

    if (seller.verificationStatus !== 'APPROVED') {
      return reply.code(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Cannot create products for an unverified seller'
      });
    }

    const primaryCat = await fastify.prisma.category.findFirst({
      where: { slug: { equals: body.category, mode: 'insensitive' } },
      select: { id: true, slug: true, name: true }
    });

    const categoryLabel = primaryCat?.name || body.category;

    const secondarySlugs = body.secondaryCategorySlugs || [];
    const secondaryCats =
      secondarySlugs.length > 0
        ? await fastify.prisma.category.findMany({
            where: {
              slug: { in: secondarySlugs.map((s) => String(s).toLowerCase()) },
              ...(primaryCat ? { id: { not: primaryCat.id } } : {})
            },
            select: { id: true }
          })
        : [];

    const tagSlugs = (body.tagSlugs || []).map((s) => String(s).toLowerCase());
    const tags =
      tagSlugs.length > 0
        ? await fastify.prisma.tag.findMany({
            where: { slug: { in: tagSlugs } },
            select: { id: true }
          })
        : [];

    const slugBase =
      (body.slug && String(body.slug).trim()) ||
      slugifyProduct(body.name, crypto.randomUUID());

    let slug = slugBase;
    const imageCreates = (body.imageUrls || []).slice(0, 12).map((url, i) => ({
      url,
      alt: body.name,
      position: i
    }));

    const categoryCreates = [];
    if (primaryCat) {
      categoryCreates.push({
        categoryId: primaryCat.id,
        isPrimary: true
      });
    }
    for (const c of secondaryCats) {
      categoryCreates.push({ categoryId: c.id, isPrimary: false });
    }

    const tagCreates = tags.map((t) => ({ tagId: t.id }));

    let product;
    let attempt = 0;
    while (attempt < 5) {
      try {
        product = await fastify.prisma.product.create({
          data: {
            name: body.name,
            slug,
            description: body.description,
            price: body.price,
            currency: body.currency || 'USD',
            category: categoryLabel,
            requiresColdChain: Boolean(body.requiresColdChain),
            sellerId: body.sellerId,
            ownerId: userId,
            status: body.status || 'PUBLISHED',
            ...(imageCreates.length
              ? { images: { create: imageCreates } }
              : {}),
            ...(categoryCreates.length
              ? { categories: { create: categoryCreates } }
              : {}),
            ...(tagCreates.length ? { tags: { create: tagCreates } } : {}),
            variants: {
              create: {
                sku: 'DEFAULT',
                stock: Math.max(0, parseInt(body.stock, 10) || 99)
              }
            }
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            currency: true,
            category: true,
            status: true,
            sellerId: true,
            ownerId: true,
            createdAt: true
          }
        });
        break;
      } catch (e) {
        if (e.code === 'P2002' && attempt < 4) {
          attempt++;
          slug = `${slugBase}-${attempt}`;
          continue;
        }
        throw e;
      }
    }

    fastify.cache.delete(`products:${product.id}`);
    fastify.cache.clear();

    await fastify.prisma.auditLog.create({
      data: {
        action: 'PRODUCT_CREATED',
        actorId: userId,
        target: product.id,
        context: { name: product.name, category: product.category },
        ipAddress: request.ip,
        userAgent: request.headers['user-agent']
      }
    });

    return reply.code(201).send(product);
  });

  fastify.patch('/:id', {
    onRequest: [fastify.authenticate],
    schema: productUpdateSchema
  }, async (request, reply) => {
    const { role, sub: userId } = request.user;
    const { id } = request.params;
    const body = request.body || {};

    const whereClause = UUID_RE.test(id) ? { id } : { slug: id };
    const existing = await fastify.prisma.product.findFirst({
      where: { ...whereClause, deletedAt: null },
      include: { variants: { where: { sku: 'DEFAULT' }, take: 1 } }
    });

    if (!existing) {
      return reply.code(404).send({ message: 'Product not found' });
    }

    if (role === 'SELLER') {
      const seller = await fastify.prisma.sellerProfile.findUnique({
        where: { userId },
        select: { id: true }
      });
      if (!seller || existing.sellerId !== seller.id) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
    } else if (role !== 'ADMIN' && role !== 'MODERATOR') {
      return reply.code(403).send({ message: 'Forbidden' });
    }

    const data = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.price !== undefined) data.price = body.price;
    if (body.category !== undefined) data.category = body.category;
    if (body.status !== undefined) data.status = body.status;

    const product = await fastify.prisma.product.update({
      where: { id: existing.id },
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        currency: true,
        category: true,
        status: true
      }
    });

    if (body.stock !== undefined && existing.variants[0]) {
      await fastify.prisma.productVariant.update({
        where: { id: existing.variants[0].id },
        data: { stock: Math.max(0, parseInt(body.stock, 10) || 0) }
      });
    } else if (body.stock !== undefined) {
      await fastify.prisma.productVariant.create({
        data: {
          productId: existing.id,
          sku: 'DEFAULT',
          stock: Math.max(0, parseInt(body.stock, 10) || 0)
        }
      });
    }

    fastify.cache.delete(`products:${product.id}`);
    fastify.cache.clear();

    return product;
  });

  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: productIdParam
  }, async (request, reply) => {
    const { role, sub: userId } = request.user;
    const { id } = request.params;

    const whereClause = UUID_RE.test(id) ? { id } : { slug: id };
    const existing = await fastify.prisma.product.findFirst({
      where: { ...whereClause, deletedAt: null },
      select: { id: true, sellerId: true, name: true }
    });

    if (!existing) {
      return reply.code(404).send({ message: 'Product not found' });
    }

    if (role === 'SELLER') {
      const seller = await fastify.prisma.sellerProfile.findUnique({
        where: { userId },
        select: { id: true }
      });
      if (!seller || existing.sellerId !== seller.id) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
    } else if (role !== 'ADMIN' && role !== 'MODERATOR') {
      return reply.code(403).send({ message: 'Forbidden' });
    }

    await fastify.prisma.product.update({
      where: { id: existing.id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' }
    });

    fastify.cache.delete(`products:${existing.id}`);
    fastify.cache.clear();

    return { ok: true, message: 'Product removed' };
  });
}

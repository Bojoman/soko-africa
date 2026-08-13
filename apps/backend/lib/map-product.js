/** Shared select + JSON shape for public product APIs */

import { comparisonPrice, toNumber, unitSpec, unitSuffix } from '@soko/units';

/**
 * The DEFAULT variant carries stock. Mirrors `resolveVariant()` in the cart
 * route: prefer sku DEFAULT, else the oldest variant.
 */
function pickVariant(p) {
  const variants = p.variants || [];
  return variants.find((v) => v.sku === 'DEFAULT') || variants[0] || null;
}

export function productPublicSelect() {
  return {
    id: true,
    name: true,
    slug: true,
    description: true,
    price: true,
    currency: true,
    category: true,
    status: true,
    requiresColdChain: true,
    saleUnit: true,
    quantityStep: true,
    minOrderQuantity: true,
    maxOrderQuantity: true,
    netContentValue: true,
    netContentUnit: true,
    createdAt: true,
    updatedAt: true,
    // Stock is needed storefront-side so the quantity stepper can cap at what
    // is actually available instead of the old hardcoded 99.
    variants: {
      orderBy: { createdAt: 'asc' },
      select: { id: true, sku: true, stockQuantity: true }
    },
    images: {
      orderBy: { position: 'asc' },
      select: { id: true, url: true, alt: true, position: true }
    },
    tags: {
      select: {
        tag: { select: { id: true, name: true, slug: true } }
      }
    },
    categories: {
      select: {
        isPrimary: true,
        category: {
          select: { id: true, name: true, slug: true, parentId: true }
        }
      }
    },
    seller: {
      select: {
        id: true,
        slug: true,
        shopName: true,
        verificationStatus: true,
        featuredImageUrl: true,
        user: { select: { firstName: true, lastName: true } }
      }
    }
  };
}

export function mapProductResponse(p) {
  const priceNum = p.price != null ? Number(p.price) : null;
  const images = (p.images || []).map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    position: img.position
  }));
  const tags = (p.tags || []).map((pt) => pt.tag).filter(Boolean);
  const categories = (p.categories || []).map((pc) => ({
    ...pc.category,
    isPrimary: pc.isPrimary
  }));

  const seller = p.seller
    ? {
        id: p.seller.id,
        slug: p.seller.slug,
        shopName: p.seller.shopName,
        verificationStatus: p.seller.verificationStatus,
        featuredImageUrl: p.seller.featuredImageUrl,
        firstName: p.seller.user?.firstName,
        lastName: p.seller.user?.lastName
      }
    : undefined;

  const displayName = seller
    ? [seller.firstName, seller.lastName].filter(Boolean).join(' ') || seller.shopName
    : undefined;

  // Prisma Decimals must never reach the client — `toJSON` would emit strings
  // and every arithmetic on them client-side would silently concatenate.
  const spec = unitSpec(p);
  const variant = pickVariant(p);
  const stockQuantity =
    variant?.stockQuantity != null ? toNumber(variant.stockQuantity) : null;

  const comparison = comparisonPrice({ ...spec, price: priceNum, currency: p.currency });

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: priceNum,
    currency: p.currency || 'USD',
    category: p.category,
    status: p.status,
    requiresColdChain: p.requiresColdChain ?? false,

    // --- unit terms (numbers, never Decimals) ---
    saleUnit: spec.saleUnit,
    quantityStep: spec.quantityStep,
    minOrderQuantity: spec.minOrderQuantity,
    maxOrderQuantity: spec.maxOrderQuantity,
    netContentValue: spec.netContentValue,
    netContentUnit: spec.netContentUnit,
    stockQuantity,

    // --- derived, so every surface renders units identically ---
    unitSuffix: unitSuffix(spec),
    pricePerBaseUnit: comparison ? comparison.amount : null,
    baseUnit: comparison ? comparison.unit : null,

    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    images,
    image: images[0]?.url || null,
    tags,
    categories,
    seller,
    sellerDisplayName: displayName
  };
}

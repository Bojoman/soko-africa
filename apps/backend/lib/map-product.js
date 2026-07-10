/** Shared select + JSON shape for public product APIs */

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
    createdAt: true,
    updatedAt: true,
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

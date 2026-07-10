const SHIPPING_STANDARD = 9.99;
const SHIPPING_EXPRESS = 24.99;
const FREE_SHIPPING_THRESHOLD = 75;

async function ensureDefaultVariant(prisma, productId) {
  let variant = await prisma.productVariant.findFirst({
    where: { productId, sku: 'DEFAULT' }
  });
  if (!variant) {
    variant = await prisma.productVariant.create({
      data: { productId, sku: 'DEFAULT', stock: 999 }
    });
  }
  return variant;
}

function unitPrice(variant, product) {
  if (variant?.price != null) {
    const n = Number(variant.price);
    if (!Number.isNaN(n)) return n;
  }
  const p = Number(product?.price);
  return Number.isNaN(p) ? 0 : p;
}

/**
 * Validate checkout lines against catalog, recompute totals server-side.
 */
export async function validateCheckout(prisma, body) {
  const items = body.items || [];
  if (!items.length) {
    const err = new Error('Cart is empty');
    err.statusCode = 400;
    throw err;
  }

  const lines = [];
  for (const it of items) {
    const productId = it.productId || it.id;
    const quantity = Math.max(1, Math.min(99, Number(it.quantity) || 1));
    if (!productId) {
      const err = new Error('Invalid cart line');
      err.statusCode = 400;
      throw err;
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, deletedAt: null, status: 'PUBLISHED' },
      include: {
        images: { take: 1, orderBy: { position: 'asc' } },
        seller: { select: { id: true, shopName: true } }
      }
    });
    if (!product) {
      const err = new Error(`Product not available: ${it.name || productId}`);
      err.statusCode = 400;
      throw err;
    }

    const variant = await ensureDefaultVariant(prisma, product.id);
    if (variant.stock < quantity) {
      const err = new Error(`Insufficient stock for ${product.name}`);
      err.statusCode = 400;
      throw err;
    }

    const price = unitPrice(variant, product);
    lines.push({
      productId: product.id,
      variantId: variant.id,
      sellerId: product.sellerId,
      name: product.name,
      image: product.images[0]?.url || it.image || null,
      quantity,
      unitPrice: price,
      currency: product.currency || 'USD',
      subtotal: price * quantity
    });
  }

  let subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
  let discount = 0;
  let appliedCouponCode = null;
  let freeShipping = false;

  const code = String(body.couponCode || '')
    .trim()
    .toUpperCase();
  if (code) {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (
      coupon &&
      (!coupon.activeUntil || coupon.activeUntil > new Date()) &&
      (coupon.maxRedemptions == null ||
        coupon.redemptions < coupon.maxRedemptions) &&
      coupon.scope === 'CART'
    ) {
      if (coupon.percentOff != null) {
        discount = (subtotal * coupon.percentOff) / 100;
      } else if (coupon.amountOff != null) {
        discount = Number(coupon.amountOff);
      }
      appliedCouponCode = coupon.code;
      if (code === 'FREESHIP') freeShipping = true;
    } else if (code === 'FREESHIP') {
      freeShipping = true;
      appliedCouponCode = code;
    }
  }

  discount = Math.min(discount, subtotal);
  const subtotalAfterCoupon = Math.max(0, subtotal - discount);

  const shippingMethod = body.shippingMethod === 'express' ? 'express' : 'standard';
  let shipping =
    shippingMethod === 'express' ? SHIPPING_EXPRESS : SHIPPING_STANDARD;
  if (freeShipping || subtotalAfterCoupon >= FREE_SHIPPING_THRESHOLD) {
    shipping = 0;
  }

  const tax = 0;
  const total = subtotalAfterCoupon + shipping + tax;
  const currency = lines[0]?.currency || body.currency || 'USD';

  return {
    lines,
    subtotal,
    discount,
    subtotalAfterCoupon,
    shipping,
    tax,
    total,
    currency,
    couponCode: appliedCouponCode,
    shippingMethod
  };
}

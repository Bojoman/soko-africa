import {
  checkQuantity,
  formatQuantity,
  hasSufficientStock,
  toNumber,
  unitSpec
} from '@soko/units';

import {
  clampMinor,
  fromMinor,
  lineTotalMinor,
  pctOfMinor,
  sumMinor,
  toMinor
} from './money.js';

const SHIPPING_STANDARD = 9.99;
const SHIPPING_EXPRESS = 24.99;
const FREE_SHIPPING_THRESHOLD = 75;

/**
 * The purchasable variant for a product, or null.
 *
 * This replaces an `ensureDefaultVariant` that CREATED a variant with
 * `stock: 999` when none existed — from an unauthenticated guest-checkout
 * path. That made the stock check immediately below it unable to fail, and
 * let any caller write variant rows for arbitrary product ids. A product with
 * no variant is a listing bug; surface it rather than masking it with
 * imaginary inventory.
 */
async function getPurchasableVariant(prisma, productId) {
  return (
    (await prisma.productVariant.findFirst({ where: { productId, sku: 'DEFAULT' } })) ||
    (await prisma.productVariant.findFirst({
      where: { productId },
      orderBy: { createdAt: 'asc' }
    }))
  );
}

function unitPrice(variant, product) {
  if (variant?.price != null) {
    const n = toNumber(variant.price, NaN);
    if (!Number.isNaN(n)) return n;
  }
  return toNumber(product?.price, 0);
}

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

/**
 * Validate checkout lines against catalog, recompute totals server-side.
 *
 * Client-submitted prices and totals are never trusted — only product ids and
 * quantities are read from the payload. All money is computed in integer minor
 * units and rounded once per line, so the buyer's per-line display, this
 * total, and the amount charged agree exactly.
 */
export async function validateCheckout(prisma, body) {
  const items = body.items || [];
  if (!items.length) {
    throw badRequest('Cart is empty');
  }

  const lines = [];
  for (const it of items) {
    const productId = it.productId || it.id;
    if (!productId) {
      throw badRequest('Invalid cart line');
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, deletedAt: null, status: 'PUBLISHED' },
      include: {
        images: { take: 1, orderBy: { position: 'asc' } },
        seller: { select: { id: true, shopName: true } }
      }
    });
    if (!product) {
      throw badRequest(`Product not available: ${it.name || productId}`);
    }

    const variant = await getPurchasableVariant(prisma, product.id);
    if (!variant) {
      throw badRequest(`${product.name} is not available for purchase`);
    }

    const spec = unitSpec({ ...product, stockQuantity: variant.stockQuantity });
    const quantity = toNumber(it.quantity, 0);

    // Deliberately does NOT snap to the nearest legal quantity. The client
    // already snapped, so a mismatch here means a tampered payload or a stale
    // cart — charging for something other than what was asked for is worse
    // than refusing the order.
    const invalid = checkQuantity(spec, quantity, product.name);
    if (invalid) {
      throw badRequest(invalid.message);
    }

    if (!hasSufficientStock(variant.stockQuantity, quantity)) {
      throw badRequest(
        `Insufficient stock for ${product.name} — only ${formatQuantity(
          variant.stockQuantity,
          spec,
          { force: true }
        )} left`
      );
    }

    const currency = product.currency || 'USD';
    const price = unitPrice(variant, product);
    const subtotalMinor = lineTotalMinor(toMinor(price, currency), quantity);

    lines.push({
      productId: product.id,
      variantId: variant.id,
      sellerId: product.sellerId,
      name: product.name,
      image: product.images[0]?.url || it.image || null,
      quantity,
      // Unit terms travel onto the order line so receipts render from a
      // snapshot rather than from a product the seller may later change.
      saleUnit: spec.saleUnit,
      quantityStep: spec.quantityStep,
      netContentValue: spec.netContentValue,
      netContentUnit: spec.netContentUnit,
      unitPrice: price,
      currency,
      subtotalMinor,
      subtotal: fromMinor(subtotalMinor, currency)
    });
  }

  const currency = lines[0]?.currency || body.currency || 'USD';

  // Sum the already-rounded line totals, so the order total always equals the
  // sum of what the buyer saw on each line.
  const subtotalMinor = sumMinor(lines.map((l) => l.subtotalMinor));

  let discountMinor = 0;
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
        discountMinor = pctOfMinor(subtotalMinor, coupon.percentOff);
      } else if (coupon.amountOff != null) {
        discountMinor = toMinor(coupon.amountOff, currency);
      }
      appliedCouponCode = coupon.code;
      if (code === 'FREESHIP') freeShipping = true;
    } else if (code === 'FREESHIP') {
      freeShipping = true;
      appliedCouponCode = code;
    }
  }

  discountMinor = clampMinor(discountMinor, { max: subtotalMinor });
  const subtotalAfterCouponMinor = subtotalMinor - discountMinor;

  const shippingMethod = body.shippingMethod === 'express' ? 'express' : 'standard';
  let shippingMinor = toMinor(
    shippingMethod === 'express' ? SHIPPING_EXPRESS : SHIPPING_STANDARD,
    currency
  );
  if (
    freeShipping ||
    subtotalAfterCouponMinor >= toMinor(FREE_SHIPPING_THRESHOLD, currency)
  ) {
    shippingMinor = 0;
  }

  const taxMinor = 0;
  const totalMinor = subtotalAfterCouponMinor + shippingMinor + taxMinor;

  return {
    lines,
    subtotal: fromMinor(subtotalMinor, currency),
    discount: fromMinor(discountMinor, currency),
    subtotalAfterCoupon: fromMinor(subtotalAfterCouponMinor, currency),
    shipping: fromMinor(shippingMinor, currency),
    tax: fromMinor(taxMinor, currency),
    total: fromMinor(totalMinor, currency),
    totalMinor,
    currency,
    couponCode: appliedCouponCode,
    shippingMethod
  };
}

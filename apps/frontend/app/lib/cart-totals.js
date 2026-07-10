/** Shared cart / checkout pricing rules (single source of truth). */
export const SHIPPING_STANDARD = 9.99;
export const SHIPPING_EXPRESS = 24.99;
export const FREE_SHIPPING_THRESHOLD = 75;

export function parseItemPrice(item) {
  if (typeof item?.price === 'number' && !Number.isNaN(item.price)) {
    return item.price;
  }
  return parseFloat(String(item?.price || '').replace(/[^0-9.]/g, '')) || 0;
}

export function normalizeCartLineItems(cart) {
  return (cart || []).map((item) => ({
    ...item,
    price: parseItemPrice(item),
    quantity: Math.max(1, Number(item.quantity) || 1)
  }));
}

/**
 * @param {Array} cartItems items with numeric `price` and `quantity`
 * @param {{ shippingMethod?: string, appliedCoupon?: object|null }} opts
 */
export function computeOrderTotals(cartItems, opts = {}) {
  const { shippingMethod = 'standard', appliedCoupon = null } = opts;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let couponDiscount = 0;
  let freeShipping = false;

  if (appliedCoupon) {
    if (appliedCoupon.freeShipping) {
      freeShipping = true;
    } else if (appliedCoupon.percentOff != null) {
      couponDiscount = (subtotal * Number(appliedCoupon.percentOff)) / 100;
    } else if (appliedCoupon.amountOff != null) {
      couponDiscount = Number(appliedCoupon.amountOff);
    } else if (appliedCoupon.discountPct != null) {
      couponDiscount = (subtotal * Number(appliedCoupon.discountPct)) / 100;
    }
  }

  couponDiscount = Math.min(couponDiscount, subtotal);
  const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);

  let shipping =
    shippingMethod === 'express' ? SHIPPING_EXPRESS : SHIPPING_STANDARD;
  if (freeShipping || subtotalAfterCoupon >= FREE_SHIPPING_THRESHOLD) {
    shipping = 0;
  }

  const tax = 0;
  const total = subtotalAfterCoupon + shipping + tax;

  return {
    subtotal,
    couponDiscount,
    subtotalAfterCoupon,
    shipping,
    tax,
    total
  };
}

export function couponLabel(coupon) {
  if (!coupon) return '';
  if (coupon.label) return coupon.label;
  if (coupon.freeShipping) return 'Free shipping';
  if (coupon.percentOff != null) return `${coupon.percentOff}% off`;
  if (coupon.amountOff != null) return `$${coupon.amountOff} off`;
  return 'Promo applied';
}

export function mapValidatedCoupon(apiResponse, code) {
  if (!apiResponse?.valid) return null;
  const upper = String(code).trim().toUpperCase();
  const freeShipping =
    apiResponse.freeShipping === true || upper === 'FREESHIP';
  return {
    code: upper,
    percentOff: apiResponse.percentOff ?? null,
    amountOff: apiResponse.amountOff ?? null,
    freeShipping,
    label: freeShipping
      ? 'Free shipping'
      : apiResponse.percentOff != null
        ? `${apiResponse.percentOff}% off`
        : apiResponse.amountOff != null
          ? `$${apiResponse.amountOff} off`
          : 'Promo applied'
  };
}

export async function validateCouponCode(code) {
  const trimmed = String(code || '').trim();
  if (!trimmed) throw new Error('Enter a code to apply');

  const res = await fetch(
    `/api/coupons/validate?${new URLSearchParams({ code: trimmed })}`
  );
  const data = await res.json().catch(() => ({}));
  if (!data.valid) {
    throw new Error(
      data.message || `We couldn't find "${trimmed}".`
    );
  }
  return mapValidatedCoupon(data, trimmed);
}

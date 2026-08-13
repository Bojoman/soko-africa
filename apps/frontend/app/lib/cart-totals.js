/** Shared cart / checkout pricing rules (single source of truth). */
import {
  clampMinor,
  fromMinor,
  lineTotalMinor,
  normalizeQuantity,
  pctOfMinor,
  sumMinor,
  toMinor
} from '@soko/units';

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
    // Snapped to the product's own step/minimum rather than floored at 1,
    // which would round a legitimate 1.5 kg line down to 1 kg.
    quantity: normalizeQuantity(item, item.quantity)
  }));
}

/**
 * One line's total, in the same integer minor units the server uses.
 * Every surface that shows a line total must go through this — a raw
 * `price * quantity` diverges from the server by a cent on values like 1.005.
 */
export function lineTotal(item) {
  const currency = item?.currency || 'USD';
  return fromMinor(
    lineTotalMinor(toMinor(parseItemPrice(item), currency), item?.quantity ?? 0),
    currency
  );
}

/**
 * @param {Array} cartItems items with numeric `price` and `quantity`
 * @param {{ shippingMethod?: string, appliedCoupon?: object|null }} opts
 */
export function computeOrderTotals(cartItems, opts = {}) {
  const { shippingMethod = 'standard', appliedCoupon = null } = opts;

  const currency = cartItems[0]?.currency || 'USD';

  // Mirrors `validateCheckout` on the server exactly: round each line to whole
  // minor units, then sum the rounded lines. Summing first and rounding once
  // at the end would disagree with the server (and with the per-line totals
  // shown right next to this) by a cent on fractional quantities.
  const subtotalMinor = sumMinor(
    cartItems.map((item) =>
      lineTotalMinor(toMinor(item.price, currency), item.quantity)
    )
  );

  let discountMinor = 0;
  let freeShipping = false;

  if (appliedCoupon) {
    if (appliedCoupon.freeShipping) {
      freeShipping = true;
    } else if (appliedCoupon.percentOff != null) {
      discountMinor = pctOfMinor(subtotalMinor, Number(appliedCoupon.percentOff));
    } else if (appliedCoupon.amountOff != null) {
      discountMinor = toMinor(appliedCoupon.amountOff, currency);
    } else if (appliedCoupon.discountPct != null) {
      discountMinor = pctOfMinor(subtotalMinor, Number(appliedCoupon.discountPct));
    }
  }

  discountMinor = clampMinor(discountMinor, { max: subtotalMinor });
  const subtotalAfterCouponMinor = subtotalMinor - discountMinor;

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
    subtotal: fromMinor(subtotalMinor, currency),
    couponDiscount: fromMinor(discountMinor, currency),
    subtotalAfterCoupon: fromMinor(subtotalAfterCouponMinor, currency),
    shipping: fromMinor(shippingMinor, currency),
    tax: fromMinor(taxMinor, currency),
    total: fromMinor(totalMinor, currency)
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

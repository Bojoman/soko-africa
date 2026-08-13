import { isKnownUnit, normalizeQuantity, roundQuantity } from '@soko/units';

import { storage } from './utils';

export const CART_STORAGE_KEY = 'sokoafrica_cart';
export const COUPON_STORAGE_KEY = 'sokoafrica_checkout_coupon';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_LOCAL_ITEMS = 50;

/**
 * Unit terms are persisted alongside the guest line purely so the cart page's
 * stepper knows its step and minimum before the buyer signs in. Like `price`,
 * they are display-only — checkout re-reads them from the catalog.
 */
function sanitizeUnitFields(item) {
  return {
    saleUnit: isKnownUnit(item?.saleUnit) ? item.saleUnit : 'PIECE',
    quantityStep: roundQuantity(item?.quantityStep ?? 1) || 1,
    minOrderQuantity: roundQuantity(item?.minOrderQuantity ?? 1) || 1,
    maxOrderQuantity:
      item?.maxOrderQuantity == null ? null : roundQuantity(item.maxOrderQuantity),
    netContentValue:
      item?.netContentValue == null ? null : roundQuantity(item.netContentValue),
    netContentUnit: isKnownUnit(item?.netContentUnit) ? item.netContentUnit : null,
    stockQuantity:
      item?.stockQuantity == null ? null : roundQuantity(item.stockQuantity)
  };
}

/** Strip client-controlled prices from persisted guest cart (display-only; checkout re-prices). */
export function sanitizeGuestCartItem(item) {
  if (!item || typeof item !== 'object') return null;
  const id = String(item.id || '').trim();
  if (!UUID_RE.test(id)) return null;

  const units = sanitizeUnitFields(item);

  return {
    id,
    ...units,
    name: String(item.name || 'Product').slice(0, 200),
    slug: item.slug ? String(item.slug).slice(0, 200) : undefined,
    image: item.image ? String(item.image).slice(0, 2000) : undefined,
    seller: item.seller ? String(item.seller).slice(0, 120) : undefined,
    category: item.category ? String(item.category).slice(0, 100) : undefined,
    currency: item.currency ? String(item.currency).slice(0, 10) : 'USD',
    // This runs on EVERY read of localStorage. The old clamp floored at 1 and
    // capped at 99, so it silently rewrote a persisted 1.5 kg guest cart to
    // 1 kg on page load. Snap to the line's own step/minimum instead.
    quantity: normalizeQuantity(units, item.quantity),
    selectedVariant: item.selectedVariant ?? null,
    addedAt: item.addedAt || new Date().toISOString(),
    // price kept for UI display only — never trusted at checkout
    price:
      typeof item.price === 'number' && !Number.isNaN(item.price)
        ? item.price
        : parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || 0
  };
}

export function loadGuestCart() {
  const raw = storage.get(CART_STORAGE_KEY);
  if (!Array.isArray(raw)) return [];
  return raw.map(sanitizeGuestCartItem).filter(Boolean).slice(0, MAX_LOCAL_ITEMS);
}

export function saveGuestCart(items) {
  const safe = (items || [])
    .map(sanitizeGuestCartItem)
    .filter(Boolean)
    .slice(0, MAX_LOCAL_ITEMS);
  storage.set(CART_STORAGE_KEY, safe);
  return safe;
}

export function clearGuestCart() {
  storage.remove(CART_STORAGE_KEY);
}

export function isValidProductId(id) {
  return UUID_RE.test(String(id || '').trim());
}

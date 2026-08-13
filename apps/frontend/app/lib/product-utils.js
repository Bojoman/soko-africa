/** Helpers for API-shaped products on the storefront */

import {
  comparisonPrice,
  formatQuantity as formatUnitQuantity,
  getUnit,
  packSummary,
  quantityBounds,
  unitSpec,
  unitSuffix
} from '@soko/units';

export const PLACEHOLDER_PRODUCT_IMAGE =
  '/utility/why-choose-soko-africa.png';

export function getProductCardImage(product) {
  if (!product) return PLACEHOLDER_PRODUCT_IMAGE;
  if (product.image) return product.image;
  const first = product.images?.[0];
  if (typeof first === 'string') return first;
  if (first?.url) return first.url;
  return PLACEHOLDER_PRODUCT_IMAGE;
}

export function formatMoney(amount, currency = 'USD') {
  if (amount == null || Number.isNaN(Number(amount))) return '—';
  const n = Number(amount);
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD'
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

/** Accepts API number or legacy "$12.00" string */
export function formatProductPrice(product) {
  if (!product) return '—';
  if (typeof product.price === 'string') return product.price;
  return formatMoney(product.price, product.currency);
}

/* ------------------------------------------------------------------ */
/* Units of measure                                                    */
/*                                                                     */
/* All of these are no-ops for a plain PIECE product with no declared  */
/* pack contents — a jewellery listing renders exactly as it did before */
/* units existed.                                                      */
/* ------------------------------------------------------------------ */

/** "KES 180 /kg" · "KES 360 /crate" · "$26" for a bare piece. */
export function formatUnitPrice(product) {
  const base = formatProductPrice(product);
  const suffix = unitSuffix(product);
  return suffix ? `${base} ${suffix}` : base;
}

/** "KES 180/kg" derived from a 2 kg crate at KES 360, else null. */
export function formatComparisonPrice(product) {
  const c = comparisonPrice(product);
  if (!c) return null;
  return `${formatMoney(c.amount, c.currency)}/${getUnit(c.unit).short}`;
}

/** "2 kg crate" · "500 ml pack" · null when nothing is declared. */
export function formatPackSummary(product) {
  const contents = packSummary(product);
  if (!contents) return null;
  const unit = getUnit(unitSpec(product).saleUnit);
  return unit.omitLabel ? contents : `${contents} ${unit.singular}`;
}

/** "1.5 kg" · "2 crates" · "3" for a bare piece. */
export function formatQuantity(quantity, product, options) {
  return formatUnitQuantity(quantity, product, options);
}

/** "1.5 kg × KES 180/kg" — the label above a cart line total. */
export function formatLineLabel(item) {
  return `${formatQuantity(item?.quantity, item, { force: true })} × ${formatUnitPrice(
    item
  )}`;
}

/** `{ min, max, step, maxDecimals, fractional, unavailable }` for a stepper. */
export function getQuantityBounds(product) {
  return quantityBounds(product);
}

/** "12.5 kg available" · "3 crates available" · null when stock is unknown. */
export function formatStockLabel(product) {
  const stock = product?.stockQuantity;
  if (stock == null) return null;
  return `${formatQuantity(stock, product, { force: true })} available`;
}

export function getPrimaryCategoryLabel(product) {
  if (!product) return '';
  const primary = product.categories?.find((c) => c.isPrimary) || product.categories?.[0];
  return primary?.name || product.category || 'Marketplace';
}

export function getSellerLabel(product) {
  return (
    product?.seller?.shopName ||
    product?.sellerDisplayName ||
    product?.seller ||
    product?.creator ||
    ''
  );
}

export function toProductPath(product) {
  if (!product) return '/products';
  const key = product.slug || product.id;
  return `/products/${key}`;
}

/** Tag slug or name for ProductCard badge */
export function getProductBadge(product) {
  const t = product?.tags?.[0];
  if (!t) return null;
  return t.name || t.slug || null;
}

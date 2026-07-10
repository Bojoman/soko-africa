/** Helpers for API-shaped products on the storefront */

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

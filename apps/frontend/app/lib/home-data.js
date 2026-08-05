/**
 * Server-side catalog fetch for the homepage (and other RSC pages).
 * Hits the Fastify API directly so we don't round-trip through the Next BFF.
 */
const API_BASE =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3001';

export async function fetchHomeProducts(limit = 12) {
  try {
    const res = await fetch(
      `${API_BASE}/products?limit=${limit}&sortBy=createdAt&sortOrder=desc`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.products) ? data.products : [];
  } catch {
    return [];
  }
}

export async function fetchHomeCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      next: { revalidate: 120 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.categories) ? data.categories : [];
  } catch {
    return [];
  }
}

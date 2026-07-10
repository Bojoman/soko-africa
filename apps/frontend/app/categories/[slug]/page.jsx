"use client";
import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import ProductCard from '../../components/ui/ProductCard';
import { ChevronLeft } from 'lucide-react';

export default function CategoryDetailPage({ params }) {
  const { slug } = use(params);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [cRes, pRes] = await Promise.all([
          fetch(`/api/categories/${encodeURIComponent(slug)}`),
          fetch(`/api/products?branchSlug=${encodeURIComponent(slug)}&limit=100`)
        ]);
        const cj = cRes.ok ? await cRes.json() : null;
        const pj = pRes.ok ? await pRes.json() : { products: [] };
        if (!cancelled) {
          setCategory(cj?.category || null);
          setProducts(pj.products || []);
        }
      } catch {
        if (!cancelled) {
          setCategory(null);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-orange-600 mb-6 hover:underline"
        >
          <ChevronLeft size={16} /> All categories
        </Link>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : !category ? (
          <div>
            <h1 className="text-2xl font-bold mb-2">Category not found</h1>
            <p className="text-gray-600">Try browsing from the categories hub.</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-soko-dark-teal mb-2">{category.name}</h1>
            {category.children?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {category.children.map((ch) => (
                  <Link
                    key={ch.id}
                    href={`/categories/${ch.slug}`}
                    className="px-3 py-1 rounded-full border text-sm hover:border-soko-orange"
                  >
                    {ch.name}
                  </Link>
                ))}
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">Products</h2>
            {products.length === 0 ? (
              <p className="text-gray-500">No listings in this branch yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} showAddToCart={false} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

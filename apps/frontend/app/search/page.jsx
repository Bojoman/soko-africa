"use client";
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import { Search, ChevronRight, X, SlidersHorizontal, ChevronLeft } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'name:asc', label: 'Name A-Z' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' }
];

const RESULTS_LIMIT = 24;

function ResultSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-4/5 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function flattenCategoryTree(nodes) {
  const out = [];
  const walk = (node, depth = 0) => {
    out.push({
      id: node.id,
      slug: node.slug,
      name: node.name,
      depth
    });
    (node.children || []).forEach((child) => walk(child, depth + 1));
  };
  (nodes || []).forEach((n) => walk(n));
  return out;
}

function SearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams?.get('q') || '';
  const categorySlug = searchParams?.get('category') || '';
  const sortParam = searchParams?.get('sort') || 'createdAt:desc';
  const page = Math.max(1, parseInt(searchParams?.get('page') || '1', 10) || 1);

  const [debouncedQ, setDebouncedQ] = useState(q);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Debounce the query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  // Fetch categories once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCategoriesLoading(true);
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        if (cancelled) return;
        setCategories(flattenCategoryTree(data?.categories).filter((c) => c.depth === 0));
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError('');
      try {
        const [sortBy, sortOrder] = sortParam.split(':');
        const params = new URLSearchParams();
        if (debouncedQ.trim()) params.set('search', debouncedQ.trim());
        if (categorySlug) params.set('branchSlug', categorySlug);
        params.set('limit', String(RESULTS_LIMIT));
        params.set('page', String(page));
        params.set('sortBy', sortBy || 'createdAt');
        params.set('sortOrder', sortOrder || 'desc');

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        if (cancelled) return;
        setProducts(data.products || []);
        setPagination(data.pagination || null);
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Something went wrong');
          setProducts([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedQ, categorySlug, sortParam, page]);

  const updateParam = (key, value) => {
    updateParams({ [key]: value });
  };

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams?.toString() || '');
    for (const [key, value] of Object.entries(updates || {})) {
      if (value === '' || value == null) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }
    const qs = next.toString();
    router.push(qs ? `/search?${qs}` : '/search');
  };

  const setPage = (nextPage) => {
    updateParam('page', Math.max(1, nextPage));
  };

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );

  const total = pagination?.total ?? products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-soko-orange">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-soko-dark-teal font-medium">Search</span>
          {q && (
            <>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-gray-700 truncate">&ldquo;{q}&rdquo;</span>
            </>
          )}
        </nav>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-soko-dark-teal mb-2">
            {q ? (
              <>
                Search results for{' '}
                <span className="text-soko-orange">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              <>
                Browse <span className="text-soko-orange">all products</span>
              </>
            )}
          </h1>
          <p className="text-gray-600">
            {isLoading
              ? 'Searching…'
              : `Showing ${products.length} ${products.length === 1 ? 'result' : 'results'}${
                  total > products.length ? ` of ${total}` : ''
                }${q ? ` for "${q}"` : ''}`}
          </p>
        </div>

        {/* Filters row */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <button
              type="button"
              onClick={() => {
                updateParams({ category: '', page: '' });
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                !categorySlug
                  ? 'bg-soko-dark-teal text-white border-soko-dark-teal'
                  : 'bg-white text-soko-dark-teal border-gray-200 hover:border-soko-dark-teal'
              }`}
            >
              All
            </button>
            {categoriesLoading ? (
              <span className="text-sm text-gray-400 px-2">Loading filters…</span>
            ) : (
              categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    updateParams({ category: c.slug, page: '' });
                  }}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                    categorySlug === c.slug
                      ? 'bg-soko-orange text-white border-soko-orange'
                      : 'bg-white text-soko-dark-teal border-gray-200 hover:border-soko-orange hover:text-soko-orange'
                  }`}
                >
                  {c.name}
                </button>
              ))
            )}
            {activeCategory && (
              <button
                type="button"
                onClick={() => {
                  updateParams({ category: '', page: '' });
                }}
                className="ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-soko-dark-red"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="search-sort"
              className="text-sm text-gray-500 hidden sm:inline-flex items-center gap-1"
            >
              <SlidersHorizontal size={14} /> Sort:
            </label>
            <select
              id="search-sort"
              value={sortParam}
              onChange={(e) => {
                updateParams({ sort: e.target.value, page: '' });
              }}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-soko-dark-teal font-medium focus:outline-none focus:ring-2 focus:ring-soko-orange/30 focus:border-soko-orange"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && !isLoading && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800">
            <h3 className="font-semibold mb-1">Could not load results</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ResultSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 && !error ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl text-center py-20 px-6">
            <Search size={56} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-soko-dark-teal mb-2">
              {q ? (
                <>
                  No results for{' '}
                  <span className="text-soko-orange">&ldquo;{q}&rdquo;</span>
                </>
              ) : (
                'No products yet'
              )}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              Try a different keyword, remove filters, or browse our full catalog.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {q && (
                <Link
                  href="/search"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl border-2 border-soko-dark-teal text-soko-dark-teal hover:bg-soko-dark-teal hover:text-white font-bold transition-colors"
                >
                  Clear search
                </Link>
              )}
              <Link
                href="/products"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors"
              >
                Browse all products
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {(pagination?.totalPages || 1) > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Search pagination">
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination?.hasPrev}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-soko-dark-teal disabled:opacity-40 disabled:cursor-not-allowed hover:border-soko-orange hover:text-soko-orange"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="px-3 py-2 text-sm font-semibold text-soko-dark-teal">
                  Page {pagination?.page || page} of {pagination?.totalPages || 1}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination?.hasNext}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-soko-dark-teal disabled:opacity-40 disabled:cursor-not-allowed hover:border-soko-orange hover:text-soko-orange"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ResultSkeleton key={i} />
              ))}
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}

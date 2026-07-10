"use client";
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Snowflake,
  Sparkles,
  X
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'name:asc', label: 'Name A-Z' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' }
];

const PAGE_SIZE = 12;

function ProductSkeleton() {
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

function ProductsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams?.get('category') || '';
  const initialMin = searchParams?.get('minPrice') || '';
  const initialMax = searchParams?.get('maxPrice') || '';
  const initialColdChain = searchParams?.get('coldChain') === '1';
  const initialSort = searchParams?.get('sort') || 'createdAt:desc';
  const initialPage = Math.max(1, parseInt(searchParams?.get('page') || '1', 10) || 1);
  const initialQ = searchParams?.get('q') || '';

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [debouncedSearch, setDebouncedSearch] = useState(initialQ);

  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);
  const [coldChain, setColdChain] = useState(initialColdChain);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, hasNext: false, hasPrev: false });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch categories
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCategoriesLoading(true);
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to load categories');
        const data = await res.json();
        if (cancelled) return;
        const roots = (data?.categories || []).map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name
        }));
        setCategories(roots);
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

  // Sync state -> URL (without scroll reset)
  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedSearch) next.set('q', debouncedSearch);
    if (category) next.set('category', category);
    if (minPrice) next.set('minPrice', minPrice);
    if (maxPrice) next.set('maxPrice', maxPrice);
    if (coldChain) next.set('coldChain', '1');
    if (sort !== 'createdAt:desc') next.set('sort', sort);
    if (page > 1) next.set('page', String(page));
    const qs = next.toString();
    router.replace(qs ? `/products?${qs}` : '/products', { scroll: false });
  }, [router, debouncedSearch, category, minPrice, maxPrice, coldChain, sort, page]);

  // Fetch products whenever filters change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError('');
      try {
        const [sortBy, sortOrder] = sort.split(':');
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (category) params.set('branchSlug', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (coldChain) params.set('coldChain', '1');
        params.set('limit', String(PAGE_SIZE));
        params.set('page', String(page));
        params.set('sortBy', sortBy || 'createdAt');
        params.set('sortOrder', sortOrder || 'desc');

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        if (cancelled) return;
        setProducts(data.products || []);
        setPagination(
          data.pagination || {
            page: 1,
            totalPages: 1,
            total: data.products?.length || 0,
            hasNext: false,
            hasPrev: false
          }
        );
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
  }, [debouncedSearch, category, minPrice, maxPrice, coldChain, sort, page]);

  // Reset page when any filter (other than `page`) changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, minPrice, maxPrice, coldChain, sort]);

  const activeFilters = useMemo(() => {
    const items = [];
    if (category) {
      const c = categories.find((x) => x.slug === category);
      if (c) items.push({ key: 'category', label: c.name, onRemove: () => setCategory('') });
    }
    if (minPrice) items.push({ key: 'minPrice', label: `Min $${minPrice}`, onRemove: () => setMinPrice('') });
    if (maxPrice) items.push({ key: 'maxPrice', label: `Max $${maxPrice}`, onRemove: () => setMaxPrice('') });
    if (coldChain) items.push({ key: 'coldChain', label: 'Cold chain', onRemove: () => setColdChain(false) });
    if (debouncedSearch) items.push({ key: 'q', label: `“${debouncedSearch}”`, onRemove: () => setSearchTerm('') });
    return items;
  }, [category, categories, minPrice, maxPrice, coldChain, debouncedSearch]);

  const clearAll = () => {
    setSearchTerm('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setColdChain(false);
    setSort('createdAt:desc');
    setPage(1);
  };

  const totalPages = pagination?.totalPages || 1;
  const pagesToShow = useMemo(() => {
    const max = 5;
    const tp = Math.max(1, totalPages);
    const start = Math.max(1, Math.min(page - 2, tp - max + 1));
    const end = Math.min(tp, start + max - 1);
    const out = [];
    for (let i = start; i <= end; i += 1) out.push(i);
    return out;
  }, [page, totalPages]);

  const Sidebar = (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-soko-dark-teal flex items-center gap-2">
            <Filter size={18} /> Filters
          </h2>
          {activeFilters.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-soko-dark-red hover:text-soko-orange"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-soko-dark-teal mb-3 uppercase tracking-wider">
            Category
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="category"
                value=""
                checked={category === ''}
                onChange={() => setCategory('')}
                className="text-soko-orange focus:ring-soko-orange"
              />
              <span className="text-gray-700">All categories</span>
            </label>
            {categoriesLoading ? (
              <p className="text-xs text-gray-400">Loading…</p>
            ) : (
              categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="category"
                    value={c.slug}
                    checked={category === c.slug}
                    onChange={() => setCategory(c.slug)}
                    className="text-soko-orange focus:ring-soko-orange"
                  />
                  <span className="text-gray-700">{c.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-soko-dark-teal mb-3 uppercase tracking-wider">
            Price (USD)
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-2 focus:ring-soko-orange/30"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-2 focus:ring-soko-orange/30"
            />
          </div>
        </div>

        {/* Cold chain */}
        <div className="mb-2">
          <label className="flex items-center gap-3 cursor-pointer bg-soko-cream/30 hover:bg-soko-cream/50 rounded-xl px-3 py-3 transition-colors">
            <input
              type="checkbox"
              checked={coldChain}
              onChange={(e) => setColdChain(e.target.checked)}
              className="rounded border-gray-300 text-soko-orange focus:ring-soko-orange"
            />
            <Snowflake size={16} className="text-soko-bright-cyan" />
            <span className="text-sm font-semibold text-soko-dark-teal">
              Cold-chain only
            </span>
          </label>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <section className="relative mb-10 bg-soko-dark-teal rounded-3xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            />
          </div>
          <div className="relative z-10 px-8 py-12 md:py-16 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soko-orange/15 text-soko-orange text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} /> Sourced across Africa
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Discover <span className="text-soko-orange">African</span> products
            </h1>
            <p className="mt-4 text-white/85 max-w-2xl mx-auto">
              Fresh produce, handcrafted goods, fashion and more — from verified
              sellers across the continent.
            </p>
          </div>
        </section>

        {/* Search + sort toolbar */}
        <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto_auto] items-stretch">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search the catalog…"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-soko-dark-teal placeholder-gray-400 focus:outline-none focus:border-soko-orange focus:ring-2 focus:ring-soko-orange/30"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm text-gray-500 hidden md:block">
              Sort:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-soko-dark-teal font-medium focus:outline-none focus:ring-2 focus:ring-soko-orange/30 focus:border-soko-orange"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowMobileFilters((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border-2 border-soko-dark-teal text-soko-dark-teal font-bold text-sm hover:bg-soko-dark-teal hover:text-white transition-colors"
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={f.onRemove}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-soko-cream/60 text-soko-dark-teal hover:bg-soko-cream"
              >
                {f.label} <X size={12} />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="ml-1 text-xs text-soko-dark-red font-semibold hover:text-soko-orange"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            {Sidebar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {isLoading
                  ? 'Loading products…'
                  : `Showing ${products.length} of ${pagination?.total ?? products.length}`}
              </p>
            </div>

            {error && !isLoading && (
              <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800">
                <h3 className="font-semibold mb-1">Could not load products</h3>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 && !error ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl text-center py-20 px-6">
                <Search size={56} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-soko-dark-teal mb-2">
                  No products match your filters
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  Try removing a filter, lowering the price range, or searching for
                  something else.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    className="mt-12 flex items-center justify-center gap-2"
                    aria-label="Pagination"
                  >
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrev}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-soko-dark-teal disabled:opacity-40 disabled:cursor-not-allowed hover:border-soko-orange hover:text-soko-orange"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {pagesToShow.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={`min-w-10 h-10 px-3 rounded-xl text-sm font-bold transition-colors ${
                          n === page
                            ? 'bg-soko-dark-teal text-white border border-soko-dark-teal'
                            : 'border border-gray-200 text-soko-dark-teal hover:border-soko-orange hover:text-soko-orange'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={!pagination.hasNext}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-soko-dark-teal disabled:opacity-40 disabled:cursor-not-allowed hover:border-soko-orange hover:text-soko-orange"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <ProductsInner />
    </Suspense>
  );
}

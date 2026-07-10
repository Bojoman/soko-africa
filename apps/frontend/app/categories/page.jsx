"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import CategoryCard from '../components/ui/CategoryCard';
import { getCategoryImage } from '../lib/category-assets';
import { Search, Grid3X3, List } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [categoryRes, productRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?limit=100&sortBy=createdAt&sortOrder=desc')
        ]);
        const categoryData = categoryRes.ok ? await categoryRes.json() : { categories: [] };
        const productData = productRes.ok ? await productRes.json() : { products: [] };
        if (!cancelled) {
          setCategories(categoryData.categories || []);
          setProducts(productData.products || []);
        }
      } catch {
        if (!cancelled) {
          setCategories([]);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const map = { all: products.length };
    for (const c of categories) {
      const slugs = [c.slug, ...(c.children || []).map((child) => child.slug)];
      map[c.slug] = products.filter((p) =>
        (p.categories || []).some((cat) => slugs.includes(cat.slug))
      ).length;
    }
    return map;
  }, [categories, products]);

  const filtered = useMemo(() => {
    let rows = products.filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q);
      if (!matchQ) return false;
      if (selectedCategory === 'all') return true;
      const root = categories.find((c) => c.slug === selectedCategory);
      const slugs = root
        ? [root.slug, ...(root.children || []).map((child) => child.slug)]
        : [selectedCategory];
      return (p.categories || []).some((cat) => slugs.includes(cat.slug));
    });
    rows = [...rows].sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return a.name.localeCompare(b.name);
    });
    return rows;
  }, [categories, products, searchTerm, selectedCategory, sortBy]);

  const categoryCards = useMemo(
    () =>
      categories.map((category) => ({
        id: category.slug,
        slug: category.slug,
        name: category.name,
        icon: category.iconKey,
        image: getCategoryImage(category.slug),
        description: `Browse ${category.name.toLowerCase()} from verified Soko Africa sellers.`,
        subcategories: (category.children || []).map((child) => child.name),
        count: `${counts[category.slug] ?? 0} products`,
        href: category.slug === 'nyamazone' ? '/nyamazone' : `/categories/${category.slug}`
      })),
    [categories, counts]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-orange-600">Shop by Category</h1>
          <p className="text-gray-600">
            Discover authentic African products from verified sellers on Soko Africa.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-orange-600">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoryCards.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                showProductCount={true}
              />
            ))}
          </div>
        </section>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All categories ({counts.all})</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({counts[c.slug] ?? 0})
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          {loading ? 'Loading…' : `Showing ${filtered.length} products`}
        </p>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading catalog…</div>
        ) : filtered.length ? (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} showAddToCart={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No products match your filters.</div>
        )}

        <div className="mt-10 text-center">
          <Link href="/products" className="text-orange-600 font-semibold hover:underline">
            Open full product search →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

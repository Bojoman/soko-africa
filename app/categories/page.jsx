"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import CategoryCard from '../components/ui/CategoryCard';
import { PRODUCT_CATEGORIES } from '../lib/constants';
import { 
  Filter, 
  Search, 
  Grid3X3, 
  List,
  ChevronDown,
  Star
} from 'lucide-react';

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample products for demonstration
  const allProducts = [
    // Agri & Natural Products
    {
      id: 'kenyan-avocadoes',
      name: 'Fresh Kenyan Avocadoes (6 pack)',
      price: '$12.99',
      originalPrice: '$15.99',
      image: 'https://images.unsplash.com/photo-1583062142100-4e1f49c8bb82?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 156,
      badge: 'Seasonal',
      category: 'agriculture'
    },
    {
      id: 'macadamia-nuts',
      name: 'Premium Macadamia Nuts (500g)',
      price: '$28.50',
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      badge: 'Premium',
      category: 'agriculture'
    },
    {
      id: 'ethiopian-coffee',
      name: 'Ethiopian Single Origin Coffee',
      price: '$24.99',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 234,
      badge: 'Bestseller',
      category: 'agriculture'
    },
    {
      id: 'wild-honey',
      name: 'Wild African Honey (500ml)',
      price: '$18.99',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 112,
      badge: 'Organic',
      category: 'agriculture'
    },
    
    // Handcrafted Goods
    {
      id: 'maasai-basket',
      name: 'Maasai Hand-woven Basket',
      price: '$35.99',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 67,
      badge: 'Handmade',
      category: 'handcrafted'
    },
    {
      id: 'wooden-sculpture',
      name: 'African Elephant Wood Carving',
      price: '$85.00',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 43,
      badge: 'Artisan Made',
      category: 'handcrafted'
    },
    
    // Textile & Fashion
    {
      id: 'ankara-fabric',
      name: 'Authentic Ankara Fabric (6 yards)',
      price: '$45.00',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format',
      rating: 4.7,
      reviews: 189,
      badge: 'Traditional',
      category: 'fashion'
    },
    {
      id: 'kente-scarf',
      name: 'Handwoven Kente Scarf',
      price: '$38.50',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format',
      rating: 4.8,
      reviews: 124,
      badge: 'Heritage',
      category: 'fashion'
    },
    
    // Beauty & Wellness
    {
      id: 'shea-butter',
      name: 'Raw Shea Butter Skincare Set',
      price: '$32.00',
      image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=300&h=300&fit=crop&auto=format',
      rating: 4.6,
      reviews: 201,
      badge: 'Natural',
      category: 'beauty'
    },
    {
      id: 'argan-oil',
      name: 'Moroccan Argan Oil (100ml)',
      price: '$29.99',
      originalPrice: '$35.99',
      image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=300&h=300&fit=crop&auto=format',
      rating: 4.9,
      reviews: 156,
      badge: 'Pure',
      category: 'beauty'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: allProducts.length },
    ...PRODUCT_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: allProducts.filter(p => p.category === cat.id).length
    }))
  ];

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
      case 'price-high':
        return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-orange-600">Shop by Category</h1>
          <p className="text-gray-600">
            Discover authentic African products from trusted artisans and producers
          </p>
        </div>

        {/* Categories Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-orange-600">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {PRODUCT_CATEGORIES.map((category, index) => (
              <CategoryCard
                key={index}
                category={{
                  ...category,
                  count: allProducts.filter(p => p.category === category.id).length + '+ products',
                  href: category.id === 'nyamazone' ? '/nyamazone' : `#${category.id}`
                }}
                showProductCount={true}
              />
            ))}
          </div>
        </section>

        {/* Filters and Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 placeholder-text-black-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedProducts.length} products
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Products Grid */}
        <section>
          {sortedProducts.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showWishlist={true}
                  showAddToCart={true}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* Load More Button */}
        {sortedProducts.length > 0 && sortedProducts.length >= 12 && (
          <div className="text-center mt-12">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

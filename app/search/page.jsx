"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  SlidersHorizontal,
  X,
  Star,
  ChevronDown
} from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    sortBy: 'relevance',
    inStock: false,
    onSale: false
  });

  // Sample products data
  const allProducts = [
    {
      id: 'kenyan-avocadoes',
      name: 'Fresh Kenyan Avocadoes (6 pack)',
      price: 12.99,
      originalPrice: 15.99,
      image: 'https://images.unsplash.com/photo-1583062142100-4e1f49c8bb82?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 156,
      badge: 'Seasonal',
      category: 'agriculture',
      inStock: true,
      onSale: true
    },
    {
      id: 'macadamia-nuts',
      name: 'Premium Macadamia Nuts (500g)',
      price: 28.50,
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      badge: 'Premium',
      category: 'agriculture',
      inStock: true,
      onSale: false
    },
    {
      id: 'ethiopian-coffee',
      name: 'Ethiopian Single Origin Coffee',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 234,
      badge: 'Bestseller',
      category: 'agriculture',
      inStock: true,
      onSale: false
    },
    {
      id: 'wild-honey',
      name: 'Wild African Honey (500ml)',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 112,
      badge: 'Organic',
      category: 'agriculture',
      inStock: true,
      onSale: false
    },
    {
      id: 'maasai-basket',
      name: 'Maasai Hand-woven Basket',
      price: 35.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 67,
      badge: 'Handmade',
      category: 'handcrafted',
      inStock: true,
      onSale: false
    },
    {
      id: 'wooden-sculpture',
      name: 'African Elephant Wood Carving',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 43,
      badge: 'Artisan Made',
      category: 'handcrafted',
      inStock: false,
      onSale: false
    },
    {
      id: 'ankara-fabric',
      name: 'Authentic Ankara Fabric (6 yards)',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format',
      rating: 4.7,
      reviews: 189,
      badge: 'Traditional',
      category: 'fashion',
      inStock: true,
      onSale: false
    },
    {
      id: 'kente-scarf',
      name: 'Handwoven Kente Scarf',
      price: 38.50,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format',
      rating: 4.8,
      reviews: 124,
      badge: 'Heritage',
      category: 'fashion',
      inStock: true,
      onSale: false
    },
    {
      id: 'shea-butter',
      name: 'Raw Shea Butter Skincare Set',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=300&h=300&fit=crop&auto=format',
      rating: 4.6,
      reviews: 201,
      badge: 'Natural',
      category: 'beauty',
      inStock: true,
      onSale: false
    },
    {
      id: 'argan-oil',
      name: 'Moroccan Argan Oil (100ml)',
      price: 29.99,
      originalPrice: 35.99,
      image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=300&h=300&fit=crop&auto=format',
      rating: 4.9,
      reviews: 156,
      badge: 'Pure',
      category: 'beauty',
      inStock: true,
      onSale: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'agriculture', name: 'Agri & Natural Products' },
    { id: 'handcrafted', name: 'Handcrafted Goods' },
    { id: 'fashion', name: 'Textile & Fashion' },
    { id: 'beauty', name: 'Natural Beauty & Wellness' }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-25', name: 'Under $25' },
    { id: '25-50', name: '$25 - $50' },
    { id: '50-100', name: '$50 - $100' },
    { id: '100+', name: 'Over $100' }
  ];

  const sortOptions = [
    { id: 'relevance', name: 'Most Relevant' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Customer Rating' },
    { id: 'newest', name: 'Newest Arrivals' },
    { id: 'bestselling', name: 'Best Selling' }
  ];

  // Search and filter products
  const searchProducts = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = [...allProducts];

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.badge?.toLowerCase().includes(query)
        );
      }

      // Category filter
      if (filters.category !== 'all') {
        filtered = filtered.filter(product => product.category === filters.category);
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filtered = filtered.filter(product => {
          const price = product.price;
          if (max) {
            return price >= min && price <= max;
          } else {
            return price >= min;
          }
        });
      }

      // Rating filter
      if (filters.rating !== 'all') {
        const minRating = Number(filters.rating);
        filtered = filtered.filter(product => product.rating >= minRating);
      }

      // In stock filter
      if (filters.inStock) {
        filtered = filtered.filter(product => product.inStock);
      }

      // On sale filter
      if (filters.onSale) {
        filtered = filtered.filter(product => product.onSale);
      }

      // Sort products
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.id.localeCompare(a.id); // Simulate newest
          case 'bestselling':
            return b.reviews - a.reviews; // Simulate best selling
          default:
            return 0; // Relevance - keep original order
        }
      });

      setSearchResults(filtered);
      setTotalPages(Math.ceil(filtered.length / 12));
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  };

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    searchProducts();
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Apply filters
  useEffect(() => {
    searchProducts();
  }, [filters]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      rating: 'all',
      sortBy: 'relevance',
      inStock: false,
      onSale: false
    });
    setSearchQuery('');
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating) 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-4">Search Products</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, or categories..."
                className="w-full pl-10 pr-4 py-3 text-black placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                <Search size={16} />
              </button>
            </div>
          </form>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={filters.category === category.id}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-2 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.id} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.id}
                        checked={filters.priceRange === range.id}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="mr-2 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{range.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Customer Rating</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Ratings' },
                    { value: '4', label: '4 stars & up' },
                    { value: '3', label: '3 stars & up' },
                    { value: '2', label: '2 stars & up' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={filters.rating === option.value}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="mr-2 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">On Sale</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">
                  {isLoading ? 'Searching...' : `${searchResults.length} products found`}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="bg-gray-300 h-48"></div>
                    <div className="p-4 space-y-3">
                      <div className="bg-gray-300 h-4 rounded"></div>
                      <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-300 h-6 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && searchResults.length > 0 && (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showWishlist={true}
                    showAddToCart={true}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && searchResults.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && searchResults.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 border rounded-lg text-sm ${
                        currentPage === i + 1
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

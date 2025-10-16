"use client";
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import { PRODUCT_CATEGORIES, SEARCH_FILTERS } from '../lib/constants';
import { 
  Search, 
  SlidersHorizontal, 
  X,
  Grid3X3,
  List,
  ChevronDown,
  ChevronUp,
  Filter,
  Star,
  DollarSign,
  Package,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  Truck,
  Shield
} from 'lucide-react';

export default function ProductsPage() {
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: false,
    badges: false
  });
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Balanced for larger cards

  // Mock product data with expanded attributes
  const allProducts = [
    // Agriculture
    {
      id: 'kenyan-avocadoes',
      name: 'Fresh Kenyan Hass Avocadoes',
      description: 'Premium grade Hass avocadoes from the highlands of Kenya',
      price: 12.99,
      originalPrice: 15.99,
      image: 'https://images.unsplash.com/photo-1583062096232-eb62a19ca728?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 156,
      badge: 'Seasonal',
      category: 'agriculture',
      inStock: true,
      seller: 'Kenyan Fresh Farms'
    },
    {
      id: 'ethiopian-coffee',
      name: 'Ethiopian Single Origin Coffee Beans',
      description: 'Hand-picked Arabica beans from Sidamo region',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 234,
      badge: 'Bestseller',
      category: 'agriculture',
      inStock: true,
      seller: 'Ethiopian Coffee Co.'
    },
    {
      id: 'macadamia-nuts',
      name: 'Premium Roasted Macadamia Nuts',
      description: 'Crunchy roasted macadamias with sea salt',
      price: 28.50,
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 89,
      badge: 'Premium',
      category: 'agriculture',
      inStock: true,
      seller: 'Nut Growers Kenya'
    },
    {
      id: 'wild-honey',
      name: 'Raw Wild African Honey',
      description: 'Unprocessed honey from wild African bees',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 112,
      badge: 'Organic',
      category: 'agriculture',
      inStock: true,
      seller: 'Beekeepers United'
    },
    {
      id: 'basmati-rice',
      name: 'East African Basmati Rice',
      description: 'Aromatic long-grain basmati rice',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      rating: 4.5,
      reviews: 78,
      badge: 'New',
      category: 'agriculture',
      inStock: true,
      seller: 'Rice Mills Ltd'
    },
    
    // Fashion & Textiles
    {
      id: 'ankara-fabric-1',
      name: 'Authentic Ankara Print Fabric',
      description: 'Vibrant African wax print fabric, 6 yards',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 189,
      badge: 'Traditional',
      category: 'fashion',
      inStock: true,
      seller: 'Ankara Designs'
    },
    {
      id: 'kente-scarf',
      name: 'Handwoven Kente Cloth Scarf',
      description: 'Traditional Ghanaian Kente weave',
      price: 38.50,
      image: 'https://images.unsplash.com/photo-1601924638867-4a2eb4e6c56f?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 124,
      badge: 'Heritage',
      category: 'fashion',
      inStock: true,
      seller: 'Ghana Weavers'
    },
    {
      id: 'ankara-dress',
      name: 'Elegant Ankara Maxi Dress',
      description: 'Stylish handmade Ankara print maxi dress',
      price: 75.00,
      originalPrice: 95.00,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 98,
      badge: 'Bestseller',
      category: 'fashion',
      inStock: true,
      seller: 'Afro Couture'
    },
    {
      id: 'dashiki-shirt',
      name: 'Traditional Dashiki Shirt',
      description: 'Colorful embroidered dashiki for men',
      price: 42.00,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 145,
      badge: 'Traditional',
      category: 'fashion',
      inStock: true,
      seller: 'Traditional Wear Co.'
    },
    
    // Handcrafted Goods
    {
      id: 'maasai-basket',
      name: 'Maasai Hand-woven Basket',
      description: 'Authentic Maasai beaded basket',
      price: 35.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 67,
      badge: 'Handmade',
      category: 'handcrafted',
      inStock: true,
      seller: 'Maasai Artisans'
    },
    {
      id: 'wood-carving',
      name: 'African Elephant Wood Carving',
      description: 'Intricately carved ebony wood elephant',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 43,
      badge: 'Premium',
      category: 'handcrafted',
      inStock: true,
      seller: 'Wood Carvers Guild'
    },
    {
      id: 'pottery-set',
      name: 'Traditional Clay Pottery Set',
      description: 'Handmade terracotta pottery, set of 3',
      price: 52.00,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 56,
      badge: 'Handmade',
      category: 'handcrafted',
      inStock: true,
      seller: 'Pottery Masters'
    },
    {
      id: 'wall-art',
      name: 'Maasai Warrior Wall Art',
      description: 'Hand-painted canvas of Maasai warriors',
      price: 125.00,
      image: 'https://images.unsplash.com/photo-1582561833863-dcf4d5f0ec03?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 72,
      badge: 'Premium',
      category: 'handcrafted',
      inStock: true,
      seller: 'African Art Gallery'
    },
    {
      id: 'woven-mat',
      name: 'Handwoven Floor Mat',
      description: 'Natural fiber woven mat with patterns',
      price: 48.00,
      image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=400&h=400&fit=crop',
      rating: 4.6,
      reviews: 89,
      badge: 'Eco-Friendly',
      category: 'handcrafted',
      inStock: true,
      seller: 'Weavers Collective'
    },
    
    // Beauty & Wellness
    {
      id: 'shea-butter',
      name: 'Raw Shea Butter Skincare Set',
      description: 'Pure unrefined shea butter collection',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 201,
      badge: 'Natural',
      category: 'beauty',
      inStock: true,
      seller: 'Beauty of Africa'
    },
    {
      id: 'argan-oil',
      name: 'Moroccan Argan Oil',
      description: '100% pure cold-pressed argan oil',
      price: 29.99,
      originalPrice: 35.99,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 156,
      badge: 'Pure',
      category: 'beauty',
      inStock: true,
      seller: 'Moroccan Oils'
    },
    {
      id: 'black-soap',
      name: 'African Black Soap',
      description: 'Traditional handmade black soap from Ghana',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1585652757173-57de5e9fab42?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 178,
      badge: 'Traditional',
      category: 'beauty',
      inStock: true,
      seller: 'Ghana Soaps'
    },
    {
      id: 'essential-oils',
      name: 'African Essential Oils Set',
      description: 'Collection of 5 therapeutic essential oils',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 134,
      badge: 'Bestseller',
      category: 'beauty',
      inStock: true,
      seller: 'Wellness Africa'
    },
    
    // Nyamazone Meats
    {
      id: 'grass-fed-beef',
      name: 'Premium Grass-Fed Beef',
      description: 'Tender grass-fed beef cuts, 2kg',
      price: 65.00,
      image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop',
      rating: 4.9,
      reviews: 87,
      badge: 'Premium',
      category: 'nyamazone',
      inStock: true,
      seller: 'Nyamazone'
    },
    {
      id: 'free-range-chicken',
      name: 'Free Range Chicken',
      description: 'Organic free-range whole chicken',
      price: 22.50,
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=400&fit=crop',
      rating: 4.7,
      reviews: 112,
      badge: 'Organic',
      category: 'nyamazone',
      inStock: true,
      seller: 'Nyamazone'
    }
  ];

  const availableBadges = ['Bestseller', 'New', 'Premium', 'Organic', 'Traditional', 'Handmade', 'Fair Trade', 'Eco-Friendly'];

  // Toggle functions
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleBadge = (badge) => {
    setSelectedBadges(prev => 
      prev.includes(badge) 
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  // Filter and sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);
      
      // Price filter
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      // Rating filter
      const matchesRating = product.rating >= selectedRating;
      
      // Badge filter
      const matchesBadge = selectedBadges.length === 0 || 
        selectedBadges.includes(product.badge);
      
      // Stock filter
      const matchesStock = !inStockOnly || product.inStock;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesBadge && matchesStock;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id.localeCompare(a.id);
        case 'bestselling':
          return b.reviews - a.reviews;
        default: // relevance
          return 0;
      }
    });

    return filtered;
  }, [allProducts, searchTerm, selectedCategories, priceRange, selectedRating, selectedBadges, inStockOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 1000 });
    setSelectedRating(0);
    setSelectedBadges([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const activeFiltersCount = 
    selectedCategories.length + 
    selectedBadges.length + 
    (selectedRating > 0 ? 1 : 0) + 
    (inStockOnly ? 1 : 0) +
    (priceRange.min > 0 || priceRange.max < 1000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soko-cream/10 to-soko-light-blue/10">
      <Header />
      
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Page Header - Visual Impact */}
        <div className="mb-6 bg-gradient-to-r from-soko-dark-teal to-soko-bright-cyan rounded-xl p-8 text-white shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Discover Authentic African Treasures
          </h1>
          <p className="text-lg text-soko-cream/90">
            {allProducts.length}+ handcrafted items from verified artisans across Africa
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border-2 border-soko-light-blue/30">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search with Clear Button */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-soko-dark-teal" size={20} />
                <input
                  type="text"
                  placeholder="Search products, categories, artisans, or materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-soko-light-blue/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-soko-bright-cyan focus:border-soko-bright-cyan text-soko-dark-teal placeholder-soko-dark-brown/40 text-base transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-soko-dark-brown/40 hover:text-soko-orange-red transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              {/* Quick Search Suggestions */}
              {searchTerm === '' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-sm text-soko-dark-brown/60">Popular:</span>
                  {['Ankara Fabric', 'Shea Butter', 'Coffee Beans', 'Handwoven Baskets'].map(term => (
                    <button
                      key={term}
                      onClick={() => setSearchTerm(term)}
                      className="text-sm px-3 py-1 bg-soko-cream/50 text-soko-dark-teal rounded-full hover:bg-soko-orange/20 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown with Icon */}
              <div className="flex items-center gap-2 bg-soko-cream/30 px-4 py-3 rounded-lg">
                <TrendingUp className="text-soko-dark-teal" size={18} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-0 focus:outline-none text-soko-dark-teal font-medium cursor-pointer"
                >
                  {SEARCH_FILTERS.SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden lg:flex border-2 border-soko-light-blue/40 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-soko-dark-teal text-white' 
                      : 'bg-white text-soko-dark-teal hover:bg-soko-cream/30'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all ${
                    viewMode === 'list' 
                      ? 'bg-soko-dark-teal text-white' 
                      : 'bg-white text-soko-dark-teal hover:bg-soko-cream/30'
                  }`}
                  aria-label="List view"
                >
                  <List size={20} />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-soko-dark-teal text-white rounded-lg hover:bg-soko-bright-cyan transition-colors"
              >
                <Filter size={18} />
                <span className="font-medium">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-soko-orange text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Results Summary Bar */}
          <div className="mt-4 flex items-center justify-between border-t border-soko-light-blue/20 pt-4">
            <p className="text-sm text-soko-dark-brown">
              Showing <span className="font-bold text-soko-dark-teal">{paginatedProducts.length}</span> of{' '}
              <span className="font-bold text-soko-dark-teal">{filteredAndSortedProducts.length}</span> products
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-soko-orange-red hover:text-soko-dark-red underline flex items-center gap-1"
              >
                <X size={14} />
                Clear all filters ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Compact */}
          <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} w-full lg:w-72 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-lg border-2 border-soko-light-blue/30 overflow-hidden sticky top-4">
              {/* Filter Header - Enhanced */}
              <div className="bg-gradient-to-r from-soko-dark-teal to-soko-bright-cyan p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="text-white" size={20} />
                  <h2 className="text-lg font-bold text-white">Filter Products</h2>
                  {activeFiltersCount > 0 && (
                    <span className="bg-soko-orange text-white text-xs px-2 py-1 rounded-full font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-white hover:text-soko-orange transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Quick Filter Badges */}
              <div className="p-4 border-b border-soko-light-blue/20">
                <h3 className="text-xs font-semibold text-soko-dark-brown/60 uppercase tracking-wider mb-3">Quick Filters</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => {
                      setSelectedBadges(['New']);
                      setSortBy('newest');
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-soko-bright-cyan/20 to-soko-bright-cyan/10 text-soko-dark-teal rounded-full text-sm font-medium hover:from-soko-bright-cyan/30 hover:to-soko-bright-cyan/20 transition-all flex items-center gap-1.5 border border-soko-bright-cyan/20"
                  >
                    <Clock size={14} className="text-soko-bright-cyan" />
                    New Arrivals
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedRating(4);
                      setSortBy('rating');
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-soko-orange/20 to-soko-orange/10 text-soko-dark-teal rounded-full text-sm font-medium hover:from-soko-orange/30 hover:to-soko-orange/20 transition-all flex items-center gap-1.5 border border-soko-orange/20"
                  >
                    <Award size={14} className="text-soko-orange" />
                    Top Rated
                  </button>
                  <button 
                    onClick={() => {
                      setPriceRange({ min: 0, max: 50 });
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-soko-dark-red/20 to-soko-dark-red/10 text-soko-dark-teal rounded-full text-sm font-medium hover:from-soko-dark-red/30 hover:to-soko-dark-red/20 transition-all flex items-center gap-1.5 border border-soko-dark-red/20"
                  >
                    <Truck size={14} className="text-soko-dark-red" />
                    Under $50
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {/* Categories Filter */}
                <div className="border-b border-soko-light-blue/20">
                  <button
                    onClick={() => toggleSection('categories')}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-soko-cream/20 transition-colors"
                  >
                    <span className="text-base font-semibold text-soko-dark-teal">Category</span>
                    {expandedSections.categories ? (
                      <ChevronUp className="text-soko-dark-brown/40" size={16} />
                    ) : (
                      <ChevronDown className="text-soko-dark-brown/40" size={16} />
                    )}
                  </button>
                  {expandedSections.categories && (
                    <div className="px-4 pb-4 space-y-2">
                      {PRODUCT_CATEGORIES.map(category => {
                        const count = allProducts.filter(p => p.category === category.id).length;
                        const isSelected = selectedCategories.includes(category.id);
                        return (
                          <label 
                            key={category.id} 
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                              isSelected ? 'bg-soko-orange/10 border border-soko-orange/30' : 'hover:bg-soko-cream/20'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCategory(category.id)}
                              className="w-4 h-4 text-soko-orange-red border-soko-light-blue rounded focus:ring-soko-bright-cyan focus:ring-offset-0 focus:ring-2"
                            />
                            <div className="flex-1">
                              <span className={`text-sm font-medium ${
                                isSelected ? 'text-soko-dark-teal' : 'text-soko-dark-brown'
                              }`}>
                                {category.icon} {category.name}
                              </span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-soko-orange text-white' : 'bg-soko-cream text-soko-dark-brown'
                            }`}>
                              {count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="border-b border-soko-light-blue/20">
                  <button
                    onClick={() => toggleSection('price')}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-soko-cream/20 transition-colors"
                  >
                    <span className="text-base font-semibold text-soko-dark-teal">Price Range</span>
                    {expandedSections.price ? (
                      <ChevronUp className="text-soko-dark-brown/40" size={16} />
                    ) : (
                      <ChevronDown className="text-soko-dark-brown/40" size={16} />
                    )}
                  </button>
                  {expandedSections.price && (
                    <div className="px-4 pb-4 space-y-4">
                      {/* Price Range Slider */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-soko-dark-brown font-medium">${priceRange.min}</span>
                          <span className="text-soko-dark-brown font-medium">${priceRange.max}</span>
                        </div>
                        <div className="relative h-2 bg-soko-cream rounded-full">
                          <div 
                            className="absolute h-full bg-gradient-to-r from-soko-orange to-soko-orange-red rounded-full"
                            style={{
                              left: `${(priceRange.min / 1000) * 100}%`,
                              width: `${((priceRange.max - priceRange.min) / 1000) * 100}%`
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.min(Number(e.target.value), prev.max - 10) }))}
                            className="flex-1 accent-soko-orange"
                          />
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(Number(e.target.value), prev.min + 10) }))}
                            className="flex-1 accent-soko-orange"
                          />
                        </div>
                      </div>
                      {/* Quick Price Options */}
                      <div className="flex flex-wrap gap-2">
                        {SEARCH_FILTERS.PRICE_RANGES.map(range => (
                          <button
                            key={range.label}
                            onClick={() => setPriceRange({ min: range.min, max: range.max || 1000 })}
                            className="text-xs px-2 py-1 bg-soko-cream/50 text-soko-dark-teal rounded hover:bg-soko-orange/20 transition-colors"
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rating Filter */}
                <div className="border-b border-soko-light-blue/20">
                  <button
                    onClick={() => toggleSection('rating')}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-soko-cream/20 transition-colors"
                  >
                    <span className="text-base font-semibold text-soko-dark-teal">Customer Rating</span>
                    {expandedSections.rating ? (
                      <ChevronUp className="text-soko-dark-brown/40" size={16} />
                    ) : (
                      <ChevronDown className="text-soko-dark-brown/40" size={16} />
                    )}
                  </button>
                  {expandedSections.rating && (
                    <div className="px-4 pb-4 space-y-3">
                      {[4, 3, 2, 1].map(rating => {
                        const isSelected = selectedRating === rating;
                        return (
                          <label 
                            key={rating} 
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                              isSelected ? 'bg-soko-orange/10 border border-soko-orange/30' : 'hover:bg-soko-cream/20'
                            }`}
                          >
                            <input
                              type="radio"
                              name="rating"
                              checked={isSelected}
                              onChange={() => setSelectedRating(rating)}
                              className="w-4 h-4 text-soko-orange-red border-soko-light-blue focus:ring-soko-bright-cyan focus:ring-offset-0 focus:ring-2"
                            />
                            <div className="flex items-center gap-2 flex-1">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < rating ? "text-soko-orange fill-current" : "text-gray-200"}
                                  />
                                ))}
                              </div>
                              <span className={`text-sm ${
                                isSelected ? 'text-soko-dark-teal font-medium' : 'text-soko-dark-brown'
                              }`}>
                                {rating}.0 & up
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Badges Filter */}
                <div className="border-b border-soko-light-blue/20">
                  <button
                    onClick={() => toggleSection('badges')}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-soko-cream/20 transition-colors"
                  >
                    <span className="text-base font-semibold text-soko-dark-teal">Special Offers</span>
                    {expandedSections.badges ? (
                      <ChevronUp className="text-soko-dark-brown/40" size={16} />
                    ) : (
                      <ChevronDown className="text-soko-dark-brown/40" size={16} />
                    )}
                  </button>
                  {expandedSections.badges && (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-2">
                        {availableBadges.map(badge => {
                          const isSelected = selectedBadges.includes(badge);
                          const badgeColors = {
                            'Bestseller': 'bg-soko-orange/20 text-soko-orange hover:bg-soko-orange/30',
                            'New': 'bg-soko-bright-cyan/20 text-soko-bright-cyan hover:bg-soko-bright-cyan/30',
                            'Premium': 'bg-soko-dark-red/20 text-soko-dark-red hover:bg-soko-dark-red/30',
                            'Organic': 'bg-green-100 text-green-700 hover:bg-green-200',
                            'Traditional': 'bg-soko-dark-teal/20 text-soko-dark-teal hover:bg-soko-dark-teal/30',
                            'Handmade': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
                            'Fair Trade': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
                            'Eco-Friendly': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          };
                          return (
                            <button
                              key={badge}
                              onClick={() => toggleBadge(badge)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                isSelected 
                                  ? 'bg-soko-orange text-white shadow-md transform scale-105' 
                                  : (badgeColors[badge] || 'bg-soko-cream text-soko-dark-brown hover:bg-soko-cream/70')
                              }`}
                            >
                              {badge}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Filters */}
                <div className="px-4 py-4 space-y-3">
                  <h3 className="text-sm font-semibold text-soko-dark-teal mb-2">Shipping & Availability</h3>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-soko-cream/20 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 text-soko-orange-red border-soko-light-blue rounded focus:ring-soko-bright-cyan focus:ring-offset-0 focus:ring-2"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Shield className="text-soko-bright-cyan" size={16} />
                      <span className="text-sm text-soko-dark-brown">Ready to ship</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-soko-cream/20 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-soko-orange-red border-soko-light-blue rounded focus:ring-soko-bright-cyan focus:ring-offset-0 focus:ring-2"
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Truck className="text-soko-bright-cyan" size={16} />
                      <span className="text-sm text-soko-dark-brown">Free shipping</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters Tags - Enhanced */}
            {activeFiltersCount > 0 && (
              <div className="mb-6">
                <div className="bg-soko-cream/30 rounded-lg p-4 border border-soko-light-blue/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-soko-dark-teal flex items-center gap-2">
                      <Filter size={16} />
                      Active Filters ({activeFiltersCount})
                    </h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-soko-orange-red hover:text-soko-dark-red underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(catId => {
                      const cat = PRODUCT_CATEGORIES.find(c => c.id === catId);
                      return (
                        <span
                          key={catId}
                          className="inline-flex items-center gap-1.5 bg-white text-soko-dark-teal px-3 py-1.5 rounded-full text-sm border border-soko-orange/30 shadow-sm"
                        >
                          {cat?.icon} {cat?.name}
                          <button onClick={() => toggleCategory(catId)} className="hover:text-soko-orange-red ml-1">
                            <X size={14} />
                          </button>
                        </span>
                      );
                    })}
                    {selectedBadges.map(badge => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1.5 bg-white text-soko-dark-teal px-3 py-1.5 rounded-full text-sm border border-soko-bright-cyan/30 shadow-sm"
                      >
                        <Sparkles size={12} className="text-soko-orange" />
                        {badge}
                        <button onClick={() => toggleBadge(badge)} className="hover:text-soko-orange-red ml-1">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    {selectedRating > 0 && (
                      <span className="inline-flex items-center gap-1.5 bg-white text-soko-dark-teal px-3 py-1.5 rounded-full text-sm border border-soko-orange/30 shadow-sm">
                        <Star size={12} className="text-soko-orange fill-current" />
                        {selectedRating}+ Stars
                        <button onClick={() => setSelectedRating(0)} className="hover:text-soko-orange-red ml-1">
                          <X size={14} />
                        </button>
                      </span>
                    )}
                    {(priceRange.min > 0 || priceRange.max < 1000) && (
                      <span className="inline-flex items-center gap-1.5 bg-white text-soko-dark-teal px-3 py-1.5 rounded-full text-sm border border-soko-dark-red/30 shadow-sm">
                        <DollarSign size={12} className="text-soko-dark-red" />
                        ${priceRange.min} - ${priceRange.max}
                        <button onClick={() => setPriceRange({ min: 0, max: 1000 })} className="hover:text-soko-orange-red ml-1">
                          <X size={14} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}


            {/* Products Grid - Large Visual Cards */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 mb-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showWishlist={true}
                  showAddToCart={false}
                />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm text-soko-dark-teal hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ←
                    </button>
                    
                    {/* Show first page, current page area, and last page */}
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => setCurrentPage(1)}
                          className="px-3 py-2 text-sm text-soko-dark-teal hover:bg-gray-100 rounded transition-colors"
                        >
                          1
                        </button>
                        {currentPage > 4 && <span className="px-2 text-gray-400">...</span>}
                      </>
                    )}
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === currentPage ||
                        pageNum === currentPage - 1 ||
                        pageNum === currentPage + 1 ||
                        (currentPage <= 3 && pageNum <= 5) ||
                        (currentPage >= totalPages - 2 && pageNum >= totalPages - 4)
                      ) {
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm rounded transition-colors ${
                              currentPage === pageNum
                                ? 'bg-soko-dark-teal text-white'
                                : 'text-soko-dark-teal hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                      return null;
                    })}
                    
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="px-2 text-gray-400">...</span>}
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="px-3 py-2 text-sm text-soko-dark-teal hover:bg-gray-100 rounded transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm text-soko-dark-teal hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl shadow-lg border-2 border-soko-light-blue/30">
                <div className="text-soko-dark-brown/30 mb-6">
                  <Search size={64} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-soko-dark-teal mb-3">No products found</h3>
                <p className="text-base text-soko-dark-brown/70 mb-8 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-soko-orange via-soko-orange-red to-soko-dark-red hover:from-soko-dark-red hover:to-soko-orange text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}


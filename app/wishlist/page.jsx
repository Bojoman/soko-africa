"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  X, 
  Eye,
  Filter,
  Grid,
  List,
  SortDesc,
  Share2,
  Download
} from 'lucide-react';

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'name'
  
  // Demo wishlist items
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Authentic Maasai Beaded Jewelry Set",
      price: 89.99,
      originalPrice: 110.00,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop",
      category: "Jewelry",
      rating: 4.9,
      reviews: 127,
      inStock: true,
      seller: "Maasai Craft Collective",
      dateAdded: "2024-03-15",
      discount: 18
    },
    {
      id: 2,
      name: "Premium Ghanaian Cocoa Powder - Organic",
      price: 32.50,
      originalPrice: 38.99,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop",
      category: "Food & Beverages",
      rating: 4.8,
      reviews: 89,
      inStock: true,
      seller: "Ghana Cocoa Farms",
      dateAdded: "2024-03-12",
      discount: 17
    },
    {
      id: 3,
      name: "Handwoven Basotho Blanket - Traditional",
      price: 125.00,
      originalPrice: 149.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop",
      category: "Home & Textiles",
      rating: 5.0,
      reviews: 203,
      inStock: false,
      seller: "Lesotho Weavers",
      dateAdded: "2024-03-10",
      discount: 17
    },
    {
      id: 4,
      name: "Ethiopian Berbere Spice Blend Set",
      price: 24.99,
      originalPrice: 29.99,
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop",
      category: "Spices & Seasonings",
      rating: 4.7,
      reviews: 156,
      inStock: true,
      seller: "Addis Spice Co.",
      dateAdded: "2024-03-08",
      discount: 17
    },
    {
      id: 5,
      name: "Moroccan Argan Oil - Pure & Certified",
      price: 45.00,
      originalPrice: 55.00,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop",
      category: "Beauty & Wellness",
      rating: 4.9,
      reviews: 342,
      inStock: true,
      seller: "Atlas Beauty",
      dateAdded: "2024-03-05",
      discount: 18
    },
    {
      id: 6,
      name: "Senegalese Djembe Drum - Handcrafted",
      price: 189.99,
      originalPrice: 220.00,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&auto=format&fit=crop",
      category: "Musical Instruments",
      rating: 4.8,
      reviews: 74,
      inStock: true,
      seller: "Dakar Drums",
      dateAdded: "2024-03-03",
      discount: 14
    }
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (item) => {
    // Simulate adding to cart
    console.log('Added to cart:', item);
    // In a real app, this would add to cart state/context
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  const totalSavings = wishlistItems.reduce((sum, item) => 
    sum + (item.originalPrice - item.price), 0
  );

  const WishlistItemCard = ({ item, isListView = false }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
      isListView ? 'flex items-center p-4' : 'p-4'
    }`}>
      {/* Image */}
      <div className={`relative ${isListView ? 'w-24 h-24 mr-4' : 'w-full h-48 mb-4'}`}>
        <Image
          src={item.image}
          alt={item.name}
          width={isListView ? 96 : 300}
          height={isListView ? 96 : 192}
          className={`rounded-lg object-cover ${isListView ? 'w-24 h-24' : 'w-full h-full'}`}
        />
        <button
          onClick={() => removeFromWishlist(item.id)}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-full shadow-sm transition-colors"
        >
          <Heart className="fill-current" size={16} />
        </button>
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Out of Stock</span>
          </div>
        )}
        {item.discount > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {item.discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className={isListView ? 'flex-1' : ''}>
        <div className={`${isListView ? 'flex justify-between items-start' : ''}`}>
          <div className={isListView ? 'flex-1 mr-4' : ''}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">
                {item.category}
              </span>
              {!isListView && (
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <h3 className={`font-semibold text-gray-900 mb-2 ${
              isListView ? 'text-lg' : 'text-base'
            }`}>
              {item.name}
            </h3>
            
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                <Star className="text-yellow-400 fill-current" size={14} />
                <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{item.reviews} reviews</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">by {item.seller}</p>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-orange-600">${item.price}</span>
              <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
            </div>
          </div>

          {/* Actions */}
          <div className={`space-y-2 ${isListView ? 'flex flex-col w-32' : ''}`}>
            <button
              onClick={() => addToCart(item)}
              disabled={!item.inStock}
              className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                isListView ? 'text-sm' : ''
              }`}
            >
              <ShoppingCart size={16} />
              <span>{item.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
            
            <div className="flex space-x-2">
              <button className="flex-1 border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600 py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                <Eye size={16} />
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600 py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <Heart className="fill-current" size={32} />
                  <h1 className="text-3xl lg:text-4xl font-bold">My Wishlist</h1>
                </div>
                <p className="text-lg opacity-90">
                  {wishlistItems.length} items saved • ${totalSavings.toFixed(2)} total savings available
                </p>
              </div>
              
              {wishlistItems.length > 0 && (
                <div className="flex space-x-2">
                  <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors">
                    <Download size={20} />
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Wishlist Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {wishlistItems.length > 0 ? (
              <>
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 font-medium">View:</span>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        <Grid size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        <List size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <SortDesc className="text-gray-600" size={16} />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name A-Z</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
                      Add All to Cart
                    </button>
                    <Link href="/categories">
                      <button className="border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600 font-semibold px-6 py-2 rounded-lg transition-colors">
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Items Grid/List */}
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                }>
                  {sortedItems.map((item) => (
                    <WishlistItemCard 
                      key={item.id} 
                      item={item} 
                      isListView={viewMode === 'list'} 
                    />
                  ))}
                </div>

                {/* Summary Card */}
                <div className="mt-12 bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Wishlist Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items</span>
                      <span className="font-semibold">{wishlistItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Value</span>
                      <span className="font-semibold">
                        ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Potential Savings</span>
                      <span className="font-semibold">${totalSavings.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">In Stock Items</span>
                        <span className="text-orange-600 font-semibold">
                          {wishlistItems.filter(item => item.inStock).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Empty Wishlist
              <div className="text-center py-16">
                <div className="bg-white rounded-xl shadow-sm p-12 max-w-md mx-auto">
                  <Heart className="text-gray-400 mx-auto mb-4" size={64} />
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
                  <p className="text-gray-600 mb-6">
                    Save your favorite products here to keep track of items you love
                  </p>
                  <Link href="/categories">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                      Discover Products
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Recently Viewed */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Recently Viewed</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "Kenyan Tea", price: 14.99, image: "https://images.unsplash.com/photo-1556909114-47530a45e3e4?q=80&w=200&auto=format&fit=crop" },
                { name: "Ankara Fabric", price: 28.50, image: "https://images.unsplash.com/photo-1594736797933-d0c6451faa9b?q=80&w=200&auto=format&fit=crop" },
                { name: "Shea Butter", price: 19.99, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=200&auto=format&fit=crop" },
                { name: "Coffee Beans", price: 22.75, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=200&auto=format&fit=crop" },
                { name: "Wooden Masks", price: 45.00, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=200&auto=format&fit=crop" },
                { name: "Baobab Oil", price: 32.99, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=200&auto=format&fit=crop" }
              ].map((product, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={150}
                    height={120}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <h4 className="font-medium text-sm text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-orange-600 font-semibold text-sm">${product.price}</p>
                  <button className="w-full mt-2 text-orange-600 border border-orange-600 hover:bg-orange-600 hover:text-white text-xs py-1.5 rounded transition-colors">
                    ❤ Add to Wishlist
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
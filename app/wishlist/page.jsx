"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Share2,
  Star,
  ArrowRight
} from 'lucide-react';

export default function WishlistPage() {
  const { 
    wishlist, 
    removeFromWishlist, 
    clearWishlist, 
    moveToCart,
    isEmpty 
  } = useWishlist();
  
  const { addToCart } = useCart();
  const [isMovingToCart, setIsMovingToCart] = useState({});

  const handleMoveToCart = async (product) => {
    setIsMovingToCart(prev => ({ ...prev, [product.id]: true }));
    
    // Simulate API call
    setTimeout(() => {
      addToCart(product, 1);
      removeFromWishlist(product.id);
      setIsMovingToCart(prev => ({ ...prev, [product.id]: false }));
    }, 1000);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Soko Africa Wishlist',
        text: 'Check out my wishlist on Soko Africa!',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Wishlist link copied to clipboard!');
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
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

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart size={64} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist and they'll appear here. Start exploring to find products you'd like to add!
            </p>
            <Link href="/categories">
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                Start Shopping
              </button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleShareWishlist}
                className="flex items-center space-x-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button
                onClick={clearWishlist}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <Link href={`/products/${item.id}`} className="block">
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Product Badge */}
                  {item.badge && (
                    <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded font-medium">
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveFromWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={16} className="text-red-500 fill-current" />
                  </button>
                </div>
              </Link>
              
              <div className="p-4">
                {/* Product Name */}
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                
                {/* Rating and Reviews */}
                {item.rating && (
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {renderStars(item.rating)}
                    </div>
                    {item.reviews && (
                      <span className="text-sm text-gray-600 ml-2">
                        ({item.reviews})
                      </span>
                    )}
                  </div>
                )}
                
                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    disabled={isMovingToCart[item.id]}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    {isMovingToCart[item.id] ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShoppingCart size={16} className="mr-2" />
                        Move to Cart
                      </>
                    )}
                  </button>
                  
                  <Link href={`/products/${item.id}`}>
                    <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center">
                      View Details
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Move All to Cart */}
        {wishlist.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                wishlist.forEach(item => {
                  if (!isMovingToCart[item.id]) {
                    handleMoveToCart(item);
                  }
                });
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center"
            >
              <ShoppingCart size={20} className="mr-2" />
              Move All to Cart
            </button>
          </div>
        )}

        {/* Recommended Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sample recommended products */}
            {[
              {
                id: 'recommended-1',
                name: 'Ethiopian Coffee Beans',
                price: '$24.99',
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
                rating: 4.7,
                reviews: 234,
                badge: 'Bestseller'
              },
              {
                id: 'recommended-2',
                name: 'Handwoven Kente Scarf',
                price: '$38.50',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format',
                rating: 4.8,
                reviews: 124,
                badge: 'Heritage'
              },
              {
                id: 'recommended-3',
                name: 'Raw Shea Butter',
                price: '$32.00',
                image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=300&h=300&fit=crop&auto=format',
                rating: 4.6,
                reviews: 201,
                badge: 'Natural'
              },
              {
                id: 'recommended-4',
                name: 'Maasai Hand-woven Basket',
                price: '$35.99',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
                rating: 4.8,
                reviews: 67,
                badge: 'Handmade'
              }
            ].map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showWishlist={true}
                showAddToCart={true}
              />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

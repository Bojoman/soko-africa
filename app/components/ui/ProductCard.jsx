"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Plus, ArrowRight } from 'lucide-react';

const ProductCard = ({ 
  product,
  className = "text-orange-600",
  showWishlist = true,
  showAddToCart = true,
  imageSize = { width: 300, height: 400 } 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Add toast notification here
      console.log(`Added ${product.name} to cart`);
    }, 1000);
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

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}>
      <Link href={`/products/${product.id}`} className="block">
        {/* Image Section - 70% of card height */}
        <div className="relative overflow-hidden h-64 sm:h-72 md:h-80 lg:h-96">
          <Image
            src={product.image}
            alt={product.name}
            width={imageSize.width}
            height={imageSize.height}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Product Badge - Popular Now */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-white text-black text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              {product.badge}
            </span>
          )}
          
          {/* Discount Badge */}
          {product.originalPrice && (
            <span className="absolute top-3 right-14 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {Math.round(((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', ''))) * 100)}% OFF
            </span>
          )}
          
          {/* Wishlist Button */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={16}
                className={`${
                  isWishlisted 
                    ? "text-red-500 fill-current" 
                    : "text-gray-600"
                }`}
              />
            </button>
          )}
        </div>
        
        {/* Content Section - 30% of card height */}
        <div className="p-4 space-y-3">
          {/* Product Type Indicator */}
          <div className="flex items-center text-xs text-gray-500">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            <span>African Handicraft</span>
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Creator/Brand */}
          {product.creator && (
            <p className="text-xs text-gray-600">
              By {product.creator}
            </p>
          )}
          
          {/* Price and Rating Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-400 fill-current" />
                <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                {product.reviews && (
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                )}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Add to Cart Button */}
            {showAddToCart && (
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center border border-black"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus size={14} className="mr-1" />
                    Add to cart
                  </>
                )}
              </button>
            )}
            
            {/* More like this link */}
            <button className="flex items-center text-xs text-gray-600 hover:text-orange-600 transition-colors">
              More like this
              <ArrowRight size={12} className="ml-1" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

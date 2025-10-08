"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ArrowRight } from 'lucide-react';

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
            ? "text-soko-orange fill-current" 
            : "text-soko-cream"
        }`}
      />
    ));
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-soko-dark-red/20 transition-all duration-300 group border-2 border-transparent hover:border-soko-dark-red/30 ${className}`}>
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
          <div className="absolute inset-0 bg-gradient-to-t from-soko-dark-red/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Product Badge - Popular Now */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-soko-dark-red to-soko-orange-red text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
              {product.badge}
            </span>
          )}
          
          {/* Discount Badge */}
          {product.originalPrice && (
            <span className="absolute top-3 right-14 bg-soko-orange text-soko-dark-red text-xs px-2.5 py-1 rounded-full font-bold shadow-md">
              {Math.round(((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', ''))) * 100)}% OFF
            </span>
          )}
          
          {/* Wishlist Button */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${
                isWishlisted
                  ? "bg-soko-dark-red hover:bg-soko-orange-red"
                  : "bg-white hover:bg-soko-cream"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={16}
                className={`${
                  isWishlisted 
                    ? "text-white fill-current" 
                    : "text-soko-dark-red"
                }`}
              />
            </button>
          )}
        </div>
        
        {/* Content Section - 30% of card height */}
        <div className="p-4 space-y-3 bg-gradient-to-b from-white to-soko-cream/10">
          {/* Product Type Indicator */}
          <div className="flex items-center text-xs text-soko-dark-brown font-medium">
            <span className="w-2 h-2 bg-soko-dark-red rounded-full mr-2 shadow-sm"></span>
            <span>African Handicraft</span>
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-soko-dark-teal text-sm line-clamp-2 group-hover:text-soko-dark-red transition-colors">
            {product.name}
          </h3>
          
          {/* Creator/Brand */}
          {product.creator && (
            <p className="text-xs text-soko-dark-brown/70">
              By {product.creator}
            </p>
          )}
          
          {/* Price and Rating Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-soko-dark-red">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-soko-dark-brown/50 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-soko-orange fill-current" />
                <span className="text-xs font-medium text-soko-dark-teal">{product.rating}</span>
                {product.reviews && (
                  <span className="text-xs text-soko-dark-brown/60">({product.reviews})</span>
                )}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-white hover:bg-soko-dark-red disabled:bg-gray-100 text-soko-dark-red hover:text-white disabled:text-gray-400 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-between border-2 border-soko-dark-red hover:border-soko-dark-red disabled:border-gray-300 group"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-soko-dark-red border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                <>
                  <span>Add to cart</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ 
  product,
  className = "text-orange-600",
  showWishlist = true,
  showAddToCart = true,
  imageSize = { width: 300, height: 192 } 
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
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group ${className}`}>
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={imageSize.width}
            height={imageSize.height}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Product Badge */}
          {product.badge && (
            <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded font-medium">
              {product.badge}
            </span>
          )}
          
          {/* Discount Badge */}
          {product.originalPrice && (
            <span className="absolute top-2 right-12 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
              {Math.round(((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', ''))) * 100)}% OFF
            </span>
          )}
          
          {/* Wishlist Button */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
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
        
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating and Reviews */}
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              {product.reviews && (
                <span className="text-sm text-gray-600 ml-2">
                  ({product.reviews})
                </span>
              )}
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-4 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShoppingCart size={16} className="mr-2" />
                  Add to Cart
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

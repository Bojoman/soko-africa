"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ArrowRight, Package } from 'lucide-react';

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

  const getPriceValue = (price) => {
    if (typeof price === 'number') return price;
    return parseFloat(price.replace('$', ''));
  };

  const calculateDiscount = () => {
    if (!product.originalPrice) return 0;
    const original = getPriceValue(product.originalPrice);
    const current = getPriceValue(product.price);
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:shadow-soko-orange/20 transition-all duration-300 group transform hover:-translate-y-1 ${className}`}>
      <Link href={`/products/${product.id}`} className="block">
        {/* Image Section - Larger for visual impact */}
        <div className="relative overflow-hidden h-72 sm:h-80 md:h-96">
          <Image
            src={product.image}
            alt={product.name}
            width={imageSize.width}
            height={imageSize.height}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Product Badge - Eye-catching */}
          {product.badge && (
            <span className="absolute top-4 left-4 bg-gradient-to-r from-soko-orange via-soko-orange-red to-soko-dark-red text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg">
              {product.badge}
            </span>
          )}
          
          {/* Discount Badge - Show percentage */}
          {product.originalPrice && calculateDiscount() > 0 && (
            <span className="absolute top-4 right-4 bg-soko-dark-red text-white text-sm px-3 py-1.5 rounded-full font-bold shadow-lg">
              {calculateDiscount()}% OFF
            </span>
          )}
          
          {/* Wishlist Button - Always visible */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className={`absolute bottom-4 right-4 p-2.5 rounded-full shadow-lg transition-all duration-300 ${
                isWishlisted
                  ? "bg-soko-dark-red hover:bg-soko-orange-red"
                  : "bg-white/90 hover:bg-white"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={20}
                className={`${
                  isWishlisted 
                    ? "text-white fill-current" 
                    : "text-soko-dark-red"
                }`}
              />
            </button>
          )}
        </div>
        
        {/* Content Section - Rich information */}
        <div className="p-5 bg-gradient-to-b from-white to-soko-cream/20">
          {/* Product Name */}
          <h3 className="font-bold text-lg text-soko-dark-teal line-clamp-2 mb-2 group-hover:text-soko-orange-red transition-colors">
            {product.name}
          </h3>
          
          {/* Seller/Creator Name */}
          {(product.seller || product.creator) && (
            <p className="text-sm text-soko-dark-brown/70 mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-soko-orange rounded-full mr-2"></span>
              {product.seller || product.creator}
            </p>
          )}
          
          {/* Price and Rating Row */}
          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-soko-dark-red">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-soko-dark-brown/50 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm font-medium text-soko-dark-teal">{product.rating}</span>
                </div>
                {product.reviews && (
                  <span className="text-sm text-soko-dark-brown/60">{product.reviews} reviews</span>
                )}
              </div>
            )}
          </div>
          
          {/* Free Shipping Badge */}
          {product.price && getPriceValue(product.price) > 50 && (
            <div className="mt-3 text-xs text-soko-bright-cyan font-medium flex items-center">
              <Package size={14} className="mr-1" />
              Free shipping
            </div>
          )}
          
          {/* Quick View or Shop Details - Etsy Style */}
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

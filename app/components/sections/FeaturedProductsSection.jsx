"use client";
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../ui/ProductCard';
import { TrendingUp, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedProductsSection = ({ 
  title = "Trending This Week",
  subtitle = "Most loved by our global community",
  className = "" 
}) => {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const featuredProducts = [
    {
      id: 1,
      name: 'Kenyan AA Coffee Beans',
      price: '$24.99',
      originalPrice: '$29.99',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 156,
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Maasai Beaded Jewelry Set',
      price: '$45.00',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      badge: 'Handmade'
    },
    {
      id: 3,
      name: 'Kente Cloth Scarf',
      price: '$38.50',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format',
      rating: 4.7,
      reviews: 234,
      badge: 'Fair Trade'
    },
    {
      id: 4,
      name: 'Shea Butter Skincare Set',
      price: '$32.00',
      image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=300&h=300&fit=crop&auto=format',
      rating: 4.6,
      reviews: 112,
      badge: 'Organic'
    },
    {
      id: 5,
      name: 'Ethiopian Honey',
      price: '$18.99',
      originalPrice: '$22.99',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 78,
      badge: 'Natural'
    },
    {
      id: 6,
      name: 'Ankara Print Dress',
      price: '$65.00',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format',
      rating: 4.8,
      reviews: 142,
      badge: 'New Arrival'
    },
    {
      id: 7,
      name: 'Wooden Safari Animals Set',
      price: '$28.50',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 95,
      badge: 'Eco-Friendly'
    },
    {
      id: 8,
      name: 'Moroccan Argan Oil',
      price: '$35.99',
      originalPrice: '$42.99',
      image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=300&h=300&fit=crop&auto=format',
      rating: 4.9,
      reviews: 203,
      badge: 'Premium'
    },
    {
      id: 9,
      name: 'Traditional Baskets',
      price: '$42.00',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 87,
      badge: 'Artisan'
    },
    {
      id: 10,
      name: 'African Print Cushions',
      price: '$29.99',
      originalPrice: '$39.99',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 124,
      badge: 'Sale'
    }
  ];

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => {
        checkScrollPosition();
      }, 300);
    }
  };

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftButton(container.scrollLeft > 0);
      setShowRightButton(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  return (
    <section className={`relative py-12 sm:py-16 bg-gradient-to-br from-soko-cream/30 to-white border-t border-soko-light-blue/40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-soko-orange via-soko-orange-red to-soko-dark-red p-2.5 rounded-xl shadow-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-soko-dark-teal" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-soko-dark-teal">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-soko-dark-brown/80 mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>
          
          {/* Navigation Buttons - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!showLeftButton}
              className={`p-2.5 rounded-full border-2 transition-all duration-300 ${
                showLeftButton
                  ? 'border-soko-bright-cyan bg-white text-soko-bright-cyan hover:bg-soko-bright-cyan hover:text-white shadow-md'
                  : 'border-soko-cream bg-soko-cream/50 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRightButton}
              className={`p-2.5 rounded-full border-2 transition-all duration-300 ${
                showRightButton
                  ? 'border-soko-bright-cyan bg-white text-soko-bright-cyan hover:bg-soko-bright-cyan hover:text-white shadow-md'
                  : 'border-soko-cream bg-soko-cream/50 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px]">
                <ProductCard
                  product={product}
                  showWishlist={true}
                  showAddToCart={true}
                />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="flex sm:hidden items-center justify-center gap-3 mt-4">
            <button
              onClick={() => scroll('left')}
              disabled={!showLeftButton}
              className={`p-2 rounded-full border-2 transition-all duration-300 shadow-sm ${
                showLeftButton
                  ? 'border-soko-bright-cyan text-soko-bright-cyan bg-white'
                  : 'border-soko-cream text-gray-400 bg-soko-cream/30'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!showRightButton}
              className={`p-2 rounded-full border-2 transition-all duration-300 shadow-sm ${
                showRightButton
                  ? 'border-soko-bright-cyan text-soko-bright-cyan bg-white'
                  : 'border-soko-cream text-gray-400 bg-soko-cream/30'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/products?filter=trending"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-soko-orange via-soko-orange-red to-soko-dark-red text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:from-soko-dark-red hover:to-soko-orange transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-soko-orange/50"
          >
            View All Trending Products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Bottom CTA Section */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-br from-soko-dark-teal via-soko-dark-teal to-soko-bright-cyan rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white text-center shadow-xl border border-soko-bright-cyan/20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="fill-soko-orange text-soko-orange w-5 h-5 sm:w-6 sm:h-6 drop-shadow-lg" />
            <Star className="fill-soko-orange text-soko-orange w-5 h-5 sm:w-6 sm:h-6 drop-shadow-lg" />
            <Star className="fill-soko-orange text-soko-orange w-5 h-5 sm:w-6 sm:h-6 drop-shadow-lg" />
            <Star className="fill-soko-orange text-soko-orange w-5 h-5 sm:w-6 sm:h-6 drop-shadow-lg" />
            <Star className="fill-soko-orange text-soko-orange w-5 h-5 sm:w-6 sm:h-6 drop-shadow-lg" />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-white">
            Join 50,000+ Happy Customers Worldwide
          </h3>
          <p className="text-soko-cream/90 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Experience authentic African products with trusted quality and fast global shipping
          </p>
          <Link href="/products">
            <button className="bg-gradient-to-r from-soko-orange to-soko-orange-red text-grey-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-white hover:to-soko-cream hover:text-soko-dark-teal transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-soko-orange/50 hover:border-white">
              Explore All Products
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProductsSection;

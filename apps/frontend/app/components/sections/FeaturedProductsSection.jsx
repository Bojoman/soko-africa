"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../ui/ProductCard';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TrendingUp, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedProductsSection = ({ 
  title = "Trending This Week",
  subtitle = "Most loved by our global community",
  className = "" 
}) => {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Same listing as hero (limit 12 covers hero's 10) — one network shape,
        // shared CDN/BFF cache via /api/products revalidate.
        const res = await fetch(
          '/api/products?limit=12&sortBy=createdAt&sortOrder=desc'
        );
        const data = await res.json();
        if (!cancelled) setFeaturedProducts(data?.products || []);
      } catch {
        if (!cancelled) setFeaturedProducts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    <section className={`relative py-12 sm:py-16 bg-soko-cream/20 border-t border-soko-light-blue/40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-soko-orange p-2.5 rounded-xl">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
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
              <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px]">
                <ProductCard
                  product={product}
                  showWishlist={true}
                  showAddToCart={false}
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
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-11 px-6 gap-2 bg-soko-orange hover:bg-soko-orange-red text-white text-base'
            )}
          >
            View All Trending Products
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-12 sm:mt-16 bg-soko-dark-teal rounded-2xl p-6 sm:p-8 md:p-12 text-white text-center">
          <div
            className="flex items-center justify-center gap-1 mb-4"
            aria-label="5 out of 5 stars"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="fill-soko-orange text-soko-orange w-5 h-5 sm:w-6 sm:h-6"
                aria-hidden="true"
              />
            ))}
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-white">
            Join 50,000+ Happy Customers Worldwide
          </h3>
          <p className="text-soko-cream/90 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Experience authentic African products with trusted quality and fast global shipping
          </p>
          <Link
            href="/products"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-11 px-6 bg-soko-orange hover:bg-soko-orange-red text-white text-base font-semibold'
            )}
          >
            Explore All Products
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

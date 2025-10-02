"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ 
  category, 
  className = "text-orange-600",
  showProductCount = true 
}) => {
  return (
    <Link href={category.href || `/categories/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group ${className}`}>
        {/* Image/Icon Section - 70% of card height */}
        <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 bg-gradient-to-br from-soko-cream to-soko-light-blue flex items-center justify-center">
          {/* Category Icon */}
          <div className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-300">
            {category.icon}
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category Badge */}
          <span className="absolute top-3 left-3 bg-white text-black text-xs px-3 py-1 rounded-full font-medium shadow-sm">
            Category
          </span>
        </div>
        
        {/* Content Section - 30% of card height */}
        <div className="p-4 space-y-2">
          {/* Category Name */}
          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-soko-dark-red transition-colors line-clamp-2">
            {category.name}
          </h3>
          
          {/* Product Count */}
          {showProductCount && category.count && (
            <p className="text-gray-600 text-xs">
              {category.count} products available
            </p>
          )}
          
          {/* Description (optional) */}
          {category.description && (
            <p className="text-gray-500 text-xs line-clamp-2">
              {category.description}
            </p>
          )}
          
          {/* Explore Link */}
          <div className="flex items-center text-xs text-soko-bright-cyan hover:text-soko-dark-red transition-colors pt-1">
            <span>Explore category</span>
            <ArrowRight size={12} className="ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

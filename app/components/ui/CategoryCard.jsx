"use client";
import React from 'react';
import Link from 'next/link';

const CategoryCard = ({ 
  category, 
  className = "text-orange-600",
  showProductCount = true 
}) => {
  return (
    <Link href={category.href || `/categories/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className={`bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}>
        {/* Icon */}
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {category.icon}
        </div>
        
        {/* Category Name */}
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {category.name}
        </h3>
        
        {/* Product Count */}
        {showProductCount && category.count && (
          <p className="text-gray-600 text-sm">
            {category.count} products
          </p>
        )}
        
        {/* Description (optional) */}
        {category.description && (
          <p className="text-gray-500 text-xs mt-2 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;

"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getIcon } from '../../lib/icons';
import { getCategoryImage } from '../../lib/category-assets';

const CategoryCard = ({ 
  category, 
  className = "",
  showProductCount = true,
  showSubcategories = false,
  variant = "default" // "default" or "large"
}) => {
  const fallbackImage = getCategoryImage(category.slug || category.id);
  const [imageSrc, setImageSrc] = useState(category.image || fallbackImage);

  useEffect(() => {
    setImageSrc(category.image || fallbackImage);
  }, [category.image, fallbackImage]);

  return (
    <Link href={category.href || `/categories/${category.slug || category.id}`}>
      <div className={`relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:border-soko-orange transition-colors cursor-pointer group ${className}`}>
        {/* Image Section with Overlay */}
        <div className={`relative overflow-hidden ${variant === 'large' ? 'h-80 sm:h-96' : 'h-64 sm:h-72'}`}>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={category.name}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              quality={85}
              unoptimized={imageSrc.includes('unsplash')}
              onError={() => setImageSrc(fallbackImage)}
            />
          ) : (
            <div className="w-full h-full bg-soko-dark-teal flex items-center justify-center">
              <div className="text-white/90 transition-transform duration-300">
                {(() => {
                  const Icon = typeof category.icon === 'string' ? getIcon(category.icon) : category.icon;
                  return Icon ? <Icon className="w-20 h-20" aria-hidden="true" /> : null;
                })()}
              </div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300"></div>
          
          {/* Trending Badge (optional) */}
          {category.trending && (
            <div className="absolute top-3 right-3 bg-soko-orange text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-sm flex items-center gap-1">
              <Sparkles size={12} />
              Trending
            </div>
          )}
          
          {/* Content Overlay */}
          <div className="absolute inset-0 p-5 flex flex-col justify-end">
            {/* Category Name */}
            <h3 className="font-bold text-white text-xl mb-2 group-hover:text-soko-orange transition-colors">
              {category.name}
            </h3>
            
            {/* Description */}
            {category.description && (
              <p className="text-white/90 text-sm line-clamp-2 mb-3">
                {category.description}
              </p>
            )}
            
            {/* Product Count & CTA */}
            <div className="flex items-center justify-between">
              {showProductCount && category.count && (
                <p className="text-white/80 text-xs font-medium">
                  {category.count}
                </p>
              )}
              
              <div className="flex items-center gap-1 text-white font-semibold text-sm group-hover:text-soko-orange transition-colors">
                <span>Shop Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Subcategories Section - Only for large variant */}
        {showSubcategories && variant === 'large' && category.subcategories && (
          <div className="p-6 bg-gray-50 border-t">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Popular in {category.name}:</h4>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.slice(0, 6).map((subcategory, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white text-gray-600 text-xs rounded-full border hover:border-soko-orange hover:text-soko-orange transition-colors"
                >
                  {subcategory}
                </span>
              ))}
              {category.subcategories.length > 6 && (
                <span className="px-3 py-1 text-soko-bright-cyan text-xs font-medium">
                  +{category.subcategories.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Bottom Accent Bar */}
        <div className="h-1 bg-soko-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>
    </Link>
  );
};

export default CategoryCard;

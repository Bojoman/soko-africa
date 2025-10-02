"use client";
import React from 'react';
import CategoryCard from '../ui/CategoryCard';
import { PRODUCT_CATEGORIES } from '../../lib/constants';
import { Sparkles } from 'lucide-react';

const CategoriesSection = ({ 
  title = "Discover African Treasures",
  subtitle = "Authentic products curated from artisans across the continent",
  className = "" 
}) => {
  // Use categories from constants with navigation links
  const categories = PRODUCT_CATEGORIES.map(category => ({
    ...category,
    slug: category.id,
    href: category.id === 'nyamazone' ? '/nyamazone' : `/categories/${category.id}`
  }));

  return (
    <section className={`relative py-20 bg-gradient-to-b from-white via-soko-cream/20 to-white overflow-hidden ${className}`}>
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-soko-orange/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-soko-bright-cyan/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-soko-orange/10 text-soko-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        {/* Category Grid - Amazon/Etsy inspired */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              category={category}
              showProductCount={true}
            />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Can't find what you're looking for? 
            <a href="/categories" className="text-soko-bright-cyan hover:text-soko-orange font-semibold ml-2 transition-colors">
              Browse all categories →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

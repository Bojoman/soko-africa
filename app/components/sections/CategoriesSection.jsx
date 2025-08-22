"use client";
import React from 'react';
import CategoryCard from '../ui/CategoryCard';
import { PRODUCT_CATEGORIES } from '../../lib/constants';

const CategoriesSection = ({ 
  title = "Shop by Category",
  className = "text-orange-600" 
}) => {
  // Use categories from constants with additional display properties
  const categories = PRODUCT_CATEGORIES.map(category => ({
    ...category,
    count: category.subcategories.length + '+ types',
    slug: category.id,
    href: category.id === 'nyamazone' ? '/nyamazone' : `/categories/${category.id}`
  }));

  return (
    <section className={`max-w-7xl mx-auto px-6 py-16 ${className}`}>
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            category={category}
            showProductCount={true}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;

"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SEASONAL_PICKS } from '../../lib/constants';

const SeasonalPicksSection = ({ 
  title = "Seasonal Picks & Featured Categories",
  className = "text-soko-bright-cyan" 
}) => {
  const seasonalCategories = [
    {
      id: 'seasonal-fruits',
      name: 'Seasonal Fruits',
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&h=400&fit=crop',
      badge: 'Fresh Harvest',
      description: 'Farm-fresh seasonal fruits from across Africa',
      subcategories: ['Avocados', 'Mangoes', 'Pears', 'Plums', 'Oranges', 'Pineapples']
    },
    {
      id: 'nuts-grains',
      name: 'Premium Nuts & Grains',
      image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&h=400&fit=crop',
      badge: 'Organic',
      description: 'Nutritious nuts and grains sourced from local farmers',
      subcategories: ['Macadamia', 'Cashews', 'Coffee Beans', 'Quinoa', 'Black Beans', 'Ndengu']
    },
    {
      id: 'fashion-textiles',
      name: 'African Fashion & Textiles',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&auto=format',
      badge: 'Handmade',
      description: 'Authentic African fashion and traditional textiles',
      subcategories: ['Ankara Fabrics', 'Kente Cloth', 'Traditional Dresses', 'Accessories', 'Jewelry', 'Bags']
    },
    {
      id: 'artisan-crafts',
      name: 'Handcrafted Artisan Goods',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=400&fit=crop',
      badge: 'Artisan Made',
      description: 'Unique handcrafted items by skilled African artisans',
      subcategories: ['Maasai Baskets', 'Wood Carvings', 'Pottery', 'Wall Art', 'Sculptures', 'Homeware']
    },
    {
      id: 'beauty-wellness',
      name: 'Natural Beauty & Wellness',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
      badge: 'Natural',
      description: 'Pure and natural beauty products from Africa',
      subcategories: ['Shea Butter', 'Essential Oils', 'Herbal Soaps', 'Skincare', 'Hair Care', 'Wellness']
    },
    {
      id: 'spices-herbs',
      name: 'Exotic Spices & Herbs',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop',
      badge: 'Premium',
      description: 'Aromatic spices and medicinal herbs from Africa',
      subcategories: ['Berbere', 'Harissa', 'Cardamom', 'Ginger', 'Turmeric', 'Medicinal Herbs']
    }
  ];

  return (
    <section className={`py-16 bg-gradient-to-br from-orange-50 to-green-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-soko-bright-cyan mb-4">{title}</h2>
          <p className="text-xl text-gray-600">
            Discover the best of Africa's seasonal harvest and trending products
          </p>
        </div>

        {/* Featured Seasonal Categories - Amazon/Etsy inspired */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seasonalCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-2">
              <Link href={`/categories/${category.id}`}>
                <div className="relative overflow-hidden">
                  {/* Larger Image Section */}
                  <div className="relative h-64 sm:h-80">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={85}
                      unoptimized={category.image.includes('unsplash')}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300"></div>
                    
                    {/* Badge */}
                    <span className="absolute top-4 left-4 bg-soko-orange text-white text-xs px-3 py-2 rounded-full font-bold shadow-lg">
                      {category.badge}
                    </span>
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h3 className="font-bold text-white text-2xl mb-2 group-hover:text-soko-orange transition-colors drop-shadow-lg">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm mb-4 drop-shadow line-clamp-2">
                        {category.description}
                      </p>
                      
                      <div className="flex items-center gap-1 text-white font-semibold text-sm group-hover:text-soko-orange transition-colors">
                        <span>Explore Category</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subcategories Section */}
                <div className="p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">Popular Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.slice(0, 4).map((subcategory, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-white text-gray-600 text-xs rounded-full border hover:border-soko-orange hover:text-soko-orange transition-colors"
                      >
                        {subcategory}
                      </span>
                    ))}
                    {category.subcategories.length > 4 && (
                      <span className="px-3 py-1 text-soko-bright-cyan text-xs font-medium">
                        +{category.subcategories.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              
              {/* Bottom Accent Bar */}
              <div className="h-1 bg-gradient-to-r from-soko-bright-cyan via-soko-orange to-soko-dark-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/categories">
            <button className="bg-soko-orange hover:bg-soko-dark-red text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors transform hover:scale-105 shadow-lg">
              Browse All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SeasonalPicksSection;

"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SEASONAL_PICKS } from '../../lib/constants';

const SeasonalPicksSection = ({ 
  title = "Seasonal Picks & Featured Products",
  className = "text-orange-600" 
}) => {
  const seasonalProducts = [
    {
      id: 'avocadoes',
      name: 'Fresh Kenyan Avocadoes',
      price: '$12.99',
      originalPrice: '$15.99',
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop',
      category: 'Agri & Natural Products',
      badge: 'Seasonal',
      description: 'Premium Hass avocadoes from Kenya\'s highlands'
    },
    {
      id: 'oranges',
      name: 'Sweet Valencia Oranges',
      price: '$8.99',
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop',
      category: 'Agri & Natural Products',
      badge: 'Fresh',
      description: 'Juicy oranges packed with vitamin C'
    },
    {
      id: 'ankara-textiles',
      name: 'Authentic Ankara Textiles',
      price: '$45.00',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format',
      category: 'Textile & Fashion',
      badge: 'Handmade',
      description: 'Vibrant traditional African prints'
    },
    {
      id: 'fashion-dress',
      name: 'Traditional African Dress',
      price: '$85.00',
      originalPrice: '$95.00',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&auto=format',
      category: 'Textile & Fashion',
      badge: 'Featured',
      description: 'Elegant traditional wear for special occasions'
    },
    {
      id: 'maasai-basket',
      name: 'Maasai Hand-woven Basket',
      price: '$35.99',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      category: 'Handcrafted Goods',
      badge: 'Artisan Made',
      description: 'Traditional baskets woven by Maasai artisans'
    },
    {
      id: 'honey',
      name: 'Wild African Honey',
      price: '$22.50',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
      category: 'Agri & Natural Products',
      badge: 'Organic',
      description: 'Pure honey harvested from African wildflowers'
    }
  ];

  return (
    <section className={`py-16 bg-gradient-to-br from-orange-50 to-green-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-orange-600 mb-4">{title}</h2>
          <p className="text-xl text-gray-600">
            Discover the best of Africa's seasonal harvest and trending products
          </p>
        </div>

        {/* Quick Category Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {SEASONAL_PICKS.map((pick, index) => (
            <Link
              key={index}
              href={`/categories?filter=${pick.category.toLowerCase()}`}
              className="bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-orange-600 font-medium"
            >
              {pick.category}
            </Link>
          ))}
        </div>
        
        {/* Featured Seasonal Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seasonalProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <Link href={`/products/${product.id}`}>
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  
                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {product.badge}
                  </span>
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                    {product.category}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/categories">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Explore All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SeasonalPicksSection;

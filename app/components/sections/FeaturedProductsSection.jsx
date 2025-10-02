"use client";
import React from 'react';
import Link from 'next/link';
import ProductCard from '../ui/ProductCard';
import { TrendingUp, Star } from 'lucide-react';

const FeaturedProductsSection = ({ 
  title = "Trending This Week",
  subtitle = "Most loved by our global community",
  className = "" 
}) => {
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
    }
  ];

  return (
    <section className={`relative py-20 bg-gradient-to-br from-gray-50 to-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-soko-bright-cyan/10 text-soko-bright-cyan px-4 py-2 rounded-full text-sm font-semibold mb-3">
              <TrendingUp size={16} />
              <span>Bestsellers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-lg">
              {subtitle}
            </p>
          </div>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-soko-bright-cyan hover:text-soko-orange font-bold transition-colors text-lg group"
          >
            <span>View All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showWishlist={true}
              showAddToCart={true}
            />
          ))}
        </div>
        
        {/* Bottom CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-soko-dark-teal to-soko-bright-cyan rounded-3xl p-8 md:p-12 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="fill-soko-orange text-soko-orange" size={24} />
            <Star className="fill-soko-orange text-soko-orange" size={24} />
            <Star className="fill-soko-orange text-soko-orange" size={24} />
            <Star className="fill-soko-orange text-soko-orange" size={24} />
            <Star className="fill-soko-orange text-soko-orange" size={24} />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Join 50,000+ Happy Customers Worldwide
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Experience authentic African products with trusted quality and fast global shipping
          </p>
          <Link href="/products">
            <button className="bg-white text-soko-dark-teal px-8 py-4 rounded-xl font-bold text-lg hover:bg-soko-orange hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explore All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;

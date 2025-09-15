"use client";
import React from 'react';
import Link from 'next/link';
import ProductCard from '../ui/ProductCard';

const FeaturedProductsSection = ({ 
  title = "Featured Products",
  className = "text-orange-600" 
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
    <section className={`bg-white py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-orange-600">{title}</h2>
          <Link 
            href="/products" 
            className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
          >
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showWishlist={true}
              showAddToCart={true}
            />
          ))}
        </div>
        
        {/* View More Button for Mobile */}
        <div className="text-center mt-8 lg:hidden">
          <Link href="/products">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;

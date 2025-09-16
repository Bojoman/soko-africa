"use client";
import React from 'react';
import Link from 'next/link';
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import { Home, Search, ArrowLeft, ShoppingBag, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              {/* Large 404 Text */}
              <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-gray-200 select-none">
                404
              </h1>
              
              {/* African Pattern Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center">
                    <Compass className="w-10 h-10 md:w-12 md:h-12 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Oops! Lost in the African Plains
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              The page you're looking for seems to have wandered off like a curious elephant. 
              Don't worry, we'll help you find your way back to the marketplace!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Link 
              href="/"
              className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Home size={20} />
              <span>Go Home</span>
            </Link>
            
            <Link 
              href="/categories"
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <ShoppingBag size={20} />
              <span>Shop Now</span>
            </Link>
            
            <Link 
              href="/search"
              className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Search size={20} />
              <span>Search</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Popular Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Explore Popular Categories
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'African Art', emoji: '🎨', href: '/categories?category=art' },
                { name: 'Textiles', emoji: '🧵', href: '/categories?category=textiles' },
                { name: 'Coffee & Tea', emoji: '☕', href: '/categories?category=beverages' },
                { name: 'Jewelry', emoji: '💎', href: '/categories?category=jewelry' },
                { name: 'Crafts', emoji: '🏺', href: '/categories?category=crafts' },
                { name: 'Clothing', emoji: '👕', href: '/categories?category=clothing' },
                { name: 'Spices', emoji: '🌶️', href: '/categories?category=spices' },
                { name: 'Music', emoji: '🥁', href: '/categories?category=music' }
              ].map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {category.emoji}
                  </span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors text-center">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-orange-50 rounded-xl border border-orange-100">
            <h4 className="text-lg font-semibold text-orange-800 mb-2">
              Need Help?
            </h4>
            <p className="text-orange-700 mb-4">
              If you believe this is an error or need assistance, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                Contact Support
              </Link>
              <Link 
                href="/help"
                className="inline-flex items-center justify-center px-6 py-2 bg-white hover:bg-gray-50 text-orange-600 border border-orange-600 rounded-lg font-medium transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import ProductCard from '../components/ui/ProductCard';
import { 
  Truck, 
  Shield, 
  Award, 
  Thermometer,
  Clock,
  MapPin,
  Star,
  Filter,
  ChevronDown
} from 'lucide-react';

export default function NyamazonePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const features = [
    {
      icon: Thermometer,
      title: "Cold Chain Delivery",
      description: "Temperature-controlled shipping ensures freshness from farm to table",
      color: "bg-blue-500"
    },
    {
      icon: Shield,
      title: "Quality Certified",
      description: "All meat products are certified by local food safety authorities",
      color: "bg-green-500"
    },
    {
      icon: Clock,
      title: "Same Day Delivery",
      description: "Order before 2 PM for same-day delivery in major cities",
      color: "bg-orange-500"
    },
    {
      icon: Award,
      title: "Premium Grade",
      description: "Only the finest quality meats from trusted local suppliers",
      color: "bg-purple-500"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: '45+' },
    { id: 'beef', name: 'Beef', count: '15+' },
    { id: 'lamb', name: 'Lamb', count: '8+' },
    { id: 'chicken', name: 'Chicken', count: '12+' },
    { id: 'fish', name: 'Fish', count: '10+' },
    { id: 'processed', name: 'Processed Meats', count: '8+' }
  ];

  const products = [
    {
      id: 'kenyan-beef',
      name: 'Premium Kenyan Beef (1kg)',
      price: '$28.99',
      originalPrice: '$32.99',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 124,
      badge: 'Premium',
      category: 'beef',
      description: 'Grass-fed beef from the highlands of Kenya'
    },
    {
      id: 'ethiopian-lamb',
      name: 'Ethiopian Highland Lamb (800g)',
      price: '$35.50',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      badge: 'Organic',
      category: 'lamb',
      description: 'Free-range lamb from Ethiopian highlands'
    },
    {
      id: 'nigerian-chicken',
      name: 'Nigerian Free-Range Chicken (1.2kg)',
      price: '$18.99',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 156,
      badge: 'Free-Range',
      category: 'chicken',
      description: 'Naturally raised chicken from Nigerian farms'
    },
    {
      id: 'tanzanian-fish',
      name: 'Tanzanian Tilapia (1kg)',
      price: '$22.00',
      originalPrice: '$25.00',
      image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 98,
      badge: 'Fresh',
      category: 'fish',
      description: 'Fresh tilapia from Lake Victoria'
    },
    {
      id: 'boerewors',
      name: 'Traditional Boerewors (500g)',
      price: '$15.99',
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 203,
      badge: 'Traditional',
      category: 'processed',
      description: 'Authentic South African boerewors sausage'
    },
    {
      id: 'goat-meat',
      name: 'Kenyan Goat Meat (1kg)',
      price: '$26.50',
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 67,
      badge: 'Local Favorite',
      category: 'beef',
      description: 'Tender goat meat, a local delicacy'
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const stats = [
    { number: "50+", label: "Premium Cuts" },
    { number: "24h", label: "Fresh Guarantee" },
    { number: "15", label: "Major Cities" },
    { number: "4.8★", label: "Customer Rating" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  Nyamazone Meats
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Premium quality meats delivered fresh to your doorstep. 
                  From the finest African farms to your table, with guaranteed freshness and quality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="#products">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                      Shop Now
                    </button>
                  </Link>
                  <Link href="#delivery">
                    <button className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                      Check Delivery
                    </button>
                  </Link>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex items-center space-x-8 pt-8">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="text-yellow-400" size={24} />
                    <span>Cold Chain</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="text-yellow-400" size={24} />
                    <span>Certified Quality</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=600&auto=format&fit=crop"
                  alt="Premium African meats"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white text-gray-900 p-6 rounded-lg shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">4.8★</div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                    <div className="text-xs text-gray-500 mt-1">Based on 2,500+ reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Nyamazone?</h2>
              <p className="text-xl text-gray-600">
                Quality, freshness, and reliability in every delivery
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className={`${feature.color} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Products</h2>
                <p className="text-xl text-gray-600">
                  Premium cuts from trusted African suppliers
                </p>
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center space-x-4 mt-6 lg:mt-0">
                <Filter className="text-gray-600" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showWishlist={true}
                  showAddToCart={true}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Delivery Information */}
        <section id="delivery" className="py-16 bg-red-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Delivery & Freshness</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Thermometer className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Cold Chain Logistics</h3>
                      <p className="text-gray-600">
                        Our temperature-controlled delivery system maintains optimal freshness 
                        from processing to your doorstep.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <Clock className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Same Day Delivery</h3>
                      <p className="text-gray-600">
                        Order before 2 PM and receive your fresh meat products the same day 
                        in Nairobi, Lagos, Cape Town, and other major cities.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <MapPin className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Coverage Areas</h3>
                      <p className="text-gray-600">
                        Currently serving 15 major African cities with plans to expand 
                        to rural areas and international markets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=600&auto=format&fit=crop"
                  alt="Delivery truck with cold storage"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-600">-2°C</div>
                    <div className="text-sm text-gray-600">Delivery Temp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
            <p className="text-xl mb-8 opacity-90">
              Experience the finest African meats delivered fresh to your door. 
              Join thousands of satisfied customers who trust Nyamazone for quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#products">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  Order Now
                </button>
              </Link>
              <Link href="/help">
                <button className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

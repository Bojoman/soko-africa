"use client";
import React, { useState } from 'react';
import { Search, Menu, ShoppingCart, User, MapPin, ChevronDown, Star, Heart, Globe, Shield, Truck, Award } from 'lucide-react';

export default function SokoAfricaHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Agri & Natural Products', icon: '🌾', count: '2,500+' },
    { name: 'Handcrafted Goods', icon: '🏺', count: '1,800+' },
    { name: 'Textile & Fashion', icon: '👗', count: '3,200+' },
    { name: 'Beauty & Wellness', icon: '🧴', count: '950+' },
    { name: 'Nyamazone Meats', icon: '🥩', count: '450+' },
  ];

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
      image: 'https://images.unsplash.com/photo-1594736797933-d0b22d7f2d04?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 234,
      badge: 'Fair Trade'
    },
    {
      id: 4,
      name: 'Shea Butter Skincare Set',
      price: '$32.00',
      image: 'https://images.unsplash.com/photo-1556228578-dd6a8b1cc4e9?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 112,
      badge: 'Organic'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-gray-900 text-white text-sm py-2">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="flex items-center"><MapPin size={14} className="mr-1" /> Deliver to Nairobi</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>📞 +254 700 123 456</span>
              <span>🌍 Ship Globally</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-orange-600">
                SOKO<span className="text-green-600">AFRICA</span>
              </div>
              
              {/* Categories Dropdown */}
              <div className="hidden lg:flex items-center space-x-6">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600">
                  <Menu size={20} />
                  <span>All Categories</span>
                  <ChevronDown size={16} />
                </button>
                <a href="#" className="text-gray-700 hover:text-orange-600">Agri Products</a>
                <a href="#" className="text-gray-700 hover:text-orange-600">Handcrafted</a>
                <a href="#" className="text-gray-700 hover:text-orange-600">Fashion</a>
                <a href="#" className="text-gray-700 hover:text-orange-600">Nyamazone</a>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for authentic African products..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600">
                <User size={24} />
                <span className="hidden md:block">Account</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 relative">
                <ShoppingCart size={24} />
                <span className="hidden md:block">Cart</span>
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-500 to-green-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Africa's Finest Goods, Delivered Globally
                </h1>
                <p className="text-xl opacity-90">
                  Discover authentic products from across Africa. Trusted sourcing, certified quality, direct from the continent.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                    Shop Now
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                    Become a Seller
                  </button>
                </div>
                <div className="flex items-center space-x-8 pt-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="text-yellow-400" size={24} />
                    <span>Verified Quality</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="text-yellow-400" size={24} />
                    <span>Global Shipping</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt="African farm produce"
                  className="rounded-lg shadow-lg object-cover h-48"
                />
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt="Handcrafted pottery"
                  className="rounded-lg shadow-lg object-cover h-48 mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1594736797933-d0b22d7f2d04?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt="African textiles"
                  className="rounded-lg shadow-lg object-cover h-48 -mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt="Spices and herbs"
                  className="rounded-lg shadow-lg object-cover h-48"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.count} products</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <button className="text-orange-600 hover:text-orange-700 font-semibold">View All →</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                        {product.badge}
                      </span>
                    )}
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                      <Heart size={16} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                        )}
                      </div>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-green-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"The quality of the Kenyan coffee beans exceeded my expectations. Authentic taste delivered right to my doorstep!"</p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3" 
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">James Mitchell</h4>
                    <p className="text-sm text-gray-600">London, UK</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Beautiful handcrafted jewelry that tells a story. The craftsmanship is incredible and shipping was fast!"</p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3" 
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">Sarah Chen</h4>
                    <p className="text-sm text-gray-600">Toronto, Canada</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Supporting African artisans while getting amazing products. SokoAfrica makes it easy to shop ethically!"</p>
                <div className="flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3" 
                    alt="Customer"
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">Marcus Johnson</h4>
                    <p className="text-sm text-gray-600">New York, USA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Connected with Africa</h2>
            <p className="text-xl text-gray-300 mb-8">Get exclusive deals, new product launches, and stories from African artisans delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">Join 50,000+ customers who love authentic African products</p>
          </div>
        </section>
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Choose Soko Africa?</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-600 p-3 rounded-full">
                      <Shield className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Certified Quality</h3>
                      <p className="text-gray-600">Every product is vetted and certified to meet international standards.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-600 p-3 rounded-full">
                      <Globe className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Direct from Africa</h3>
                      <p className="text-gray-600">Connect directly with African producers and artisans.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-600 p-3 rounded-full">
                      <Award className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Fair Trade Commitment</h3>
                      <p className="text-gray-600">Supporting sustainable practices and fair wages for African communities.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt="African marketplace"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold text-orange-600 mb-4">
                SOKO<span className="text-green-600">AFRICA</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting Africa's finest products with the world through trusted sourcing and quality delivery.
              </p>
              <div className="flex space-x-4">
                <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm">
                  Download App
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Get to Know Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About SokoAfrica</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press Releases</a></li>
                <li><a href="#" className="hover:text-white">Sustainability</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Make Money with SokoAfrica</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Sell Products on SokoAfrica</a></li>
                <li><a href="#" className="hover:text-white">Partner with Us</a></li>
                <li><a href="#" className="hover:text-white">SokoAfrica Business (B2B)</a></li>
                <li><a href="#" className="hover:text-white">Nyamazone Suppliers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Let Us Help You</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Your Account</a></li>
                <li><a href="#" className="hover:text-white">Returns & Replacements</a></li>
                <li><a href="#" className="hover:text-white">Privacy Settings</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 SokoAfrica. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
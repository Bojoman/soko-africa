"use client";
import React, { useState, useEffect } from 'react';
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
  Filter
} from 'lucide-react';

export default function NyamazonePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const SUB_SLUGS = ['beef', 'lamb', 'fish', 'game-meat'];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          '/api/products?branchSlug=nyamazone&coldChain=1&limit=50'
        );
        const data = await res.json();
        if (!cancelled) setProducts(data.products || []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) =>
          (p.categories || []).some((c) => c.slug === selectedCategory)
        );

  const categories = [
    { id: 'all', name: 'All Products', count: `${products.length}+` },
    ...SUB_SLUGS.map((id) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' '),
      count: `${
        products.filter((p) =>
          (p.categories || []).some((c) => c.slug === id)
        ).length
      }+`
    }))
  ];

  const features = [
    {
      icon: Thermometer,
      title: "Cold Chain Delivery",
      description: "Temperature-controlled shipping ensures freshness from farm to table",
      color: "bg-soko-dark-red",
      iconColor: "text-soko-dark-red"
    },
    {
      icon: Shield,
      title: "Quality Certified",
      description: "All meat products are certified by local food safety authorities",
      color: "bg-soko-orange-red",
      iconColor: "text-soko-orange-red"
    },
    {
      icon: Clock,
      title: "Same Day Delivery",
      description: "Order before 2 PM for same-day delivery in major cities",
      color: "bg-soko-orange",
      iconColor: "text-soko-orange"
    },
    {
      icon: Award,
      title: "Premium Grade",
      description: "Only the finest quality meats from trusted local suppliers",
      color: "bg-soko-dark-brown",
      iconColor: "text-soko-dark-brown"
    }
  ];

  const stats = [
    { number: "50+", label: "Premium Cuts" },
    { number: "24h", label: "Fresh Guarantee" },
    { number: "15", label: "Major Cities" },
    { number: "4.8", label: "Customer Rating", showStar: true }
  ];

  return (
    <div className="min-h-screen bg-soko-cream/30">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-soko-dark-red text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-soko-orange/20 text-soko-orange px-4 py-1 rounded-full text-sm font-medium mb-4">
                  Premium Meat Delivery
                </span>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  Nyamazone Meats
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Premium quality meats delivered fresh to your doorstep. 
                  From the finest African farms to your table, with guaranteed freshness and quality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="#products">
                    <button className="bg-soko-orange hover:bg-soko-orange-red text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                      Shop Now
                    </button>
                  </Link>
                  <Link href="#delivery">
                    <button className="border-2 border-soko-cream text-soko-cream hover:bg-soko-cream hover:text-soko-dark-red font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                      Check Delivery
                    </button>
                  </Link>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex items-center space-x-8 pt-8">
                  <div className="flex items-center space-x-2">
                    <div className="bg-soko-bright-cyan/20 p-2 rounded-full">
                      <Thermometer className="text-soko-bright-cyan" size={24} />
                    </div>
                    <span className="text-soko-cream">Cold Chain</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-soko-dark-teal/40 p-2 rounded-full">
                      <Shield className="text-soko-light-blue" size={24} />
                    </div>
                    <span className="text-soko-cream">Certified Quality</span>
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
                <div className="absolute -bottom-6 -right-6 bg-soko-cream text-soko-dark-brown p-6 rounded-lg shadow-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-soko-orange-red">
                      <span>4.8</span>
                      <Star className="w-5 h-5 fill-soko-orange" aria-hidden="true" />
                    </div>
                    <div className="text-sm text-soko-dark-brown">Customer Rating</div>
                    <div className="text-xs text-soko-dark-brown/70 mt-1">Based on 2,500+ reviews</div>
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
                <div key={index} className="bg-soko-cream/20 p-6 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-3xl font-bold text-soko-orange-red mb-2">
                    <span>{stat.number}</span>
                    {stat.showStar && <Star className="w-6 h-6 fill-soko-orange" aria-hidden="true" />}
                  </div>
                  <div className="text-soko-dark-brown font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                Our Promise
              </span>
              <h2 className="text-3xl font-bold mb-4 text-soko-dark-red">Why Choose Nyamazone?</h2>
              <p className="text-xl text-soko-dark-brown/70">
                Quality, freshness, and reliability in every delivery
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="bg-soko-cream/20 p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                    <div className={`${feature.color} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className={`font-semibold text-lg mb-2 ${feature.iconColor}`}>{feature.title}</h3>
                    <p className="text-soko-dark-brown/70">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 bg-soko-cream/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
              <div>
                <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
              Our Selection
                </span>
                <h2 className="text-3xl font-bold mb-4 text-soko-dark-red">Our Products</h2>
                <p className="text-xl text-soko-dark-brown/70">
                  Premium cuts from trusted African suppliers
                </p>
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center space-x-4 mt-6 lg:mt-0">
                <Filter className="text-soko-dark-brown" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-soko-dark-brown/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-soko-orange text-soko-dark-brown bg-white"
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
              {loading ? (
                <p className="text-gray-500 col-span-full text-center py-12">Loading Nyamazone…</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center py-12">No cold-chain listings yet.</p>
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showWishlist={true}
                    showAddToCart={true}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Delivery Information */}
        <section id="delivery" className="py-16 bg-soko-dark-brown">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-soko-orange font-semibold text-sm uppercase tracking-wider mb-2">
                  How We Deliver
                </span>
                <h2 className="text-3xl font-bold mb-6 text-soko-cream">Delivery & Freshness</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-soko-orange/20 p-3 rounded-full">
                      <Thermometer className="text-soko-orange" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-soko-cream">Cold Chain Logistics</h3>
                      <p className="text-soko-cream/80">
                        Our temperature-controlled delivery system maintains optimal freshness 
                        from processing to your doorstep.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-soko-orange-red/20 p-3 rounded-full">
                      <Clock className="text-soko-orange-red" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-soko-cream">Same Day Delivery</h3>
                      <p className="text-soko-cream/80">
                        Order before 2 PM and receive your fresh meat products the same day 
                        in Nairobi, Lagos, Cape Town, and other major cities.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-soko-cream/20 p-3 rounded-full">
                      <MapPin className="text-soko-cream" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-soko-cream">Coverage Areas</h3>
                      <p className="text-soko-cream/80">
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
                <div className="absolute top-4 right-4 bg-soko-cream/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-soko-orange-red">-2°C</div>
                    <div className="text-sm text-soko-dark-brown">Delivery Temp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-soko-dark-red text-soko-cream">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="inline-block bg-soko-orange/20 text-soko-orange px-4 py-1 rounded-full text-sm font-medium mb-4">
              Get Started Today
            </span>
            <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
            <p className="text-xl mb-8 text-soko-cream/80">
              Experience the finest African meats delivered fresh to your door. 
              Join thousands of satisfied customers who trust Nyamazone for quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#products">
                <button className="bg-soko-orange hover:bg-soko-orange-red text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  Order Now
                </button>
              </Link>
              <Link href="/help">
                <button className="border-2 border-soko-cream text-soko-cream hover:bg-soko-cream hover:text-soko-dark-red font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
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

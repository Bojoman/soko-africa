"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { 
  Store, 
  TrendingUp, 
  Globe, 
  Shield, 
  Users, 
  DollarSign, 
  BarChart3, 
  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function SellPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    products: '',
    experience: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Seller application:', formData);
    // Add success message/redirect logic here
  };

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access customers in 150+ countries worldwide",
      color: "bg-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Leverage our marketing and analytics tools",
      color: "bg-green-500"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Get paid safely with our payment protection",
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Seller Support",
      description: "Dedicated support team to help you succeed",
      color: "bg-orange-500"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Sellers" },
    { number: "150+", label: "Countries" },
    { number: "$2M+", label: "Monthly Sales" },
    { number: "98%", label: "Seller Satisfaction" }
  ];

  const steps = [
    {
      step: 1,
      title: "Apply to Sell",
      description: "Fill out our simple application form",
      icon: "📝"
    },
    {
      step: 2,
      title: "Get Verified",
      description: "We'll review and verify your business",
      icon: "✅"
    },
    {
      step: 3,
      title: "List Products",
      description: "Add your products with photos and descriptions",
      icon: "📦"
    },
    {
      step: 4,
      title: "Start Selling",
      description: "Begin selling to customers worldwide",
      icon: "🚀"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  Sell Your African Products to the World
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of African entrepreneurs who are building successful businesses 
                  on Soko Africa. Reach global customers and grow your income.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="#apply">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                      Start Selling Today
                    </button>
                  </Link>
                  <Link href="#learn-more">
                    <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=600&auto=format&fit=crop"
                  alt="African entrepreneur with products"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">$5,000+</div>
                      <div className="text-sm text-gray-600">Avg. Monthly Earnings</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="learn-more" className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-orange-600">Why Sell on Soko Africa?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join Africa's largest marketplace for authentic products and grow your business with our powerful seller tools.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className={`${benefit.color} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-amber-400">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-orange-600">How It Works</h2>
              <p className="text-xl text-gray-600">
                Get started selling in just 4 simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-amber-400">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seller Application Form */}
        <section id="apply" className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-orange-600">Apply to Become a Seller</h2>
                <p className="text-gray-600">
                  Fill out this form and we'll get back to you within 24 hours
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Business Type</option>
                      <option value="artisan">Individual Artisan</option>
                      <option value="small_business">Small Business</option>
                      <option value="cooperative">Cooperative</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="distributor">Distributor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Experience</option>
                      <option value="new">New to selling</option>
                      <option value="1-2">1-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What products do you sell? *
                  </label>
                  <textarea
                    name="products"
                    value={formData.products}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe the products you want to sell on Soko Africa..."
                    required
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center"
                  >
                    Submit Application
                    <ArrowRight className="ml-2" size={20} />
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-orange-600">Seller Success Stories</h2>
              <p className="text-xl text-gray-600">
                Real stories from real sellers who found success on Soko Africa
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Amina Hassan",
                  business: "Hassan Crafts",
                  story: "Increased my monthly income by 400% after joining Soko Africa. The global reach is incredible!",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format"
                },
                {
                  name: "Joseph Kikwete",
                  business: "Kikwete Coffee",
                  story: "Went from selling locally to shipping coffee to 25 countries. Soko Africa changed my life!",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
                },
                {
                  name: "Grace Okafor",
                  business: "Ankara Dreams",
                  story: "Built a team of 10 seamstresses thanks to the steady orders from Soko Africa customers.",
                  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                }
              ].map((seller, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Image
                      src={seller.image}
                      alt={seller.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-amber-400">{seller.name}</h4>
                      <p className="text-sm text-gray-600">{seller.business}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{seller.story}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

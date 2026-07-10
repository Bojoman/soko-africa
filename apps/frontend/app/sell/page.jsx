"use client";
import React, { useState } from 'react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import EnhancedFAQSection from '../components/ui/EnhancedFAQSection';
import SellerApplyForm from '../components/seller/SellerApplyForm';
import { useFAQ } from '../hooks/useFAQ';
import { 
  Store, 
  TrendingUp, 
  Truck,
  Globe,
  Shield,
  DollarSign,
  Package,
  HeartHandshake,
  Camera,
  CheckCircle
} from 'lucide-react';

export default function SellPage() {
  const { faqs, loading, error } = useFAQ('seller');
  const [showApply, setShowApply] = useState(false);

  const benefits = [
    {
      icon: Globe,
      title: "Sell Worldwide",
      description: "Your products in front of buyers in 150+ countries. From Nairobi to New York, Lagos to London."
    },
    {
      icon: Package,
      title: "We Handle Shipping",
      description: "Our logistics partners pick up from your door and deliver worldwide. You focus on making, we handle the rest."
    },
    {
      icon: DollarSign,
      title: "You Keep More",
      description: "Just 15% commission - lower than most platforms. Get paid directly to your bank or mobile money."
    },
    {
      icon: HeartHandshake,
      title: "Real Support",
      description: "Dedicated seller support team, not bots. Phone, WhatsApp, or email - we're here to help."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Tell Us About You",
      description: "Share your story, your craft, and your products. We verify every seller to maintain quality.",
      detail: "Most applications reviewed within 48 hours"
    },
    {
      number: "2",
      title: "List Your Products",
      description: "Upload photos, set prices, and tell the story behind each item. Buyers love knowing the maker.",
      detail: "Free product photography tips included"
    },
    {
      number: "3",
      title: "Start Taking Orders",
      description: "When orders come in, we'll notify you instantly. Pack your items and our courier picks them up.",
      detail: "Get paid within 7 days of delivery"
    }
  ];

  const sellerStories = [
    {
      name: "Amina Diallo",
      location: "Dakar, Senegal",
      craft: "Handwoven Baskets",
      quote: "I used to sell at the local market. Now I ship to customers in 12 countries. My daughter is learning the craft too.",
      stat: "$4,200/month"
    },
    {
      name: "Omar Hassan",
      location: "Cairo, Egypt",
      craft: "Traditional Ceramics",
      quote: "Soko Africa helped me turn my grandfather's pottery techniques into a business that feeds my whole family.",
      stat: "500+ orders"
    }
  ];

  return (
    <div className="min-h-screen bg-soko-cream/30">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-soko-dark-teal text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block bg-soko-orange/20 text-soko-orange px-4 py-1 rounded-full text-sm font-medium mb-6">
                For Artisans, Farmers & Creators
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Share Your Craft With the World
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-soko-light-blue/90">
                Join 2,500+ African makers selling to customers in 150+ countries. 
                Whether you weave baskets, roast coffee, or carve wood - there's a market for what you make.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setShowApply(true)}
                  className="bg-soko-orange hover:bg-soko-orange-red text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
                >
                  Apply to Sell
                </button>
                <button className="border-2 border-soko-cream text-soko-cream hover:bg-soko-cream hover:text-soko-dark-teal font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  See Success Stories
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-8 bg-white border-b border-soko-dark-teal/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-soko-orange-red">2,500+</div>
                <div className="text-sm text-soko-dark-teal/70">Active Sellers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-soko-orange-red">150+</div>
                <div className="text-sm text-soko-dark-teal/70">Countries Reached</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-soko-orange-red">$12M+</div>
                <div className="text-sm text-soko-dark-teal/70">Paid to Sellers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-soko-orange-red">15%</div>
                <div className="text-sm text-soko-dark-teal/70">Commission Only</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                What You Get
              </span>
              <h2 className="text-3xl font-bold text-soko-dark-teal mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-soko-dark-brown/70 max-w-2xl mx-auto">
                We built Soko Africa for makers like you. No tech skills needed, no upfront costs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="text-center p-6 bg-soko-cream/20 rounded-xl">
                    <div className="bg-soko-dark-teal/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-soko-dark-teal" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-soko-dark-teal mb-2">{benefit.title}</h3>
                    <p className="text-soko-dark-brown/70 text-sm">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-soko-cream/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                Getting Started
              </span>
              <h2 className="text-3xl font-bold text-soko-dark-teal mb-4">
                Three Steps to Your First Sale
              </h2>
              <p className="text-lg text-soko-dark-brown/70">
                No complicated setup. Most sellers are live within a week.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-8 rounded-xl shadow-sm h-full">
                    <div className="bg-soko-orange text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-6">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-soko-dark-teal mb-4">{step.title}</h3>
                    <p className="text-soko-dark-brown/70 mb-4">{step.description}</p>
                    <p className="text-sm text-soko-orange-red font-medium">{step.detail}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-soko-dark-teal/30">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seller Stories */}
        <section className="py-16 bg-soko-dark-teal">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-bright-cyan font-semibold text-sm uppercase tracking-wider mb-2">
                Real Sellers, Real Stories
              </span>
              <h2 className="text-3xl font-bold text-soko-cream mb-4">
                Meet Our Sellers
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {sellerStories.map((story, index) => (
                <div key={index} className="bg-soko-cream/10 p-8 rounded-xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 bg-soko-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-soko-cream text-lg">{story.name}</h4>
                      <p className="text-soko-light-blue/80 text-sm">{story.craft} • {story.location}</p>
                    </div>
                  </div>
                  <blockquote className="text-soko-cream/90 italic mb-4">
                    "{story.quote}"
                  </blockquote>
                  <div className="flex items-center gap-2 text-soko-orange">
                    <TrendingUp size={20} />
                    <span className="font-semibold">{story.stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Can Sell */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                What We Accept
              </span>
              <h2 className="text-3xl font-bold text-soko-dark-teal mb-4">
                What Can You Sell?
              </h2>
              <p className="text-lg text-soko-dark-brown/70">
                We focus on authentic, quality African products
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Handmade Crafts", examples: "Baskets, pottery, jewelry, textiles" },
                { name: "Fashion & Textiles", examples: "Ankara fabrics, traditional wear, accessories" },
                { name: "Food & Beverages", examples: "Coffee, tea, spices, sauces, snacks" },
                { name: "Art & Home Decor", examples: "Paintings, sculptures, wood carvings" },
                { name: "Beauty & Wellness", examples: "Shea butter, natural oils, soaps" },
                { name: "Nyamazone Meats", examples: "Premium beef, lamb, chicken, fish" }
              ].map((category, index) => (
                <div key={index} className="p-6 bg-soko-cream/20 rounded-xl border border-soko-dark-teal/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-soko-orange" size={20} />
                    <h4 className="font-semibold text-soko-dark-teal">{category.name}</h4>
                  </div>
                  <p className="text-sm text-soko-dark-brown/60">{category.examples}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-soko-cream/30">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                Common Questions
              </span>
              <h2 className="text-3xl font-bold text-soko-dark-teal">Seller FAQ</h2>
            </div>
            {faqs && <EnhancedFAQSection faqs={faqs} userType="seller" />}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-soko-dark-brown text-soko-cream">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="inline-block bg-soko-orange/20 text-soko-orange px-4 py-1 rounded-full text-sm font-medium mb-4">
              Start Your Journey
            </span>
            <h2 className="text-3xl font-bold mb-4">Ready to Share Your Craft?</h2>
            <p className="text-xl mb-8 text-soko-cream/80">
              Applications are free and take about 10 minutes. 
              Our team reviews every application personally - no algorithms, just real people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => setShowApply(true)}
                className="bg-soko-orange hover:bg-soko-orange-red text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                Apply to Sell
              </button>
              <button className="border-2 border-soko-cream text-soko-cream hover:bg-soko-cream hover:text-soko-dark-brown font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                WhatsApp Us: +254 712 345 678
              </button>
            </div>
          </div>
        </section>
      </main>

      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <SellerApplyForm onClose={() => setShowApply(false)} />
        </div>
      )}
      
      <Footer />
    </div>
  );
}

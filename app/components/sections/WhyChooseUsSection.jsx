"use client";
import React from 'react';
import Image from 'next/image';
import { Shield, Globe, Award, Truck, Lock, Users } from 'lucide-react';

const WhyChooseUsSection = ({ 
  title = "Why Choose Soko Africa?",
  className = "" 
}) => {
  const features = [
    {
      icon: Shield,
      title: "Certified Quality",
      description: "Every product is vetted and certified to meet international standards.",
      color: "bg-soko-orange"
    },
    {
      icon: Globe,
      title: "Direct from Africa",
      description: "Connect directly with African producers and artisans.",
      color: "bg-soko-bright-cyan"
    },
    {
      icon: Award,
      title: "Fair Trade Commitment",
      description: "Supporting sustainable practices and fair wages for African communities.",
      color: "bg-soko-dark-red"
    },
    {
      icon: Truck,
      title: "Global Shipping",
      description: "Reliable delivery to over 150 countries with tracking.",
      color: "bg-soko-dark-teal"
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "Bank-level security with multiple payment options.",
      color: "bg-soko-orange-red"
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Every purchase supports African communities and artisans.",
      color: "bg-soko-dark-brown"
    }
  ];

  return (
    <section className={`bg-gradient-to-br from-soko-cream/20 via-white to-soko-orange/10 py-20 relative overflow-hidden ${className}`}>
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-soko-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-soko-bright-cyan/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-soko-orange/10 text-soko-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Shield size={16} />
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover what makes SokoAfrica the trusted choice for authentic African products worldwide
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className={`${feature.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-soko-orange transition-colors">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Call to Action */}
            <div className="mt-10">
              <button className="bg-soko-dark-red hover:from-soko-orange-red hover:to-soko-dark-red text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Shopping
              </button>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/utility/why-choose-soko-africa.png"
                alt="African marketplace showcasing local artisans and their products"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div className="absolute inset-0 bg-gradient-to-t from-soko-dark-red/30 via-transparent to-soko-orange/20"></div>
            </div>
            
            {/* Floating Stats with Soko Branding */}
            <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-soko-cream/50">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-soko-orange to-soko-orange-red rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-soko-orange">5000+</div>
                <div className="text-sm text-gray-600 font-medium">Artisans Supported</div>
              </div>
            </div>
            
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-soko-cream/50">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-soko-bright-cyan to-soko-dark-teal rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-soko-bright-cyan">98%</div>
                <div className="text-sm text-gray-600 font-medium">Customer Satisfaction</div>
              </div>
            </div>

            {/* Additional floating element */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-gradient-to-br from-soko-dark-red to-soko-orange-red rounded-full p-4 shadow-xl">
              <Shield className="text-soko-dark-red" size={32} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;

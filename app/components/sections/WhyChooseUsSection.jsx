"use client";
import React from 'react';
import Image from 'next/image';
import { Shield, Globe, Award, Truck, Lock, Users } from 'lucide-react';

const WhyChooseUsSection = ({ 
  title = "Why Choose Soko Africa?",
  className = "text-orange-600" 
}) => {
  const features = [
    {
      icon: Shield,
      title: "Certified Quality",
      description: "Every product is vetted and certified to meet international standards.",
      color: "bg-orange-600"
    },
    {
      icon: Globe,
      title: "Direct from Africa",
      description: "Connect directly with African producers and artisans.",
      color: "bg-green-600"
    },
    {
      icon: Award,
      title: "Fair Trade Commitment",
      description: "Supporting sustainable practices and fair wages for African communities.",
      color: "bg-yellow-600"
    },
    {
      icon: Truck,
      title: "Global Shipping",
      description: "Reliable delivery to over 150 countries with tracking.",
      color: "bg-blue-600"
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "Bank-level security with multiple payment options.",
      color: "bg-purple-600"
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "Every purchase supports African communities and artisans.",
      color: "bg-red-600"
    }
  ];

  return (
    <section className={`bg-gray-100 py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-orange-600 mb-6">{title}</h2>
            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`${feature.color} p-3 rounded-full`}>
                      <IconComponent className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-amber-400">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Call to Action */}
            <div className="mt-8">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Start Shopping
              </button>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <Image
              src="/utility/why-choose-soko-africa.png"
              alt="African marketplace showcasing local artisans and their products"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            
            {/* Floating Stats */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">5000+</div>
                <div className="text-sm text-gray-600">Artisans Supported</div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;

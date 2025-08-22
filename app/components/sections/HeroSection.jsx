"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Truck } from 'lucide-react';

const HeroSection = () => {
  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      alt: "African farm produce",
      className: "rounded-lg shadow-lg object-cover h-48"
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      alt: "Handcrafted pottery",
      className: "rounded-lg shadow-lg object-cover h-48 mt-8"
    },
    {
      src: "https://images.unsplash.com/photo-1594736797933-d0b22d7f2d04?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      alt: "African textiles",
      className: "rounded-lg shadow-lg object-cover h-48 -mt-8"
    },
    {
      src: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
      alt: "Spices and herbs",
      className: "rounded-lg shadow-lg object-cover h-48"
    }
  ];

  const trustBadges = [
    {
      icon: Shield,
      title: "Verified Quality",
      description: "Every product is certified to meet international standards"
    },
    {
      icon: Truck,
      title: "Global Shipping",
      description: "Reliable delivery to over 150 countries worldwide"
    }
  ];

  return (
    <section className="relative bg-gradient-to-r from-orange-500 to-green-600 text-white overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Africa&apos;s Finest Goods, Delivered Globally
            </h1>
            <p className="text-xl opacity-90">
              Discover authentic products from across Africa. Trusted sourcing, certified quality, direct from the continent.
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/categories">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  Shop Now
                </button>
              </Link>
              <Link href="/sell">
                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  Become a Seller
                </button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-8 pt-4">
              {trustBadges.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <IconComponent className="text-yellow-400" size={24} />
                    <span className="font-medium">{badge.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            {heroImages.map((image, index) => (
              <Image
                key={index}
                src={image.src}
                alt={image.alt}
                width={400}
                height={192}
                className={image.className}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Truck } from 'lucide-react';

const HeroSection = () => {

  const allHeroImages = [
    {
      src: "/hero/Ankara bags.png",
      fallback: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
      alt: "African Handicrafts",
      title: "Handicrafts"
    },
    {
      src: "/hero/Black beans.png",
      fallback: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      alt: "Black beans-Cereals from africa",
      title: "Black beans"
    },
    {
      src: "/hero/ankara bucket hats.png",
      fallback: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center",
      alt: "African Textiles",
      title: "Bucket hat"
    },
    {
      src: "/hero/ndengu.png",
      fallback: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
      alt: "Green grams",
      title: "Ndengu"
    },
    {
      src: "/hero/massai wall art.png",
      fallback: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
      alt: "African cultural items",
      title: "Maasai wall art"
    },
        {
      src: "/hero/yellow beans.png",
      fallback: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center",
      alt: "African food",
      title: "Yellow beans"
    },
    {
      src: "/hero/Ankara fabric.png",
      fallback: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
      alt: "African cultural items",
      title: "Ankara fabric"
    },
        {
      src: "/hero/avocado.png",
      fallback: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
      alt: "Fruits from Africa",
      title: "Avocado"
    }
  ];

  const [currentImageSet, setCurrentImageSet] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  // Cycle through images every 6 seconds (3 sets of 2 images for better proportions)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageSet((prev) => (prev + 1) % 3); // Switch between 3 sets of 2 images
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Handle image load errors
  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  // Get current set of 2 images to display
  const getCurrentImages = () => {
    const startIndex = currentImageSet * 2;
    return allHeroImages.slice(startIndex, startIndex + 2);
  };

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
    <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-green-600 text-white overflow-hidden min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-[85vh] xl:min-h-[90vh]">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-orange-300/10 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 xl:py-16 h-full">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch h-full">
          {/* Content Section - Left Side (40% width) */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 flex flex-col justify-center px-2 sm:px-4 lg:px-6 xl:px-8 order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Africa&apos;s Finest Goods, Delivered Globally
            </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
              Discover authentic products from across Africa. Trusted sourcing, certified quality, direct from the continent.
            </p>
            </div>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link href="/categories">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-yellow-500/25 w-full sm:w-auto">
                  Shop Now
                </button>
              </Link>
              <Link href="/sell">
                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full sm:w-auto">
                  Become a Seller
                </button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 pt-6">
              {trustBadges.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="p-2 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors duration-300">
                    <IconComponent className="text-yellow-400" size={20} />
                    </div>
                    <div>
                      <span className="font-semibold text-sm lg:text-base block">{badge.title}</span>
                      <span className="text-xs lg:text-sm opacity-75 hidden sm:block">{badge.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Images Section - Right Side (60% width) */}
          <div className="relative h-full overflow-hidden order-1 lg:order-2 rounded-2xl shadow-2xl">
            <div className="flex h-full gap-2">
              {getCurrentImages().map((image, index) => {
                const globalIndex = currentImageSet * 2 + index;
                const hasError = imageErrors[globalIndex];
                const imageSrc = hasError ? image.fallback : image.src;
                
                return (
                  <div 
                    key={`${currentImageSet}-${index}`} 
                    className="flex-1 relative overflow-hidden transition-all duration-1000 ease-in-out group hover:scale-[1.02] rounded-xl"
                  >
                    <Image
                      src={imageSrc}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 30vw, (max-width: 1280px) 30vw, 30vw"
                      priority={index === 0}
                      quality={100}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      onError={() => handleImageError(globalIndex)}
                    />
                    
                    {/* Quality Enhancement Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-green-600/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                    
                    {/* Subtle vignette for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-50"></div>
                    
                    {/* Subtle border between images */}
                    {index === 0 && (
                      <div className="absolute right-0 top-0 bottom-0 w-px bg-white/20"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

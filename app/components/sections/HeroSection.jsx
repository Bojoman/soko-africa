"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Shield, Truck, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Link from 'next/link';

// --- 1. Data and Constants ---

// Slides with hero images - Mixed order for product diversity
const slides = [
  {
    src: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80",
    title: "African Market Essentials",
    subtitle: "Shop fresh produce & spices",
    category: "Home & Kitchen",
    cta: "Shop Kitchen"
  },
  {
    src: "/hero/Ankara fabric.png",
    title: "Bold Ankara Fashion",
    subtitle: "Authentic African textiles & fabrics",
    category: "Fashion & Textiles",
    cta: "Shop Fashion"
  },
  {
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80",
    title: "Natural Beauty & Hair Care",
    subtitle: "Shea butter & oils",
    category: "Beauty & Personal Care",
    cta: "Shop Beauty"
  },
  {
    src: "/hero/Ankara bags.png",
    title: "Handcrafted Accessories",
    subtitle: "Unique Ankara bags & accessories",
    category: "Handicrafts",
    cta: "Shop Crafts"
  },
  {
    src: "/hero/avocado.png",
    title: "Fresh African Produce",
    subtitle: "Farm-fresh avocados & tropical fruits",
    category: "Food & Beverages",
    cta: "Shop Produce"
  },
  {
    src: "/hero/massai wall art.png",
    title: "Cultural Art & Decor",
    subtitle: "Authentic Maasai art & decorations",
    category: "Art & Home Decor",
    cta: "Shop Art"
  },
  {
    src: "/hero/Black beans.png",
    title: "Premium African Grains",
    subtitle: "Black beans, ndengu & more",
    category: "Pantry Essentials",
    cta: "Shop Grains"
  },
  {
    src: "/hero/ankara bucket hats.png",
    title: "Stylish African Wear",
    subtitle: "Ankara bucket hats & fashion accessories",
    category: "Fashion Accessories",
    cta: "Shop Accessories"
  },
];

const SLIDE_DURATION = 5000; 

const trustBadgesData = [
  { icon: Shield, title: "Verified Quality", description: "Every product is certified to meet international standards" },
  { icon: Truck, title: "Global Shipping", description: "Reliable delivery to over 150 countries worldwide" }
];


// --- 2. Reusable Sub-Components ---

const TrustBadge = ({ icon: Icon, title, description }) => (
  <div className="flex items-center space-x-3 group">
    <div className="p-2 bg-soko-orange/20 rounded-full group-hover:bg-soko-orange/30 transition-colors duration-300">
      <Icon className="text-soko-orange" size={20} />
    </div>
    <div>
      <span className="font-semibold text-sm lg:text-base block text-white">{title}</span>
      <span className="text-xs lg:text-sm opacity-90 hidden sm:block text-white">{description}</span>
    </div>
  </div>
);

// --- 3. Main Hero Slider Component ---

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(nextSlide, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Get upcoming slides for thumbnails
  const getUpcomingSlides = () => {
    const upcoming = [];
    for (let i = 1; i <= slides.length && i <= 3; i++) {
      upcoming.push(slides[(current + i) % slides.length]);
    }
    return upcoming;
  };

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-soko-dark-teal via-soko-dark-brown to-soko-bright-cyan min-h-[70vh] lg:min-h-[75vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Featured products carousel"
      aria-live="polite"
    >
      <div className="relative h-[70vh] lg:h-[75vh]">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === current
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
            style={{
              transform: idx === current ? 'scale(1)' : 'scale(1.05)',
              transition: 'all 1000ms ease-in-out',
            }}
          >
            <Image
              src={slide.src}
              alt={slide.title}
              fill
              className="object-cover"
              priority={idx === 0}
              sizes="100vw"
              quality={90}
              unoptimized={slide.src.includes('unsplash')}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-20">
              <div className="max-w-4xl">
                {/* Category badge */}
                <span
                  className="inline-block px-5 py-2 mb-6 text-sm font-bold bg-soko-orange text-white rounded-full transform transition-all duration-700"
                  style={{
                    opacity: idx === current ? 1 : 0,
                    transform: idx === current ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: idx === current ? '300ms' : '0ms',
                  }}
                >
                  {slide.category}
                </span>
                
                {/* Title */}
                <h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white drop-shadow-lg transition-all duration-700"
                  style={{
                    opacity: idx === current ? 1 : 0,
                    transform: idx === current ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: idx === current ? '400ms' : '0ms',
                  }}
                >
                  {slide.title}
                </h1>
                
                {/* Subtitle */}
                <p
                  className="text-xl md:text-3xl text-gray-100 mb-8 drop-shadow-md transition-all duration-700"
                  style={{
                    opacity: idx === current ? 1 : 0,
                    transform: idx === current ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: idx === current ? '500ms' : '0ms',
                  }}
                >
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div
                  className="flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-700"
                  style={{
                    opacity: idx === current ? 1 : 0,
                    transform: idx === current ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: idx === current ? '600ms' : '0ms',
                  }}
                >
                  <Link href="/categories">
                    <button className="bg-soko-bright-cyan hover:bg-soko-orange text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                      {slide.cta}
                    </button>
                  </Link>
                  <Link href="/sell">
                    <button className="border-2 border-white text-white hover:bg-white hover:text-soko-dark-teal font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
                      Become a Seller
                    </button>
                  </Link>
                </div>

                {/* Trust badges */}
                <div 
                  className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 transition-all duration-700"
                  style={{
                    opacity: idx === current ? 1 : 0,
                    transform: idx === current ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: idx === current ? '700ms' : '0ms',
                  }}
                >
                  {trustBadgesData.map((badge, index) => (
                    <TrustBadge key={index} {...badge} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-soko-dark-brown/70 hover:bg-soko-orange text-white rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-soko-bright-cyan z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-soko-dark-brown/70 hover:bg-soko-orange text-white rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-soko-bright-cyan z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Play/Pause button */}
        <button
          onClick={() => setIsPaused((p) => !p)}
          className="absolute top-4 md:top-8 right-4 md:right-8 p-3 md:p-4 bg-soko-dark-brown/70 hover:bg-soko-orange text-white rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-soko-bright-cyan z-10"
          aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
        >
          {isPaused ? <Play className="w-5 h-5 md:w-6 md:h-6" /> : <Pause className="w-5 h-5 md:w-6 md:h-6" />}
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-3 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white ${
                idx === current
                  ? 'bg-soko-orange w-10 shadow-lg'
                  : 'bg-white/40 hover:bg-white/60 w-3'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === current ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Thumbnail preview - upcoming slides */}
        <div className="absolute bottom-8 right-8 hidden xl:flex gap-4 z-10">
          {getUpcomingSlides().map((slide, idx) => {
            const slideIndex = (current + idx + 1) % slides.length;
            return (
              <div
                key={slideIndex}
                className="relative w-32 h-40 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 border-white/30 transition-all hover:border-soko-orange hover:scale-105 hover:-translate-y-1"
                onClick={() => goToSlide(slideIndex)}
              >
                <Image
                  src={slide.src}
                  alt={`${slide.title} thumbnail`}
                  fill
                  className="object-cover"
                  sizes="128px"
                  quality={75}
                  unoptimized={slide.src.includes('unsplash')}
                />
                
                <div className="absolute inset-0 bg-black/40 transition-all hover:bg-black/20" />
                
                <div className="absolute bottom-0 w-full bg-soko-dark-brown/90 text-xs text-center text-white py-2 px-2 truncate font-medium">
                  {slide.category}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

// "use client";
// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Shield, Truck } from 'lucide-react';

// // --- 1. Data and Constants ---

// const allHeroImages = [
//   { src: "/hero/Ankara bags.png", fallback: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit-crop&crop=center", alt: "African Handicrafts" },
//   { src: "/hero/Black beans.png", fallback: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit-crop&crop=center", alt: "Black beans-Cereals from africa" },
//   { src: "/hero/ankara bucket hats.png", fallback: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit-crop&crop=center", alt: "African Textiles" },
//   { src: "/hero/ndengu.png", fallback: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit-crop&crop=center", alt: "Green grams" },
//   { src: "/hero/massai wall art.png", fallback: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit-crop&crop=center", alt: "African cultural items" },
//   { src: "/hero/yellow beans.png", fallback: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit-crop&crop=center", alt: "African food" },
//   { src: "/hero/Ankara fabric.png", fallback: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit-crop&crop=center", alt: "African cultural items" },
//   { src: "/hero/avocado.png", fallback: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit-crop&crop=center", alt: "Fruits from Africa" }
// ];

// const trustBadgesData = [
//   { icon: Shield, title: "Verified Quality", description: "Every product is certified to meet international standards" },
//   { icon: Truck, title: "Global Shipping", description: "Reliable delivery to over 150 countries worldwide" }
// ];


// // --- 2. Reusable Sub-Components ---

// const TrustBadge = ({ icon: Icon, title, description }) => (
//   <div className="flex items-center space-x-3 group">
//     <div className="p-2 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors duration-300">
//       <Icon className="text-yellow-400" size={20} />
//     </div>
//     <div>
//       <span className="font-semibold text-sm lg:text-base block">{title}</span>
//       <span className="text-xs lg:text-sm opacity-75 hidden sm:block">{description}</span>
//     </div>
//   </div>
// );

// const HeroImage = ({ image, hasError, onError, isPriority }) => (
//   <div className="relative overflow-hidden transition-all duration-1000 ease-in-out group hover:scale-[1.02] rounded-xl shadow-2xl">
//     <Image
//       src={hasError ? image.fallback : image.src}
//       alt={image.alt}
//       fill
//       className="object-cover transition-transform duration-1000 group-hover:scale-110"
//       sizes="(max-width: 1024px) 50vw, 30vw"
//       priority={isPriority}
//       quality={100}
//       placeholder="blur"
//       blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
//       onError={onError}
//     />
//     <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-green-600/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
//     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-50"></div>
//   </div>
// );

// const ImageSlideshow = ({ images }) => {
//   const [currentImageSet, setCurrentImageSet] = useState(0);
//   const [imageErrors, setImageErrors] = useState({});

//   useEffect(() => {
//     if (!images || images.length === 0) return;
//     const numSets = Math.ceil(images.length / 2);
//     const interval = setInterval(() => {
//       setCurrentImageSet((prev) => (prev + 1) % numSets);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, [images]);

//   const handleImageError = (index) => {
//     setImageErrors(prev => ({ ...prev, [index]: true }));
//   };

//   const startIndex = currentImageSet * 2;
//   const currentImages = images.slice(startIndex, startIndex + 2);

//   return (
//     <div className="grid grid-cols-2 gap-2 h-full">
//       {currentImages.map((image, index) => {
//         const globalIndex = startIndex + index;
//         return (
//           <HeroImage
//             key={globalIndex}
//             image={image}
//             hasError={imageErrors[globalIndex]}
//             onError={() => handleImageError(globalIndex)}
//             isPriority={index === 0}
//           />
//         );
//       })}
//     </div>
//   );
// };


// const HeroContent = () => (
//   <div className="space-y-3 sm:space-y-4 lg:space-y-6 flex flex-col justify-center px-2 sm:px-4 lg:px-6 xl:px-8 h-full">
//     <div className="space-y-3 sm:space-y-4">
//       <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
//         Africa&apos;s Finest Goods, Delivered Globally
//       </h1>
//       <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 leading-relaxed">
//         Discover authentic products from across Africa. Trusted sourcing, certified quality, direct from the continent.
//       </p>
//     </div>
//     <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
//       <Link href="/categories">
//         <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-yellow-500/25 w-full sm:w-auto">
//           Shop Now
//         </button>
//       </Link>
//       <Link href="/sell">
//         <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full sm:w-auto">
//           Become a Seller
//         </button>
//       </Link>
//     </div>
//     <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 pt-6">
//       {trustBadgesData.map((badge, index) => (
//         <TrustBadge key={index} {...badge} />
//       ))}
//     </div>
//   </div>
// );



// const HeroSection = () => {
//   return (
//     <section className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-green-600 text-white overflow-hidden min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-[85vh] xl:min-h-[90vh]">
//       <div className="absolute inset-0 bg-black/20"></div>
//       <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-20 left-10 w-24 h-24 bg-orange-300/10 rounded-full blur-2xl"></div>
      
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 xl:py-16 h-full">
//         <div className="grid lg:grid-cols-2 gap-8 items-stretch h-full">
//           <div className="order-2 lg:order-1">
//             <HeroContent />
//           </div>
//           <div className="order-1 lg:order-2">
//             <ImageSlideshow images={allHeroImages} />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


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

const SLIDE_DURATION = 5000; // Auto-slide every 5 seconds

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
      className="relative overflow-hidden bg-gradient-to-br from-soko-dark-teal via-soko-dark-brown to-soko-bright-cyan min-h-screen"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Featured products carousel"
      aria-live="polite"
    >
      <div className="relative h-screen">
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

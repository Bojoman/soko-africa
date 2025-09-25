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
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Shield, Truck } from 'lucide-react';

// --- 1. Data and Constants ---

// Paired hero images - food with fabric/attire
const heroImagePairs = [
  {
    food: { src: "/hero/avocado.png", alt: "Fresh African Avocados" },
    fabric: { src: "/hero/Ankara fabric.png", alt: "Authentic Ankara Fabric" }
  },
  {
    food: { src: "/hero/Black beans.png", alt: "Premium Black Beans" },
    fabric: { src: "/hero/Ankara bags.png", alt: "Handcrafted Ankara Bags" }
  },
  {
    food: { src: "/hero/yellow beans.png", alt: "Golden Yellow Beans" },
    fabric: { src: "/hero/ankara bucket hats.png", alt: "Stylish Ankara Bucket Hats" }
  },
  {
    food: { src: "/hero/ndengu.png", alt: "Traditional Ndengu Beans" },
    fabric: { src: "/hero/massai wall art.png", alt: "Maasai Cultural Art" }
  },
  {
    food: { src: "/products/mangoes.png", alt: "Tropical African Mangoes" },
    fabric: { src: "/products/African bracelets.png", alt: "Traditional African Bracelets" }
  },
  {
    food: { src: "/products/avocados in the farm.png", alt: "Farm Fresh Avocados" },
    fabric: { src: "/products/ankara earings.png", alt: "Beautiful Ankara Earrings" }
  }
];

const trustBadgesData = [
  { icon: Shield, title: "Verified Quality", description: "Every product is certified to meet international standards" },
  { icon: Truck, title: "Global Shipping", description: "Reliable delivery to over 150 countries worldwide" }
];


// --- 2. Reusable Sub-Components ---

const TrustBadge = ({ icon: Icon, title, description }) => (
  <div className="flex items-center space-x-3 group">
    <div className="p-2 bg-soko-dark-red/20 rounded-full group-hover:bg-soko-dark-red/30 transition-colors duration-300">
      <Icon className="text-soko-dark-red" size={20} />
    </div>
    <div>
      <span className="font-semibold text-sm lg:text-base block">{title}</span>
      <span className="text-xs lg:text-sm opacity-75 hidden sm:block">{description}</span>
    </div>
  </div>
);

const HeroImage = ({ image, priority = false }) => {
    if (!image) return null; 
    
    return (
      <div className="relative overflow-hidden transition-all duration-1000 ease-in-out group hover:scale-[1.02] shadow-2xl h-full">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500"></div>
      </div>
    );
};

const HeroContent = () => (
  <div className="flex flex-col justify-between text-center lg:text-left h-full p-6 lg:p-12 max-w-2xl mx-auto lg:mx-0">
    {/* Top spacing */}
    <div className="flex-1 flex flex-col justify-center space-y-6 lg:space-y-8">
      {/* Main heading */}
      <div className="space-y-4 lg:space-y-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
          Africa&apos;s Finest Goods,
          <br className="hidden sm:block" />
          <span className="block">Delivered Globally</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl opacity-90 leading-relaxed max-w-lg mx-auto lg:mx-0">
          Discover authentic products from across Africa. Trusted sourcing, certified quality, direct from the continent.
        </p>
      </div>
      
      {/* Call to action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <a href="/categories" className="w-full sm:w-auto">
          <button className="bg-soko-bright-cyan hover:bg-soko-dark-red text-white font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-lg text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full">
            Shop Now
          </button>
        </a>
        <a href="/sell" className="w-full sm:w-auto">
          <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-lg text-base lg:text-lg transition-all duration-300 transform hover:scale-105 w-full">
            Become a Seller
          </button>
        </a>
      </div>
    </div>
    
    {/* Trust badges at bottom */}
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 justify-center lg:justify-start pt-6 lg:pt-8">
      {trustBadgesData.map((badge, index) => (
        <TrustBadge key={index} {...badge} />
      ))}
    </div>
  </div>
);


// --- 3. The Main Component with the ADJUSTED Layout ---

const HeroSection = () => {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPairIndex((prev) => (prev + 1) % heroImagePairs.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentPair = heroImagePairs[currentPairIndex];

  return (
    <section className="min-h-screen bg-gradient-to-br from-soko-orange via-soko-dark-red to-soko-bright-cyan overflow-hidden">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-4 gap-0">
        {/* Text Section - Gradient Background (50% width on large screens) */}
        <div className="relative flex items-center justify-center text-white col-span-1 lg:col-span-2 min-h-[60vh] lg:min-h-screen">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 w-full">
            <HeroContent />
          </div>
        </div>

        {/* Food Image Section (25% width on large screens) */}
        <div className="col-span-1 min-h-[20vh] lg:min-h-screen">
          <HeroImage 
            image={currentPair.food} 
            priority={currentPairIndex === 0}
          />
        </div>

        {/* Fabric/Attire Image Section (25% width on large screens) */}
        <div className="col-span-1 min-h-[20vh] lg:min-h-screen">
          <HeroImage 
            image={currentPair.fabric} 
            priority={currentPairIndex === 0}
          />
        </div>
      </div>
      
      {/* Image transition indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroImagePairs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPairIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentPairIndex 
                ? 'bg-yellow-400 scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

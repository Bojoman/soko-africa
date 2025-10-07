"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import EnhancedFAQSection from '../components/ui/EnhancedFAQSection';
import WhyChooseUsSection from '../components/sections/WhyChooseUsSection';
import { useFAQ } from '../hooks/useFAQ';
import { 
  Globe, 
  Heart, 
  Users, 
  Award, 
  Target, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  MapPin,
  TrendingUp,
  Sparkles,
  Star
} from 'lucide-react';

// Counter animation component with infinite scroll-triggered animation
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const counterRef = useRef(null);
  const animationRef = useRef(null);

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCount(0);
    
    let startTime;
    const endValue = typeof end === 'string' ? parseInt(end.replace(/[^\d]/g, '')) : end;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const currentCount = Math.floor(progress * endValue);
      setCount(currentCount);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          // Cancel animation if element goes out of view
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            setIsAnimating(false);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration]);

  return (
    <span ref={counterRef} className="inline-block">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function AboutPage() {
  const stats = [
    { number: 50000, label: "Happy Customers", icon: Users, suffix: "+" },
    { number: 5000, label: "African Artisans", icon: Heart, suffix: "+" },
    { number: 150, label: "Countries Served", icon: Globe, suffix: "+" },
    { number: 98, label: "Customer Satisfaction", icon: Award, suffix: "%" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "Every product tells a genuine African story, crafted by local artisans with traditional methods.",
      color: "bg-soko-dark-red"
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "We directly support African communities by providing fair wages and sustainable livelihoods.",
      color: "bg-soko-bright-cyan"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting African excellence with customers worldwide through trusted partnerships.",
      color: "bg-soko-dark-teal"
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Rigorous quality standards ensure every product meets international excellence.",
      color: "bg-soko-orange"
    }
  ];



  const { faqs, loading, error } = useFAQ('customer');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section with Bridge Illustration */}
        <section className="relative text-soko-dark-red py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/utility/about_hero.png"
              alt="Global connection network representing SokoAfrica's reach"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-soko-dark-teal/80 via-soko-dark-red/70 to-soko-orange/60"></div>
          </div>
          
          {/* Global connection network overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-2 h-2 bg-soko-cream rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-1 h-1 bg-soko-orange rounded-full animate-pulse delay-100"></div>
            <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-soko-cream rounded-full animate-pulse delay-200"></div>
            <div className="absolute bottom-10 right-10 w-2 h-2 bg-soko-orange rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-soko-bright-cyan rounded-full animate-pulse delay-500"></div>
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-soko-cream rounded-full animate-pulse delay-700"></div>
            
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(236, 230, 204, 0.3)" />
                  <stop offset="50%" stopColor="rgba(3, 177, 208, 0.2)" />
                  <stop offset="100%" stopColor="rgba(237, 149, 42, 0.3)" />
                </linearGradient>
              </defs>
              <path d="M 50 50 Q 200 100 400 80 T 800 120" stroke="url(#connectionGradient)" strokeWidth="1" fill="none" opacity="0.6" />
              <path d="M 100 200 Q 300 150 500 180 T 700 160" stroke="url(#connectionGradient)" strokeWidth="1" fill="none" opacity="0.4" />
              <path d="M 200 300 Q 400 250 600 280 T 900 260" stroke="url(#connectionGradient)" strokeWidth="1" fill="none" opacity="0.5" />
            </svg>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              ABOUT SOKOAFRICA
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              Bridging Africa to the World, One Product at a Time
            </p>
            
            {/* Global Connection Illustration */}
            <div className="mt-12 relative">
              <div className="flex justify-center items-center space-x-8">
                {/* Africa Side */}
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-soko-orange to-soko-orange-red w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg relative">
                    <MapPin className="text-white" size={32} />
                    {/* Pulsing ring effect */}
                    <div className="absolute inset-0 rounded-full bg-soko-orange animate-ping opacity-20"></div>
                  </div>
                  <span className="text-lg font-semibold">AFRICA</span>
                  <div className="flex space-x-1 mt-2">
                    <Star className="text-soko-cream" size={16} />
                    <Star className="text-soko-cream" size={16} />
                    <Star className="text-soko-cream" size={16} />
                  </div>
                </div>
                
                {/* Global Network Bridge */}
                <div className="flex-1 relative">
                  <div className="h-2 bg-gradient-to-r from-soko-orange via-soko-bright-cyan to-soko-cream rounded-full relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="text-soko-bright-cyan" size={20} />
                      </div>
                    </div>
                    {/* Data flow animation */}
                    <div className="absolute top-0 left-0 h-full w-4 bg-white/50 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm opacity-80 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">GLOBAL NETWORK</span>
                  </div>
                </div>
                
                {/* World Side */}
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-soko-bright-cyan to-soko-dark-teal w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg relative">
                    <Globe className="text-white" size={32} />
                    {/* Pulsing ring effect */}
                    <div className="absolute inset-0 rounded-full bg-soko-bright-cyan animate-ping opacity-20"></div>
                  </div>
                  <span className="text-lg font-semibold">WORLD</span>
                  <div className="flex space-x-1 mt-2">
                    <Heart className="text-soko-cream" size={16} />
                    <Heart className="text-soko-cream" size={16} />
                    <Heart className="text-soko-cream" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background Decorative Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-soko-cream/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-soko-dark-red/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-soko-bright-cyan/15 rounded-full blur-2xl"></div>
        </section>
 
        {/* Enhanced Introduction Section */}
        <section className="py-20 bg-gradient-to-br from-soko-cream via-soko-light-blue to-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-soko-cream/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-soko-light-blue/20 rounded-full blur-3xl"></div>
          
          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center bg-soko-orange/10 px-4 py-2 rounded-full">
                  <Sparkles className="text-soko-orange mr-2" size={20} />
                  <span className="text-soko-orange font-semibold">Curated Marketplace</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-soko-dark-red leading-tight">
                  Connecting Global Buyers to Africa's Finest
                </h2>
                
                <div className="space-y-6 text-lg text-gray-700">
                  <p className="flex items-start">
                    <CheckCircle className="text-soko-bright-cyan mr-3 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Premium Products:</strong> From nutrient-rich produce and premium meats to handcrafted products, wellness items, and emerging light manufacturing.</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle className="text-soko-bright-cyan mr-3 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Export Potential:</strong> We unlock Africa's export potential by simplifying trade, building trust, and empowering producers.</span>
                  </p>
                </div>
                
                <div className="flex items-center space-x-6 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-soko-orange">
                      <AnimatedCounter end={54} />
                    </div>
                    <div className="text-sm text-gray-600">African Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-soko-bright-cyan">
                      <AnimatedCounter end={100} suffix="+" />
                    </div>
                    <div className="text-sm text-gray-600">Product Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-soko-dark-teal">24/7</div>
                    <div className="text-sm text-gray-600">Global Support</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Main gradient card similar to the image */}
                <div className="bg-gradient-to-br from-soko-cream via-soko-light-blue/80 to-soko-cream/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                  
                  <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div className="bg-[#F5F5F5] backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="bg-soko-orange w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Heart className="text-white" size={28} />
                      </div>
                      <h4 className="font-bold text-lg text-gray-800 mb-2">Handcrafted</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Authentic African crafts</p>
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="bg-soko-bright-cyan w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Target className="text-white" size={28} />
                      </div>
                      <h4 className="font-bold text-lg text-gray-800 mb-2">Premium Meats</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Quality Nyamazone</p>
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="bg-soko-dark-teal w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Globe className="text-white" size={28} />
                      </div>
                      <h4 className="font-bold text-lg text-gray-800 mb-2">Global Reach</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Worldwide shipping</p>
                    </div>
                    
                    <div className="bg-[#F5F5F5] backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="bg-soko-dark-brown w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Award className="text-white" size={28} />
                      </div>
                      <h4 className="font-bold text-lg text-gray-800 mb-2">Wellness</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Natural products</p>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-soko-orange/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-soko-bright-cyan/20 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section with President's Avatar */}
        <section className="py-16 bg-soko-cream">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-soko-dark-red">Our Mission</h2>
                <p className="text-xl text-gray-700 mb-6">
                  To create a trusted gateway for African products, enabling producers to reach global markets — and buyers to source with confidence, purpose, and impact.
                </p>
                <div className="bg-soko-dark-red p-6 rounded-lg border-l-4 border-soko-orange mb-6">
                  <p className="text-lg text-soko-orange italic mb-4">
                    "Africa has everything the world needs — our job is to make it easier to access it, ethically and at scale."
                  </p>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-4 border-soko-cream">
                      <Image
                        src="/avatars/ceo.png"
                        alt="Peter Karenge - CEO & Founder"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-soko-orange">Peter Karenge</div>
                      <div className="text-sm text-soko-orange">CEO & Founder</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-gray-700 space-y-4 text-lg">
                  <p>
                    We source across key African trade corridors — East, West, Southern Africa — and serve buyers in the U.S., Europe, Asia, and other growth markets. Our growing logistics partnerships and cold-chain capabilities allow us to deliver reliably from farm to port to door.
                  </p>
                  <p>
                    Whether you're a global buyer seeking reliable sourcing or an African producer ready to scale, SokoAfrica is your partner in meaningful, modern trade.
                  </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Buttons Section */}
        <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/categories">
                        <button className="border-2 border-soko-dark-red text-soko-dark-red hover:from-soko-orange-red hover:to-soko-dark-red text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto shadow-lg">
                            Explore Our Products
                        </button>
                    </Link>
                    <Link href="/nyamazone">
                        <button className="border-2 border-soko-orange text-soko-orange hover:bg-gradient-to-r hover:from-soko-orange hover:to-soko-orange-red hover:text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                            Learn About Nyamazone
                        </button>
                    </Link>
                    <Link href="/partner">
                        <button className="border-2 border-soko-bright-cyan text-soko-bright-cyan hover:bg-gradient-to-r hover:from-soko-bright-cyan hover:to-soko-dark-teal hover:text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                            Partner With Us
                        </button>
                    </Link>
                </div>
            </div>
        </section>

        {/* Stats Section with Animation */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-soko-dark-red">Our Impact in Numbers</h2>
              <p className="text-xl text-gray-600">Connecting communities and creating opportunities across Africa</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow group">
                    <div className="bg-soko-orange/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-soko-orange/20 transition-colors">
                      <IconComponent className="text-soko-orange" size={36} />
                    </div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-soko-dark-red">Our Values</h2>
              <p className="text-xl text-grey-600 max-w-3xl mx-auto">
                These core values guide every decision we make and every relationship we build
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="text-center">
                    <div className={`${value.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-soko-orange">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>



        {/* Final CTA Section */}
        <section className="py-20 bg-soko-dark-teal text-white relative overflow-hidden">
          {/* Global network background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-3 h-3 bg-soko-cream rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-2 h-2 bg-soko-bright-cyan rounded-full animate-pulse delay-200"></div>
            <div className="absolute bottom-32 left-40 w-2.5 h-2.5 bg-soko-orange rounded-full animate-pulse delay-400"></div>
            <div className="absolute bottom-20 right-20 w-3 h-3 bg-soko-cream rounded-full animate-pulse delay-600"></div>
            <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-soko-bright-cyan rounded-full animate-pulse delay-800"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-soko-orange rounded-full animate-pulse delay-1000"></div>
            
            {/* Connection network lines */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(3, 177, 208, 0.4)" />
                  <stop offset="50%" stopColor="rgba(237, 149, 42, 0.3)" />
                  <stop offset="100%" stopColor="rgba(236, 230, 204, 0.4)" />
                </linearGradient>
              </defs>
              <circle cx="20%" cy="30%" r="2" fill="rgba(236, 230, 204, 0.6)" />
              <circle cx="80%" cy="20%" r="1.5" fill="rgba(3, 177, 208, 0.6)" />
              <circle cx="70%" cy="70%" r="2.5" fill="rgba(237, 149, 42, 0.6)" />
              <circle cx="30%" cy="80%" r="2" fill="rgba(236, 230, 204, 0.6)" />
              <path d="M 20% 30% Q 50% 10% 80% 20%" stroke="url(#networkGradient)" strokeWidth="1" fill="none" />
              <path d="M 80% 20% Q 90% 45% 70% 70%" stroke="url(#networkGradient)" strokeWidth="1" fill="none" />
              <path d="M 70% 70% Q 50% 90% 30% 80%" stroke="url(#networkGradient)" strokeWidth="1" fill="none" />
              <path d="M 30% 80% Q 10% 55% 20% 30%" stroke="url(#networkGradient)" strokeWidth="1" fill="none" />
            </svg>
          </div>
          
          {/* Background overlay for better readability */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="max-w-4xl mx-auto  px-6 text-center relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-soko-bright-cyan/20 to-soko-orange/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-white/30">
                <Sparkles className="text-soko-cream mr-2" size={20} />
                <span className="text-soko-cream font-semibold">Ready to Connect?</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-soko-dark-red drop-shadow-lg">Join the SokoAfrica Community</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed">
                Whether you're a customer seeking authentic African products, a producer ready to reach global markets, 
                or a partner looking to make an impact—we're here to support your journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-soko-dark-teal backdrop-blur-sm p-6 rounded-xl border border-soko-bright-cyan/30 hover:bg-soko-bright-cyan/30 transition-all duration-300">
                <Users className="text-soko-cream mb-4 mx-auto" size={40} />
                <h3 className="font-semibold text-lg mb-2 text-white">For Customers</h3>
                <p className="text-sm text-white/80">Discover authentic African products with global delivery</p>
              </div>
              <div className="bg-soko-dark-teal backdrop-blur-sm p-6 rounded-xl border border-soko-orange/30 hover:bg-soko-orange/30 transition-all duration-300">
                <Heart className="text-soko-cream mb-4 mx-auto" size={40} />
                <h3 className="font-semibold text-lg mb-2 text-white">For Producers</h3>
                <p className="text-sm text-white/80">Scale your business and reach international markets</p>
              </div>
              <div className="bg-soko-dark-teal backdrop-blur-sm p-6 rounded-xl border border-soko-dark-red/30 hover:bg-soko-dark-red/30 transition-all duration-300">
                <Globe className="text-soko-cream mb-4 mx-auto" size={40} />
                <h3 className="font-semibold text-lg mb-2 text-white">For Partners</h3>
                <p className="text-sm text-white/80">Collaborate with us to create meaningful impact</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories">
                <button className="bg-white hover:from-soko-bright-cyan hover:to-soko-cream text-soko-orange hover:text-white font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto shadow-xl hover:shadow-2xl">
                  Start Shopping
                </button>
              </Link>
              <Link href="/sell">
                <button className="border-2 border-soko-cream text-soko-cream hover:bg-gradient-to-r hover:from-soko-orange hover:to-soko-orange-red hover:text-white hover:border-transparent font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto backdrop-blur-sm">
                  Become a Seller
                </button>
              </Link>
              <Link href="/partner">
                <button className="border-2 border-soko-bright-cyan text-soko-bright-cyan hover:bg-gradient-to-r hover:from-soko-bright-cyan hover:to-soko-dark-teal hover:text-white hover:border-transparent font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto backdrop-blur-sm">
                  Partner With Us
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <WhyChooseUsSection />

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          {faqs && <EnhancedFAQSection faqs={faqs} />}
        </section>

      </main>
      
      <Footer />
    </div>
  );
}

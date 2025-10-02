"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';

// Animated Counter Component with Infinite Animation
const AnimatedCounter = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
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
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const TestimonialsSection = ({ 
  title = "What Our Customers Say",
  className = "text-orange-600" 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "The quality of the Kenyan coffee beans exceeded my expectations. Authentic taste delivered right to my doorstep! The packaging was beautiful and the story behind each product made it even more special.",
      author: {
        name: "James Mitchell",
        location: "London, UK",
        role: "Coffee Enthusiast",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    },
    {
      id: 2,
      rating: 5,
      text: "Beautiful handcrafted jewelry that tells a story. The craftsmanship is incredible and shipping was fast! I love knowing that my purchase directly supports African artisans.",
      author: {
        name: "Sarah Chen",
        location: "Toronto, Canada",
        role: "Fashion Designer",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    },
    {
      id: 3,
      rating: 5,
      text: "Supporting African artisans while getting amazing products. SokoAfrica makes it easy to shop ethically! The quality is outstanding and the customer service is exceptional.",
      author: {
        name: "Marcus Johnson",
        location: "New York, USA",
        role: "Sustainable Living Advocate",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    },
    {
      id: 4,
      rating: 5,
      text: "The Ankara fabrics I ordered are absolutely stunning! The colors are vibrant and the quality is top-notch. Will definitely be ordering more for my upcoming projects.",
      author: {
        name: "Amara Okafor",
        location: "Lagos, Nigeria",
        role: "Fashion Entrepreneur",
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    },
    {
      id: 5,
      rating: 5,
      text: "The shea butter products have transformed my skincare routine. Pure, natural, and ethically sourced. This is exactly what I was looking for!",
      author: {
        name: "Emma Rodriguez",
        location: "Barcelona, Spain",
        role: "Wellness Coach",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={`${
          i < rating 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className={`py-20 bg-gradient-to-br from-soko-cream/30 via-white to-soko-orange/10 relative overflow-hidden ${className}`}>
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-soko-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-soko-bright-cyan/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-soko-orange/10 text-soko-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Quote size={16} />
            <span>Customer Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hear from our global community of customers who trust SokoAfrica for authentic African products
          </p>
        </div>

        {/* Modern Testimonial Slider */}
        <div className="relative mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-soko-orange/10 to-soko-bright-cyan/10 rounded-full blur-2xl"></div>
            
            {/* Quote icon */}
            <div className="absolute top-8 left-8 w-16 h-16 bg-soko-orange/10 rounded-full flex items-center justify-center">
              <Quote className="text-soko-orange" size={24} />
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10 pt-8">
              {/* Star Rating */}
              <div className="flex justify-center mb-6">
                {renderStars(testimonials[currentSlide].rating)}
              </div>
              
              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-gray-800 text-center mb-8 leading-relaxed font-medium">
                "{testimonials[currentSlide].text}"
              </blockquote>
              
              {/* Author Info */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image 
                    src={testimonials[currentSlide].author.avatar}
                    alt={testimonials[currentSlide].author.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
                <div className="ml-6 text-left">
                  <h4 className="font-bold text-lg text-gray-900">
                    {testimonials[currentSlide].author.name}
                  </h4>
                  <p className="text-soko-orange font-medium">
                    {testimonials[currentSlide].author.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonials[currentSlide].author.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-soko-orange hover:text-white transition-all duration-300 group"
            >
              <ArrowLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-soko-orange hover:text-white transition-all duration-300 group"
            >
              <ArrowRight size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-soko-orange w-8'
                    : 'bg-gray-300 hover:bg-gray-400 w-3'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Animated Trust Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-soko-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-soko-orange/20 transition-colors">
              <Quote className="text-soko-orange" size={28} />
            </div>
            <div className="text-4xl font-bold text-soko-orange mb-2">
              <AnimatedCounter end={50000} suffix="+" />
            </div>
            <p className="text-gray-600 font-medium">Happy Customers</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-soko-bright-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-soko-bright-cyan/20 transition-colors">
              <Star className="text-soko-bright-cyan fill-current" size={28} />
            </div>
            <div className="text-4xl font-bold text-soko-bright-cyan mb-2">
              <AnimatedCounter end={4.8} suffix="/5" />
            </div>
            <p className="text-gray-600 font-medium">Average Rating</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-soko-dark-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-soko-dark-teal/20 transition-colors">
              <ArrowRight className="text-soko-dark-teal" size={28} />
            </div>
            <div className="text-4xl font-bold text-soko-dark-teal mb-2">
              <AnimatedCounter end={150} suffix="+" />
            </div>
            <p className="text-gray-600 font-medium">Countries Served</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

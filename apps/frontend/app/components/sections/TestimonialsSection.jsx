"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  SOKO_TESTIMONIALS,
  SOKO_TESTIMONIAL_STATS
} from '../../lib/testimonials';

// Animated Counter Component with Infinite Animation
const AnimatedCounter = ({ end, duration = 2000, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const counterRef = useRef(null);
  const animationRef = useRef(null);

  const endValue = typeof end === 'number' ? end : parseFloat(String(end));
  const isDecimal = !Number.isInteger(endValue);

  const startAnimation = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCount(0);

    let startTime;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const raw = progress * endValue;
      setCount(isDecimal ? Math.round(raw * 10) / 10 : Math.floor(raw));

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
      {prefix}{isDecimal ? count.toFixed(1) : count.toLocaleString()}{suffix}
    </span>
  );
};

function authorInitials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return 'SA';
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

const TestimonialsSection = ({
  title = "Stories from the Soko",
  className = ""
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState(SOKO_TESTIMONIALS);
  const [trustStats, setTrustStats] = useState(SOKO_TESTIMONIAL_STATS);

  useEffect(() => {
    fetch('/api/stats/testimonials')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.testimonials?.length) {
          setTestimonials(data.testimonials);
          setCurrentSlide(0);
        }
        if (data?.stats) {
          setTrustStats({
            happyCustomers:
              data.stats.happyCustomers || SOKO_TESTIMONIAL_STATS.happyCustomers,
            averageRating:
              data.stats.averageRating || SOKO_TESTIMONIAL_STATS.averageRating,
            countriesServed:
              data.stats.countriesServed || SOKO_TESTIMONIAL_STATS.countriesServed
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!testimonials.length) return undefined;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const active = testimonials[currentSlide] || SOKO_TESTIMONIALS[0];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={
          i < rating ? 'text-soko-orange fill-current' : 'text-gray-300'
        }
      />
    ));
  };

  return (
    <section className={`py-20 bg-gradient-to-br from-soko-cream/30 via-white to-soko-orange/10 relative overflow-hidden ${className}`}>
      <div className="absolute top-20 right-10 w-72 h-72 bg-soko-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-soko-bright-cyan/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-soko-orange/10 text-soko-orange px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Quote size={16} />
            <span>Customer &amp; seller voices</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-soko-dark-teal mb-4">{title}</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real notes from buyers and makers across Africa and the diaspora —
            coffee, crafts, textiles, spices, and cold-chain specialties.
          </p>
        </div>

        <div className="relative mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-soko-orange/10 to-soko-bright-cyan/10 rounded-full blur-2xl"></div>

            <div className="absolute top-8 left-8 w-16 h-16 bg-soko-orange/10 rounded-full flex items-center justify-center">
              <Quote className="text-soko-orange" size={24} />
            </div>

            <div className="relative z-10 pt-8" aria-live="polite">
              <div className="flex justify-center mb-6">
                {renderStars(active.rating)}
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-800 text-center mb-8 leading-relaxed font-medium">
                &ldquo;{active.text}&rdquo;
              </blockquote>

              <div className="flex items-center justify-center">
                <div className="relative">
                  {active.author?.avatar ? (
                    <Image
                      src={active.author.avatar}
                      alt={active.author.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-soko-orange to-soko-dark-red border-4 border-white shadow-lg flex items-center justify-center text-lg font-bold text-white tracking-wide">
                      {authorInitials(active.author?.name)}
                    </div>
                  )}
                </div>
                <div className="ml-6 text-left">
                  <h4 className="font-bold text-lg text-soko-dark-teal">
                    {active.author.name}
                  </h4>
                  <p className="text-soko-orange font-medium">
                    {active.author.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {active.author.location}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-soko-orange hover:text-white transition-all duration-300 group"
            >
              <ArrowLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-soko-orange hover:text-white transition-all duration-300 group"
            >
              <ArrowRight size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                aria-label={`Show testimonial ${index + 1}`}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-soko-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-soko-orange/20 transition-colors">
              <Quote className="text-soko-orange" size={28} />
            </div>
            <div className="text-4xl font-bold text-soko-orange mb-2">
              <AnimatedCounter end={trustStats.happyCustomers} suffix="+" />
            </div>
            <p className="text-gray-600 font-medium">Community members</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-soko-bright-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-soko-bright-cyan/20 transition-colors">
              <Star className="text-soko-bright-cyan fill-current" size={28} />
            </div>
            <div className="text-4xl font-bold text-soko-bright-cyan mb-2">
              <AnimatedCounter end={trustStats.averageRating} suffix="/5" />
            </div>
            <p className="text-gray-600 font-medium">Average rating</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 bg-soko-dark-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-soko-dark-teal/20 transition-colors">
              <ArrowRight className="text-soko-dark-teal" size={28} />
            </div>
            <div className="text-4xl font-bold text-soko-dark-teal mb-2">
              <AnimatedCounter end={trustStats.countriesServed} suffix="+" />
            </div>
            <p className="text-gray-600 font-medium">Countries reached</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

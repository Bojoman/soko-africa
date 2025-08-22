"use client";
import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

const TestimonialsSection = ({ 
  title = "What Our Customers Say",
  className = "text-orange-600" 
}) => {
  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "The quality of the Kenyan coffee beans exceeded my expectations. Authentic taste delivered right to my doorstep!",
      author: {
        name: "James Mitchell",
        location: "London, UK",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    },
    {
      id: 2,
      rating: 5,
      text: "Beautiful handcrafted jewelry that tells a story. The craftsmanship is incredible and shipping was fast!",
      author: {
        name: "Sarah Chen",
        location: "Toronto, Canada",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    },
    {
      id: 3,
      rating: 5,
      text: "Supporting African artisans while getting amazing products. SokoAfrica makes it easy to shop ethically!",
      author: {
        name: "Marcus Johnson",
        location: "New York, USA",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={20}
        className={`${
          i < rating 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-orange-50 to-green-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {/* Star Rating */}
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-700 mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              {/* Author Info */}
              <div className="flex items-center">
                <Image 
                  src={testimonial.author.avatar}
                  alt={testimonial.author.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.author.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.author.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trust Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">50,000+</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">150+</div>
            <p className="text-gray-600">Countries Served</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">4.8/5</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

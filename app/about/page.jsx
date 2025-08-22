"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
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
  TrendingUp
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: "50,000+", label: "Happy Customers", icon: Users },
    { number: "5,000+", label: "African Artisans", icon: Heart },
    { number: "150+", label: "Countries Served", icon: Globe },
    { number: "98%", label: "Customer Satisfaction", icon: Award }
  ];

  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "Every product tells a genuine African story, crafted by local artisans with traditional methods.",
      color: "bg-red-500"
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "We directly support African communities by providing fair wages and sustainable livelihoods.",
      color: "bg-blue-500"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting African excellence with customers worldwide through trusted partnerships.",
      color: "bg-green-500"
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Rigorous quality standards ensure every product meets international excellence.",
      color: "bg-orange-500"
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "SokoAfrica Founded",
      description: "Started with a vision to connect African artisans with global markets",
      icon: Lightbulb
    },
    {
      year: "2021",
      title: "1,000 Artisans Onboarded",
      description: "Reached our first major milestone of supporting 1,000 African artisans",
      icon: Users
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded shipping to over 50 countries worldwide",
      icon: Globe
    },
    {
      year: "2023",
      title: "Nyamazone Launch",
      description: "Launched premium meat delivery service across major African cities",
      icon: Target
    },
    {
      year: "2024",
      title: "Sustainable Future",
      description: "Committed to carbon-neutral shipping and sustainable packaging",
      icon: TrendingUp
    }
  ];

  const team = [
    {
      name: "Amara Okafor",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?q=80&w=300&auto=format&fit=crop",
      bio: "Former tech executive with a passion for African heritage and sustainable business."
    },
    {
      name: "Kwame Asante",
      role: "Head of Artisan Relations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      bio: "20+ years connecting with artisan communities across West and East Africa."
    },
    {
      name: "Fatima Hassan",
      role: "Chief Product Officer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      bio: "Expert in e-commerce platforms with a focus on emerging market solutions."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About SokoAfrica
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              We&apos;re on a mission to showcase Africa&apos;s finest products to the world, 
              supporting artisans and communities while delivering authentic quality to global customers.
            </p>
            <div className="flex justify-center">
              <Link href="/sell">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  Join Our Community
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-orange-600" size={32} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    SokoAfrica was born from a simple yet powerful vision: to create a bridge between 
                    Africa&apos;s incredible artisans and the global marketplace. Founded in 2020, we recognized 
                    that while Africa produces some of the world&apos;s finest goods, many talented creators 
                    lacked access to international customers.
                  </p>
                  <p>
                    Our platform was designed to change this narrative. We work directly with artisans, 
                    farmers, and small businesses across the continent, providing them with the tools, 
                    training, and marketplace access they need to thrive in the global economy.
                  </p>
                  <p>
                    Today, SokoAfrica serves as more than just a marketplace—we&apos;re a community that 
                    celebrates African culture, supports sustainable practices, and creates meaningful 
                    connections between creators and customers worldwide.
                  </p>
                </div>
                
                <div className="mt-8">
                  <Link href="/impact">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center">
                      See Our Impact
                      <ArrowRight className="ml-2" size={20} />
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop"
                  alt="African artisans at work"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <MapPin className="text-green-600" size={24} />
                    </div>
                    <div>
                      <div className="text-xl font-bold">54 Countries</div>
                      <div className="text-sm text-gray-600">Across Africa</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                    <h3 className="font-bold text-lg mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-xl text-gray-600">
                Key milestones in our mission to connect Africa with the world
              </p>
            </div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                return (
                  <div key={index} className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-md">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="text-orange-600" size={28} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {milestone.year}
                        </span>
                        <h3 className="font-bold text-lg">{milestone.title}</h3>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Leadership</h2>
              <p className="text-xl text-gray-600">
                Passionate leaders driving our mission forward
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center bg-gray-50 p-6 rounded-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-orange-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-green-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the SokoAfrica Community</h2>
            <p className="text-xl mb-8 opacity-90">
              Whether you&apos;re a customer looking for authentic African products or an artisan 
              ready to share your craft with the world, we&apos;re here to support your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  Start Shopping
                </button>
              </Link>
              <Link href="/sell">
                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  Become a Seller
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

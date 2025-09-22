"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import EnhancedFAQSection from '../components/ui/EnhancedFAQSection';
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

// Counter animation component
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      let startTime;
      const startValue = 0;
      const endValue = typeof end === 'string' ? parseInt(end.replace(/[^\d]/g, '')) : end;
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        const currentCount = Math.floor(progress * endValue);
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setHasAnimated(true);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [end, duration, hasAnimated]);

  return <span>{count.toLocaleString()}{suffix}</span>;
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


  const team = [
    {
      name: "Peter Karenge",
      role: "Founder & CEO",
      image: "/avatars/ceo.png",
      bio: "Visionary leader with extensive experience in African trade and sustainable business development."
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

  const { faqs, loading, error } = useFAQ('customer');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section with Bridge Illustration */}
        <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              ABOUT SOKOAFRICA
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              Bridging Africa to the World, One Product at a Time
            </p>
            
            {/* Bridge Illustration */}
            <div className="mt-12 relative">
              <div className="flex justify-center items-center space-x-8">
                {/* Africa Side */}
                <div className="flex flex-col items-center">
                  <div className="bg-yellow-400 w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <MapPin className="text-orange-800" size={32} />
                  </div>
                  <span className="text-lg font-semibold">AFRICA</span>
                  <div className="flex space-x-1 mt-2">
                    <Star className="text-yellow-400" size={16} />
                    <Star className="text-yellow-400" size={16} />
                    <Star className="text-yellow-400" size={16} />
                  </div>
                </div>
                
                {/* Bridge */}
                <div className="flex-1 relative">
                  <div className="h-2 bg-white/30 rounded-full relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
                        <Sparkles className="text-orange-500" size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm opacity-80">SOKOAFRICA</span>
                  </div>
                </div>
                
                {/* World Side */}
                <div className="flex flex-col items-center">
                  <div className="bg-blue-400 w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Globe className="text-blue-800" size={32} />
                  </div>
                  <span className="text-lg font-semibold">WORLD</span>
                  <div className="flex space-x-1 mt-2">
                    <Heart className="text-red-400" size={16} />
                    <Heart className="text-red-400" size={16} />
                    <Heart className="text-red-400" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background Decorative Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-300/10 rounded-full blur-2xl"></div>
        </section>

        {/* Enhanced Introduction Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center bg-orange-100 px-4 py-2 rounded-full">
                  <Sparkles className="text-orange-600 mr-2" size={20} />
                  <span className="text-orange-600 font-semibold">Curated Marketplace</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  Connecting Global Buyers to Africa's Finest
                </h2>
                
                <div className="space-y-6 text-lg text-gray-700">
                  <p className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Premium Products:</strong> From nutrient-rich produce and premium meats to handcrafted products, wellness items, and emerging light manufacturing.</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                    <span><strong>Export Potential:</strong> We unlock Africa's export potential by simplifying trade, building trust, and empowering producers.</span>
                  </p>
                </div>
                
                <div className="flex items-center space-x-6 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">54</div>
                    <div className="text-sm text-gray-600">African Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">100+</div>
                    <div className="text-sm text-gray-600">Product Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">Global Support</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-100 to-green-100 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                        <Heart className="text-white" size={24} />
                      </div>
                      <h4 className="font-semibold text-gray-900">Handcrafted</h4>
                      <p className="text-sm text-gray-600">Authentic African crafts</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                        <Target className="text-white" size={24} />
                      </div>
                      <h4 className="font-semibold text-gray-900">Premium Meats</h4>
                      <p className="text-sm text-gray-600">Quality Nyamazone</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                        <Globe className="text-white" size={24} />
                      </div>
                      <h4 className="font-semibold text-gray-900">Global Reach</h4>
                      <p className="text-sm text-gray-600">Worldwide shipping</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                        <Award className="text-white" size={24} />
                      </div>
                      <h4 className="font-semibold text-gray-900">Wellness</h4>
                      <p className="text-sm text-gray-600">Natural products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section with President's Avatar */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-orange-600">Our Mission</h2>
                <p className="text-xl text-gray-700 mb-6">
                  To create a trusted gateway for African products, enabling producers to reach global markets — and buyers to source with confidence, purpose, and impact.
                </p>
                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500 mb-6">
                  <p className="text-lg text-gray-700 italic mb-4">
                    "Africa has everything the world needs — our job is to make it easier to access it, ethically and at scale."
                  </p>
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-4 border-orange-200">
                      <Image
                        src="/avatars/ceo.png"
                        alt="Peter Karenge - CEO & Founder"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Peter Karenge</div>
                      <div className="text-sm text-orange-600">CEO & Founder</div>
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
                        <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors w-full sm:w-auto">
                            Explore Our Products
                        </button>
                    </Link>
                    <Link href="/nyamazone">
                        <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors w-full sm:w-auto">
                            Learn About Nyamazone
                        </button>
                    </Link>
                    <Link href="/partner">
                        <button className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors w-full sm:w-auto">
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
              <h2 className="text-3xl font-bold mb-4 text-orange-600">Our Impact in Numbers</h2>
              <p className="text-xl text-gray-600">Connecting communities and creating opportunities across Africa</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                    <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                      <IconComponent className="text-orange-600" size={36} />
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
              <h2 className="text-3xl font-bold mb-4 text-orange-600">Our Values</h2>
              <p className="text-xl text-orange-600 max-w-3xl mx-auto">
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
                    <h3 className="font-bold text-lg mb-3 text-orange-600">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
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
              <h2 className="text-3xl font-bold mb-4 text-orange-600">Meet Our Leadership</h2>
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
                  <h3 className="font-bold text-lg mb-1 text-orange-600">{member.name}</h3>
                  <p className="text-orange-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-green-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full mb-6">
                <Sparkles className="text-yellow-300 mr-2" size={20} />
                <span className="text-yellow-100 font-semibold">Ready to Connect?</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Join the SokoAfrica Community</h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Whether you're a customer seeking authentic African products, a producer ready to reach global markets, 
                or a partner looking to make an impact—we're here to support your journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <Users className="text-yellow-300 mb-4 mx-auto" size={40} />
                <h3 className="font-semibold text-lg mb-2">For Customers</h3>
                <p className="text-sm opacity-90">Discover authentic African products with global delivery</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <Heart className="text-yellow-300 mb-4 mx-auto" size={40} />
                <h3 className="font-semibold text-lg mb-2">For Producers</h3>
                <p className="text-sm opacity-90">Scale your business and reach international markets</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <Globe className="text-yellow-300 mb-4 mx-auto" size={40} />
                <h3 className="font-semibold text-lg mb-2">For Partners</h3>
                <p className="text-sm opacity-90">Collaborate with us to create meaningful impact</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors w-full sm:w-auto">
                  Start Shopping
                </button>
              </Link>
              <Link href="/sell">
                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors w-full sm:w-auto">
                  Become a Seller
                </button>
              </Link>
              <Link href="/partner">
                <button className="border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors w-full sm:w-auto">
                  Partner With Us
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          {faqs && <EnhancedFAQSection faqs={faqs} />}
        </section>

      </main>
      
      <Footer />
    </div>
  );
}

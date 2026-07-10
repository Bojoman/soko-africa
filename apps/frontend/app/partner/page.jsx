"use client";
import React from 'react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import EnhancedFAQSection from '../components/ui/EnhancedFAQSection';
import { useFAQ } from '../hooks/useFAQ';
import { 
  Handshake, 
  Truck, 
  Cpu, 
  Users,
  TrendingUp,
  Award,
  Shield,
  Sparkles,
  MapPin,
  Heart
} from 'lucide-react';

export default function PartnerPage() {
  const { faqs, loading, error } = useFAQ('partner');

  const partnershipTypes = [
    {
      icon: Truck,
      title: "Logistics Partners",
      description: "Help us deliver fresh African products from farm to table - across cities, borders, and oceans.",
      color: "bg-soko-bright-cyan",
      details: [
        "Cold chain transport for meats & produce",
        "Last-mile delivery in major African cities",
        "International shipping to global customers"
      ]
    },
    {
      icon: Cpu,
      title: "Technology Partners",
      description: "Build solutions that help African artisans, farmers, and sellers reach the world.",
      color: "bg-soko-dark-teal",
      details: [
        "Payment systems that work across Africa",
        "Inventory & supply chain tools",
        "Analytics that empower sellers"
      ]
    },
    {
      icon: Users,
      title: "Marketing Partners",
      description: "Share African stories, products, and craftsmanship with the world.",
      color: "bg-soko-orange",
      details: [
        "Co-create content about African makers",
        "Influencer collaborations",
        "Cultural storytelling campaigns"
      ]
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Real Revenue Growth",
      description: "Tap into our growing customer base. We've seen 40% quarter-over-quarter growth."
    },
    {
      icon: Award,
      title: "Stand Out",
      description: "Get featured as a trusted partner. Badges, co-branding, and shared marketing."
    },
    {
      icon: Shield,
      title: "Trusted Network",
      description: "Join vetted partners who meet our quality and ethics standards."
    },
    {
      icon: Sparkles,
      title: "Easy Integration",
      description: "Our team helps you get set up. Average onboarding: 2 weeks."
    }
  ];

  const stats = [
    { number: "500+", label: "Active Partners" },
    { number: "15", label: "Countries" },
    { number: "98%", label: "Partner Retention" },
    { number: "$2M+", label: "Partner Revenue" }
  ];

  return (
    <div className="min-h-screen bg-soko-cream/30">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-soko-dark-teal text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block bg-soko-bright-cyan/20 text-soko-bright-cyan px-4 py-1 rounded-full text-sm font-medium mb-6">
                Grow With Us
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Partner with Soko Africa
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-soko-light-blue/90">
                Help us connect African farmers, artisans, and creators with customers worldwide. 
                Together, we build bridges, not walls.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-soko-orange hover:bg-soko-orange-red text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  Become a Partner
                </button>
                <button className="border-2 border-soko-cream text-soko-cream hover:bg-soko-cream hover:text-soko-dark-teal font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                  See Our Partners
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white border-b border-soko-dark-teal/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-bold text-soko-orange-red mb-1">{stat.number}</div>
                  <div className="text-soko-dark-teal/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                How You Can Help
              </span>
              <h2 className="text-3xl font-bold text-soko-dark-teal mb-4">
                Partnership Opportunities
              </h2>
              <p className="text-lg text-soko-dark-brown/70 max-w-2xl mx-auto">
                We're looking for partners who share our mission: creating opportunity 
                for African makers and bringing authentic products to the world.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partnershipTypes.map((type, index) => {
                const IconComponent = type.icon;
                return (
                  <div key={index} className="bg-soko-cream/30 rounded-xl p-8 hover:shadow-lg transition-shadow border border-soko-dark-teal/10">
                    <div className={`${type.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                      <IconComponent className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-soko-dark-teal mb-4">{type.title}</h3>
                    <p className="text-soko-dark-brown/70 mb-4">
                      {type.description}
                    </p>
                    <ul className="text-sm text-soko-dark-brown/60 space-y-2">
                      {type.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-soko-orange mr-2">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-soko-dark-teal">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-bright-cyan font-semibold text-sm uppercase tracking-wider mb-2">
                What You Get
              </span>
              <h2 className="text-3xl font-bold text-soko-cream mb-4">
                Partnership Benefits
              </h2>
              <p className="text-lg text-soko-light-blue/80">
                We believe in partnerships that work for everyone
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-soko-cream/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-soko-orange" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-soko-cream mb-2">{benefit.title}</h3>
                    <p className="text-soko-light-blue/80 text-sm">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Partner Story */}
        <section className="py-16 bg-soko-cream/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                  Partner Story
                </span>
                <h2 className="text-3xl font-bold text-soko-dark-teal mb-6">
                  "Soko Africa helped us grow 300% in 6 months"
                </h2>
                <p className="text-soko-dark-brown/70 mb-4">
                  FreshFarm Logistics started as a small delivery service in Nairobi. 
                  After partnering with Soko Africa, we've expanded to 5 cities and 
                  now employ 50 drivers - all delivering fresh African products to happy customers.
                </p>
                <p className="text-soko-dark-brown/70 mb-6">
                  "It's not just business. We're helping African farmers reach markets they 
                  never thought possible. That's what makes this partnership special."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-soko-dark-teal rounded-full flex items-center justify-center text-white font-bold">
                    JM
                  </div>
                  <div>
                    <div className="font-semibold text-soko-dark-teal">James Mutua</div>
                    <div className="text-sm text-soko-dark-brown/60">CEO, FreshFarm Logistics</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-soko-dark-teal/5 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-soko-orange-red">300%</div>
                    <div className="text-sm text-soko-dark-brown/60">Revenue Growth</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-soko-orange-red">5</div>
                    <div className="text-sm text-soko-dark-brown/60">Cities Served</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-soko-orange-red">50</div>
                    <div className="text-sm text-soko-dark-brown/60">Jobs Created</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-soko-orange-red">2,500+</div>
                    <div className="text-sm text-soko-dark-brown/60">Deliveries/Month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                Common Questions
              </span>
              <h2 className="text-3xl font-bold text-soko-dark-teal">Partner FAQ</h2>
            </div>
            {faqs && <EnhancedFAQSection faqs={faqs} userType="partner" />}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-soko-dark-brown text-soko-cream">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="inline-block bg-soko-orange/20 text-soko-orange px-4 py-1 rounded-full text-sm font-medium mb-4">
              Join the Movement
            </span>
            <h2 className="text-3xl font-bold mb-4">Ready to Partner?</h2>
            <p className="text-xl mb-8 text-soko-cream/80">
              Let's talk about how we can work together to create opportunities 
              across Africa. No corporate jargon - just real partnership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-soko-orange hover:bg-soko-orange-red text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                Apply for Partnership
              </button>
              <button className="border-2 border-soko-cream text-soko-cream hover:bg-soko-cream hover:text-soko-dark-brown font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                Email Us: partners@sokoafrica.com
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

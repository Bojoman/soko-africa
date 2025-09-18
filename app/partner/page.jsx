"use client";
import React from 'react';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import EnhancedFAQSection from '../components/ui/EnhancedFAQSection';
import { useFAQ } from '../hooks/useFAQ';
import { 
  Handshake, 
  Network, 
  Globe, 
  TrendingUp,
  Users,
  Award,
  Shield,
  Zap
} from 'lucide-react';

export default function PartnerPage() {
  const { faqs, loading, error } = useFAQ('partner');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-6">
              <Handshake size={48} className="mr-4" />
              <h1 className="text-4xl lg:text-5xl font-bold">
                Partner with SokoAfrica
              </h1>
            </div>
            <p className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              Join our network of partners and help us connect Africa to the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                Become a Partner
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                Explore Opportunities
              </button>
            </div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Partnership Opportunities
              </h2>
              <p className="text-lg text-gray-600">
                Multiple ways to partner with us and grow together
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Network className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Logistics Partners</h3>
                <p className="text-gray-600 mb-4">
                  Help us deliver African products worldwide with your shipping and logistics expertise.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• International shipping networks</li>
                  <li>• Customs clearance expertise</li>
                  <li>• Last-mile delivery services</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Globe className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology Partners</h3>
                <p className="text-gray-600 mb-4">
                  Integrate your technology solutions to enhance our platform capabilities.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Payment processing systems</li>
                  <li>• Analytics and insights tools</li>
                  <li>• Marketing automation platforms</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Partners</h3>
                <p className="text-gray-600 mb-4">
                  Collaborate on marketing initiatives to reach new audiences and markets.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Co-marketing campaigns</li>
                  <li>• Influencer partnerships</li>
                  <li>• Content collaborations</li>
                </ul>
              </div>
        </div>
      </div>
    </section>

    {/* Benefits Section */}
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Partnership Benefits
          </h2>
          <p className="text-lg text-gray-600">
            What you get when you partner with SokoAfrica
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-orange-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Revenue Growth</h3>
            <p className="text-gray-600">Access to our growing customer base and revenue sharing opportunities</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Brand Recognition</h3>
            <p className="text-gray-600">Co-marketing support and brand visibility in African markets</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted Network</h3>
            <p className="text-gray-600">Join our network of verified partners and trusted service providers</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Integration</h3>
            <p className="text-gray-600">Quick and easy integration with our platform and systems</p>
          </div>
        </div>
      </div>
    </section>

    {/* FAQ Section */}
    <section className="py-16 bg-white">
      {faqs && <EnhancedFAQSection faqs={faqs} userType="partner" />}
    </section>

    {/* CTA Section */}
    <section className="py-16 bg-gradient-to-r from-orange-500 to-green-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Partner with Us?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join our network and help us build bridges between Africa and the world
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
            Apply for Partnership
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
            Contact Partnership Team
          </button>
        </div>
      </div>
    </section>
  </main>
  
  <Footer />
</div>
);
}
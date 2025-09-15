import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { DollarSign, TrendingUp, Users, Share } from 'lucide-react';

export const metadata = {
  title: "Affiliate Program - SokoAfrica",
  description: "Earn money by promoting authentic African products. Join the SokoAfrica affiliate program."
};

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <DollarSign className="w-20 h-20" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Affiliate Program</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Earn up to 10% commission by promoting authentic African products. 
              Join thousands of affiliates spreading African culture worldwide.
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Join Program
            </button>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: <DollarSign className="w-12 h-12 text-green-600" />, title: "High Commissions", desc: "Earn up to 10% on every sale" },
                { icon: <TrendingUp className="w-12 h-12 text-blue-600" />, title: "Growing Market", desc: "African products are trending globally" },
                { icon: <Users className="w-12 h-12 text-purple-600" />, title: "Community", desc: "Join our affiliate community" },
                { icon: <Share className="w-12 h-12 text-orange-600" />, title: "Easy Sharing", desc: "Professional marketing materials provided" }
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-center mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

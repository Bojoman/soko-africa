import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Beef, Shield, Truck, Users } from 'lucide-react';

export const metadata = {
  title: "Nyamazone Suppliers - SokoAfrica",
  description: "Join Nyamazone as a premium meat supplier. Quality African meat products for global markets."
};

export default function SuppliersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Beef className="w-20 h-20" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Nyamazone Suppliers</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Partner with Nyamazone to supply premium African meat products to global markets. 
              Join our network of trusted suppliers.
            </p>
            <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Become a Supplier
            </button>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Partner with Nyamazone?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: <Shield className="w-12 h-12 text-green-600" />, title: "Quality Standards", desc: "Rigorous quality controls and certifications" },
                { icon: <Truck className="w-12 h-12 text-blue-600" />, title: "Global Reach", desc: "Access to international markets" },
                { icon: <Users className="w-12 h-12 text-purple-600" />, title: "Support", desc: "Dedicated supplier support team" },
                { icon: <Beef className="w-12 h-12 text-red-600" />, title: "Premium Products", desc: "Focus on high-quality African meats" }
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

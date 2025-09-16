import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Building, TrendingUp, Globe, Shield, Users, Zap } from 'lucide-react';

export const metadata = {
  title: "SokoAfrica Business - B2B Solutions",
  description: "Wholesale African products for businesses. Bulk orders, custom sourcing, and B2B solutions."
};

export default function BusinessPage() {
  const features = [
    {
      icon: <Building className="w-12 h-12 text-blue-600" />,
      title: "Bulk Ordering",
      description: "Volume discounts and streamlined procurement for large orders"
    },
    {
      icon: <Globe className="w-12 h-12 text-green-600" />,
      title: "Global Sourcing",
      description: "Access to verified suppliers across 20+ African countries"
    },
    {
      icon: <Shield className="w-12 h-12 text-purple-600" />,
      title: "Quality Assurance",
      description: "Rigorous quality control and authenticity verification"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-orange-600" />,
      title: "Market Insights",
      description: "Data-driven insights on African product trends and markets"
    }
  ];

  const solutions = [
    {
      title: "Retail Partnerships",
      description: "Stock authentic African products in your retail stores",
      benefits: ["Curated product collections", "Drop-shipping options", "Marketing support", "Exclusive regional rights"],
      cta: "Become a Retailer"
    },
    {
      title: "Corporate Gifting",
      description: "Meaningful corporate gifts that support African artisans",
      benefits: ["Custom packaging", "Bulk discounts", "Impact reporting", "White-label options"],
      cta: "Request Quote"
    },
    {
      title: "Restaurant & Hotels",
      description: "Authentic African ingredients and decor for hospitality",
      benefits: ["Regular supply schedules", "Seasonal specialties", "Menu consultation", "Staff training"],
      cta: "Get Started"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">SokoAfrica Business</h1>
              <p className="text-2xl mb-8">
                Wholesale solutions for businesses looking to source authentic African products. 
                Connect your business with Africa's finest suppliers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                  Request Demo
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors">
                  View Catalog
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose SokoAfrica Business?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Streamlined B2B solutions designed for businesses of all sizes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Business Solutions</h2>
              <p className="text-xl text-gray-600">
                Tailored solutions for different business needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {solutions.map((solution, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{solution.title}</h3>
                  <p className="text-gray-600 mb-6">{solution.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {solution.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    {solution.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Trusted by Businesses Worldwide</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Business Partners" },
                { number: "50K+", label: "Products Sourced" },
                { number: "25", label: "Countries Served" },
                { number: "98%", label: "Customer Satisfaction" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
                <p className="text-xl text-gray-600">
                  Contact our B2B team to discuss your specific requirements
                </p>
              </div>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Company Name</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" type="text" />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Contact Person</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" type="text" />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" type="email" />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Business Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                    <option>Retail Store</option>
                    <option>Restaurant/Hotel</option>
                    <option>Corporate</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Tell us about your requirements</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" rows="4"></textarea>
                </div>
                
                <div className="md:col-span-2 text-center">
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 rounded-lg font-bold text-lg transition-colors">
                    Submit Inquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Shield, FileText, Clock, Globe } from 'lucide-react';

export const metadata = {
  title: "Policies - SokoAfrica",
  description: "Our comprehensive policies and guidelines for shopping on SokoAfrica marketplace."
};

export default function PoliciesPage() {
  const policies = [
    {
      title: "Return Policy",
      icon: <Shield className="w-8 h-8 text-orange-600" />,
      description: "30-day return policy for all products",
      details: [
        "Items must be returned within 30 days of delivery",
        "Products must be in original condition",
        "Free return shipping for defective items",
        "Refunds processed within 5-7 business days"
      ]
    },
    {
      title: "Shipping Policy",
      icon: <Globe className="w-8 h-8 text-green-600" />,
      description: "Global shipping with tracking",
      details: [
        "Free shipping on orders over $75",
        "Express shipping available",
        "International shipping to 50+ countries",
        "Real-time tracking provided"
      ]
    },
    {
      title: "Quality Guarantee",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      description: "Authentic African products guaranteed",
      details: [
        "All products verified for authenticity",
        "Quality control checks before shipping",
        "Direct partnerships with African artisans",
        "100% satisfaction guarantee"
      ]
    },
    {
      title: "Processing Time",
      icon: <Clock className="w-8 h-8 text-purple-600" />,
      description: "Fast order processing",
      details: [
        "Orders processed within 24 hours",
        "Custom items may take 2-5 days",
        "Weekend orders processed on Monday",
        "Holiday processing schedules apply"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Policies</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing you with the best shopping experience. 
            Here are our policies to ensure transparency and trust.
          </p>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {policies.map((policy, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {policy.icon}
                <h2 className="text-2xl font-bold text-gray-800 ml-3">{policy.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{policy.description}</p>
              <ul className="space-y-2">
                {policy.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Security</h3>
              <p className="text-gray-600 mb-4">
                All payments are processed securely through encrypted connections. 
                We accept major credit cards, PayPal, and mobile money payments.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Support</h3>
              <p className="text-gray-600 mb-4">
                Our customer support team is available 24/7 to assist with any questions 
                or concerns about your order or our policies.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12 p-8 bg-orange-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Questions About Our Policies?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about our policies, please don't hesitate to contact us.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

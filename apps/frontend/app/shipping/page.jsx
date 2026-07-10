import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Truck, Globe, Clock, Package } from 'lucide-react';

export const metadata = {
  title: "Shipping Information - SokoAfrica",
  description: "Shipping rates, delivery times, and international shipping information for SokoAfrica."
};

export default function ShippingPage() {
  const shippingZones = [
    {
      zone: "East Africa",
      countries: ["Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi"],
      standardTime: "2-5 business days",
      expressTime: "1-3 business days",
      freeThreshold: "$50"
    },
    {
      zone: "Rest of Africa",
      countries: ["Nigeria", "Ghana", "South Africa", "Morocco", "Egypt", "Others"],
      standardTime: "5-10 business days", 
      expressTime: "3-7 business days",
      freeThreshold: "$75"
    },
    {
      zone: "Europe & North America",
      countries: ["USA", "Canada", "UK", "Germany", "France", "Others"],
      standardTime: "7-14 business days",
      expressTime: "5-10 business days", 
      freeThreshold: "$100"
    },
    {
      zone: "Rest of World",
      countries: ["Asia", "Australia", "South America"],
      standardTime: "10-21 business days",
      expressTime: "7-14 business days",
      freeThreshold: "$150"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shipping Information</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We ship authentic African products worldwide with reliable delivery and tracking.
          </p>
        </div>

        {/* Shipping Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Global Shipping</h3>
            <p className="text-gray-600 text-sm">We deliver to 50+ countries worldwide</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Package className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Packaging</h3>
            <p className="text-gray-600 text-sm">Eco-friendly packaging that protects your items</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-time Tracking</h3>
            <p className="text-gray-600 text-sm">Track your package from dispatch to delivery</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Truck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast Processing</h3>
            <p className="text-gray-600 text-sm">Orders processed within 24 hours</p>
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Shipping Zones & Rates</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {shippingZones.map((zone, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{zone.zone}</h3>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Countries:</h4>
                  <p className="text-gray-600 text-sm">{zone.countries.join(", ")}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Standard Shipping</h4>
                    <p className="text-gray-600 text-sm">{zone.standardTime}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-1">Express Shipping</h4>
                    <p className="text-gray-600 text-sm">{zone.expressTime}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-semibold">
                    Free shipping on orders over {zone.freeThreshold}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping FAQs */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping FAQs</h2>
          
          <div className="space-y-6">
            {[
              {
                question: "How are shipping costs calculated?",
                answer: "Shipping costs are based on package weight, dimensions, destination, and selected delivery speed. You'll see the exact cost during checkout before completing your order."
              },
              {
                question: "Do you offer free shipping?",
                answer: "Yes! We offer free standard shipping when your order meets the minimum threshold for your region. Express shipping is available for an additional fee."
              },
              {
                question: "Can I track my package?",
                answer: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your orders in your account dashboard."
              },
              {
                question: "What if my package is delayed?",
                answer: "While we work with reliable carriers, delays can occasionally happen due to customs, weather, or other factors beyond our control. We'll keep you updated and help resolve any issues."
              },
              {
                question: "Are there any additional fees or duties?",
                answer: "For international shipments, customs duties and taxes may apply based on your country's regulations. These fees are not included in our shipping costs and are the customer's responsibility."
              },
              {
                question: "Can I change my shipping address after ordering?",
                answer: "You can modify your shipping address within 2 hours of placing your order. After that, please contact customer support immediately as we may not be able to make changes once processing begins."
              }
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600 mb-4">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-orange-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Questions About Your Shipment?</h2>
          <p className="text-gray-600 mb-6">
            Our customer support team is here to help with any shipping questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact Support
            </a>
            <a href="/help" className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-8 py-3 rounded-lg font-semibold transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

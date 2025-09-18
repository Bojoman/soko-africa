import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Search, MessageCircle, Phone, Mail, Book, Users } from 'lucide-react';
import EnhancedFAQSection from '../components/ui/EnhancedFAQSection'; // Corrected import
import { Suspense } from 'react';

async function fetchFaqs() {
  // In a real app, this would be an absolute URL
  const res = await fetch('http://localhost:3000/api/faqs?userType=customer', {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch FAQs');
  }
  const data = await res.json();
  return data.faqs;
}

function FaqList({ faqs }) {
  return (
    <EnhancedFAQSection
      faqs={faqs}
      title="Frequently Asked Questions"
      subtitle="Find answers to common questions about our platform."
    />
  );
}

export default async function HelpPage() {
  const faqs = await fetchFaqs();
  
  const helpCategories = [
    {
      title: "Order & Shipping",
      icon: <Book className="w-8 h-8 text-orange-600" />,
      topics: ["Track your order", "Shipping information", "Delivery times", "Order modifications", "International shipping"]
    },
    {
      title: "Returns & Refunds",
      icon: <Users className="w-8 h-8 text-green-600" />,
      topics: ["Return policy", "How to return items", "Refund process", "Exchange products", "Damaged items"]
    },
    {
      title: "Account & Payment",
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      topics: ["Create account", "Payment methods", "Billing issues", "Password reset", "Account security"]
    },
    {
      title: "Products & Sellers",
      icon: <Search className="w-8 h-8 text-purple-600" />,
      topics: ["Product authenticity", "Seller information", "Product reviews", "Size guides", "Care instructions"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to your questions or get in touch with our support team.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  {category.icon}
                  <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-4">{category.title}</h3>
                  <ul className="space-y-2 w-full">
                    {category.topics.map((topic, idx) => (
                      <li key={idx}>
                        <a href="#" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">
                          {topic}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <Suspense fallback={<div>Loading FAQs...</div>}>
            <FaqList faqs={faqs} />
          </Suspense>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Still Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our support team</p>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Start Chat
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">+254 700 123 456</p>
              <p className="text-sm text-gray-500">Mon-Fri: 8AM-8PM EAT</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">support@sokoafrica.com</p>
              <p className="text-sm text-gray-500">Response within 24 hours</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

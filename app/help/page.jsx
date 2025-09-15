import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Search, MessageCircle, Phone, Mail, Book, Users } from 'lucide-react';

export const metadata = {
  title: "Help Center - SokoAfrica",
  description: "Get help with your SokoAfrica orders, account, and shopping questions."
};

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Order & Shipping",
      icon: <Book className="w-8 h-8 text-orange-600" />,
      topics: [
        "Track your order",
        "Shipping information",
        "Delivery times",
        "Order modifications",
        "International shipping"
      ]
    },
    {
      title: "Returns & Refunds",
      icon: <Users className="w-8 h-8 text-green-600" />,
      topics: [
        "Return policy",
        "How to return items",
        "Refund process",
        "Exchange products",
        "Damaged items"
      ]
    },
    {
      title: "Account & Payment",
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      topics: [
        "Create account",
        "Payment methods",
        "Billing issues",
        "Password reset",
        "Account security"
      ]
    },
    {
      title: "Products & Sellers",
      icon: <Search className="w-8 h-8 text-purple-600" />,
      topics: [
        "Product authenticity",
        "Seller information",
        "Product reviews",
        "Size guides",
        "Care instructions"
      ]
    }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary by location. Domestic orders typically arrive within 3-7 business days, while international orders take 7-21 business days."
    },
    {
      question: "Can I return a product if I don't like it?",
      answer: "Yes! We offer a 30-day return policy for most items. Products must be in original condition with tags attached."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track orders in your account dashboard."
    },
    {
      question: "Are the products authentic?",
      answer: "Absolutely! We work directly with verified African artisans and suppliers to ensure all products are authentic and high-quality."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards (Visa, Mastercard, Amex), PayPal, and mobile money payments (M-Pesa, Airtel Money)."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to your questions or get in touch with our support team.
          </p>
          
          {/* Search Bar */}
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

        {/* Help Categories */}
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

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
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

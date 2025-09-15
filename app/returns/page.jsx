import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { RotateCcw, Package, CheckCircle, Clock } from 'lucide-react';

export const metadata = {
  title: "Returns & Replacements - SokoAfrica",
  description: "Easy returns and exchanges for your SokoAfrica purchases."
};

export default function ReturnsPage() {
  const returnProcess = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Start your return request within 30 days of delivery",
      icon: <RotateCcw className="w-8 h-8 text-orange-600" />
    },
    {
      step: 2,
      title: "Package Items",
      description: "Pack items in original condition with all accessories",
      icon: <Package className="w-8 h-8 text-blue-600" />
    },
    {
      step: 3,
      title: "Ship Back",
      description: "Use our prepaid shipping label for easy returns",
      icon: <Clock className="w-8 h-8 text-purple-600" />
    },
    {
      step: 4,
      title: "Get Refund",
      description: "Receive refund within 5-7 business days after processing",
      icon: <CheckCircle className="w-8 h-8 text-green-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Returns & Replacements</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We want you to love your purchase. If you're not completely satisfied, 
            we make returns and exchanges easy.
          </p>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">How Returns Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {returnProcess.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <div className="flex justify-center mb-4">
                    {step.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{step.step}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Policy */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Return Policy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What Can Be Returned</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Items in original condition</li>
                <li>• Products with original packaging</li>
                <li>• Items returned within 30 days</li>
                <li>• Unused products with tags attached</li>
                <li>• Items not on our restricted list</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What Cannot Be Returned</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Personalized or custom items</li>
                <li>• Perishable goods (food, flowers)</li>
                <li>• Used or damaged items</li>
                <li>• Items without original packaging</li>
                <li>• Final sale items</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Start Return */}
        <div className="bg-orange-50 rounded-lg p-8 text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Need to Return Something?</h2>
          <p className="text-gray-600 mb-6">
            Start your return process now. You'll need your order number and email address.
          </p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors">
            Start Return Request
          </button>
        </div>

        {/* FAQs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "How long do I have to return an item?",
                answer: "You have 30 days from the delivery date to initiate a return. Some items may have different return windows - check your order details."
              },
              {
                question: "Who pays for return shipping?",
                answer: "We provide free return shipping labels for defective or incorrect items. For other returns, return shipping costs may apply."
              },
              {
                question: "How long does it take to process a refund?",
                answer: "Once we receive your returned item, refunds are processed within 5-7 business days. The refund will appear on your original payment method."
              },
              {
                question: "Can I exchange an item instead of returning it?",
                answer: "Yes! During the return process, you can choose to exchange for a different size, color, or similar item instead of receiving a refund."
              },
              {
                question: "What if my item arrived damaged?",
                answer: "Contact us immediately with photos of the damaged item. We'll provide a prepaid return label and expedite your replacement or refund."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Our customer support team is here to help with any return questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Contact Support
            </a>
            <a href="/help" className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors">
              Visit Help Center
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

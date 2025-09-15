"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../components/ui/Header';
import { 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Truck, 
  UserPlus, 
  Upload, 
  Settings, 
  Package,
  MessageCircle,
  Mail,
  Calendar,
  Download,
  FileText,
  Check,
  ArrowRight
} from 'lucide-react';

const PartnerPage = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    businessRegNumber: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      accountName: ''
    }
  });

  const benefits = [
    {
      icon: ShoppingBag,
      title: "Easy setup and product listing",
      description: "Get started quickly with our intuitive seller interface"
    },
    {
      icon: Users,
      title: "Access to a large customer base",
      description: "Reach thousands of customers globally through our platform"
    },
    {
      icon: CreditCard,
      title: "Transparent payment system",
      description: "Secure payments with clear fee structure and timely payouts"
    },
    {
      icon: Truck,
      title: "Support for logistics and promotions",
      description: "Get help with shipping and marketing your products"
    }
  ];

  const steps = [
    {
      icon: UserPlus,
      number: "1",
      title: "Create a Seller Account",
      description: "Register and get verified to start selling"
    },
    {
      icon: Upload,
      number: "2", 
      title: "Upload Your Products",
      description: "Add your products with photos and descriptions"
    },
    {
      icon: Settings,
      number: "3",
      title: "Manage Your Store", 
      description: "Use our dashboard to track orders and sales"
    },
    {
      icon: Package,
      number: "4",
      title: "Order Fulfillment",
      description: "Choose self-shipping or our fulfillment service"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions to continue.');
      return;
    }
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Application submitted! You will receive confirmation within 24-48 hours.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">PARTNER WITH US</h1>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">For Producers/Suppliers/Sellers</h2>
            <p className="text-xl mb-8">
              Are you an African entrepreneur longing to sell your products globally?
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8">
              <p className="text-lg">
                Welcome to SokoAfrica, your gateway to reaching thousands of customers globally. 
                Whether you're a small business, artisan, or established brand, our platform 
                empowers you to sell African products with ease and grow your business online.
              </p>
            </div>
            <Link href="#apply">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center gap-2">
                Apply to Join SokoAfrica <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Sell With Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
                     <h2 className="text-4xl font-bold text-center mb-12 text-orange-600">
             🛒 Why Sell with Us?
           </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <IconComponent className="mx-auto mb-4 text-orange-500" size={48} />
                  <h3 className="font-semibold text-lg mb-2 text-amber-400">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
                     <h2 className="text-4xl font-bold text-center mb-12 text-orange-600">
             Step-by-Step Guide to Get Started
           </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                      {step.number}
                    </div>
                    <IconComponent className="text-orange-500" size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-amber-400">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seller Registration Form */}
      <section id="apply" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
                     <h2 className="text-4xl font-bold text-center mb-12 text-orange-600">
             🔐 Create a Seller Account
           </h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+254 XXX XXX XXX"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select business type</option>
                    <option value="individual">Individual/Artisan</option>
                    <option value="small-business">Small Business</option>
                    <option value="established-brand">Established Brand</option>
                    <option value="cooperative">Cooperative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    name="businessRegNumber"
                    value={formData.businessRegNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Registration number (if applicable)"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="border-t pt-6">
                                 <h3 className="text-lg font-semibold mb-4 text-orange-600">Bank Details for Payments</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bankDetails.bankName"
                      value={formData.bankDetails.bankName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Bank name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="bankDetails.accountNumber"
                      value={formData.bankDetails.accountNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Account number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name *
                    </label>
                    <input
                      type="text"
                      name="bankDetails.accountName"
                      value={formData.bankDetails.accountName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Account holder name"
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="border-t pt-6">
                                 <h3 className="text-lg font-semibold mb-4 text-orange-600">Document Upload</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID or Business Certificate *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG format</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration Certificate
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional - PDF, JPG, or PNG format</p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms-sellers" className="text-orange-500 hover:underline">
                      Seller Terms and Conditions
                    </Link>
                    {' '}and confirm that all information provided is accurate. *
                  </label>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={!agreedToTerms}
                  className={`px-8 py-4 rounded-lg text-lg font-semibold transition-colors ${
                    agreedToTerms
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Application
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Application review takes 24-48 hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Product Upload Guidelines */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
                     <h2 className="text-4xl font-bold text-center mb-12 text-orange-600">
             🛍️ Upload Your Products
           </h2>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Template */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                             <h3 className="text-2xl font-semibold mb-6 text-orange-600">A. Product Upload Template</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-amber-400">Product Title</h4>
                  <p className="text-gray-600">Clear, concise name (e.g., "Handmade Leather Wallet – Brown")</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-amber-400">Category</h4>
                  <p className="text-gray-600">Choose from dropdown (e.g, Handcrafted goods  Maasai Market)</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-amber-400">Price</h4>
                  <p className="text-gray-600">In local currency (e.g., KES 2,500 or USD 20)</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-amber-400">Stock Quantity</h4>
                  <p className="text-gray-600">Total items available</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-amber-400">Product Description</h4>
                  <ul className="text-gray-600 text-sm ml-4 list-disc">
                    <li>Features</li>
                    <li>Benefits</li>
                    <li>Usage Instructions (if applicable)</li>
                    <li>Size/Measurements (e.g., Length: 10cm, Width: 5cm)</li>
                    <li>Material/Ingredients</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Photo Guidelines */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                             <h3 className="text-2xl font-semibold mb-6 text-orange-600">B. Upload Photos</h3>
              <p className="mb-4 text-gray-700">Upload up to 5 images per product.</p>
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-amber-400">Photo Guidelines:</h4>
                <div className="space-y-2">
                  {[
                    "White or neutral background",
                    "Clear, high-resolution (at least 1000x1000 px)",
                    "Show item from multiple angles", 
                    "No watermarks or promotional text",
                    "JPEG or PNG format",
                    "Include at least 1 lifestyle photo (e.g., product in use)"
                  ].map((guideline, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="text-green-500" size={16} />
                      <span className="text-gray-700 text-sm">{guideline}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">C. Product Specifications (Optional)</h4>
                <p className="text-sm text-gray-700">
                  For beauty products: Include ingredients or components and compatibility info.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Dashboard Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
                     <h2 className="text-4xl font-bold text-center mb-12 text-orange-600">
             💼 Manage Your Store
           </h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-lg mb-6 text-center text-gray-700">
              From the Seller Dashboard, you can:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Update product listings",
                "Monitor orders & delivery", 
                "Adjust stock and pricing",
                "Respond to customer questions",
                "View sales reports",
                "Access seller resources"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <Check className="text-green-500" size={20} />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Order Fulfillment */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
                     <h2 className="text-4xl font-bold text-center mb-12 text-orange-600">
             🚚 Order Fulfillment
           </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
                             <h3 className="text-xl font-semibold mb-4 text-orange-600">Self-Shipping</h3>
              <p className="text-gray-700 mb-4">
                You pack and ship the product directly to customers.
              </p>
              <ul className="space-y-2">
                {[
                  "Full control over packaging",
                  "Direct customer relationship",
                  "Choose your shipping method",
                  "Keep higher profit margins"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="text-green-500" size={16} />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
                             <h3 className="text-xl font-semibold mb-4 text-orange-600">Fulfilled by SokoAfrica</h3>
              <p className="text-gray-700 mb-4">
                Drop off at our logistics partner and we deliver for you.
              </p>
              <ul className="space-y-2">
                {[
                  "Professional packaging",
                  "Faster delivery times",
                  "Customer service support",
                  "Tracking and insurance included"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="text-green-500" size={16} />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
                     <h2 className="text-4xl font-bold text-center mb-12 text-orange-600">
             📞 Seller Support
           </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <MessageCircle className="mx-auto mb-4 text-orange-500" size={48} />
              <h3 className="font-semibold text-lg mb-2 text-amber-400">Live Chat</h3>
              <p className="text-gray-600">Get instant help during business hours</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Mail className="mx-auto mb-4 text-orange-500" size={48} />
              <h3 className="font-semibold text-lg mb-2 text-amber-400">Email Support</h3>
              <p className="text-gray-600">support@sokoafrica.com</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Calendar className="mx-auto mb-4 text-orange-500" size={48} />
              <h3 className="font-semibold text-lg mb-2 text-amber-400">Training Webinars</h3>
              <p className="text-gray-600">Scheduled seller training sessions</p>
            </div>
          </div>

          {/* Helpful Links */}
          <div className="text-center">
                         <h3 className="text-2xl font-semibold mb-6 text-orange-600">🔗 Helpful Links</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/seller-signup" className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors">
                <UserPlus size={20} />
                <span>Seller Sign-Up</span>
              </Link>
              <Link href="/product-template.xlsx" className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">
                <Download size={20} />
                <span>Product Listing Template</span>
              </Link>
              <Link href="/seller-guidelines.pdf" className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
                <FileText size={20} />
                <span>Quality & Listing Guidelines PDF</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerPage;

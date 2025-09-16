"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import FAQSection from '../components/ui/FAQSection';
import { 
  CreditCard, 
  Shield, 
  Truck, 
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Check,
  ChevronDown,
  Lock,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Gift,
  Tag
} from 'lucide-react';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Demo cart items for checkout
  const cartItems = [
    {
      id: 1,
      name: "Premium Ethiopian Coffee Beans",
      price: 24.99,
      quantity: 2,
      image: "/hero/Black beans.png",
      seller: "Addis Coffee Co."
    },
    {
      id: 2,
      name: "Hand-woven Kente Cloth Scarf",
      price: 45.00,
      quantity: 1,
      image: "/hero/Ankara fabric.png",
      seller: "Ghana Weavers Guild"
    },
    {
      id: 3,
      name: "Organic Shea Butter - Pure & Natural",
      price: 18.50,
      quantity: 3,
      image: "/products/African bracelets.png",
      seller: "Burkina Beauty"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const promoDiscount = promoApplied ? subtotal * 0.1 : 0; // 10% discount
  const shipping = 9.99;
  const tax = (subtotal - promoDiscount) * 0.08;
  const total = subtotal - promoDiscount + shipping + tax;

  const steps = [
    { number: 1, title: "Shipping Information", completed: currentStep > 1 },
    { number: 2, title: "Payment Details", completed: currentStep > 2 },
    { number: 3, title: "Order Review", completed: false }
  ];

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'africa10') {
      setPromoApplied(true);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step.completed 
                ? 'bg-green-500 text-white'
                : currentStep === step.number
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-600'
            }`}>
              {step.completed ? <Check size={20} /> : step.number}
            </div>
            <span className={`text-sm mt-2 font-medium ${
              currentStep === step.number ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-20 h-1 mx-4 ${
              step.completed ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const ShippingForm = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline mr-2" size={16} />
            First Name *
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline mr-2" size={16} />
            Last Name *
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Doe"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline mr-2" size={16} />
            Email Address *
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="john.doe@example.com"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline mr-2" size={16} />
            Phone Number *
          </label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Home className="inline mr-2" size={16} />
            Street Address *
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="123 Main Street"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="New York"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="NY"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="10001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>France</option>
            <option>Australia</option>
            <option>Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const PaymentForm = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h3>
      
      {/* Payment Methods */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
        <div className="space-y-3">
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-600">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-orange-600"
            />
            <CreditCard className="ml-3 mr-2" size={20} />
            <span className="font-medium">Credit/Debit Card</span>
            <div className="ml-auto flex space-x-2">
              <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                VISA
              </div>
              <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">
                MC
              </div>
            </div>
          </label>
          
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-600">
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-orange-600"
            />
            <div className="ml-3 mr-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="font-medium">PayPal</span>
          </label>
          
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-orange-600">
            <input
              type="radio"
              name="payment"
              value="crypto"
              checked={paymentMethod === 'crypto'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-orange-600"
            />
            <div className="ml-3 mr-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">₿</span>
            </div>
            <span className="font-medium">Cryptocurrency</span>
          </label>
        </div>
      </div>

      {/* Card Details */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="1234 5678 9012 3456"
              />
              <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="MM/YY"
                />
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="123"
                />
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
        </div>
      )}

      {/* Billing Address */}
      <div className="mt-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="text-orange-600"
          />
          <span className="ml-2 text-sm text-gray-700">Billing address same as shipping address</span>
        </label>
      </div>
    </div>
  );

  const OrderReview = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Review</h3>
      
      <div className="space-y-6">
        {/* Order Items */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Items in your order</h4>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{item.name}</h5>
                  <p className="text-sm text-gray-600">by {item.seller}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">${item.price} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Method */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Shipping Method</h4>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="text-green-600 mr-2" size={20} />
                <span className="font-medium text-green-800">Standard Shipping</span>
              </div>
              <span className="text-green-800 font-semibold">${shipping.toFixed(2)}</span>
            </div>
            <p className="text-sm text-green-700 mt-1">Delivered in 5-7 business days</p>
          </div>
        </div>

        {/* Order Confirmation */}
        <div className="border-t pt-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="text-orange-600 mr-2" size={20} />
              <span className="font-medium text-orange-800">Order Confirmation</span>
            </div>
            <p className="text-sm text-orange-700">
              By placing this order, you agree to our Terms & Conditions and Privacy Policy. 
              You will receive an email confirmation once your order is processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <Shield size={32} />
                  <h1 className="text-3xl lg:text-4xl font-bold">Secure Checkout</h1>
                </div>
                <p className="text-lg opacity-90">
                  Complete your order with confidence
                </p>
              </div>
              <Link href="/cart">
                <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                  <ArrowLeft size={20} />
                  <span>Back to Cart</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <StepIndicator />
            
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {currentStep === 1 && <ShippingForm />}
                {currentStep === 2 && <PaymentForm />}
                {currentStep === 3 && <OrderReview />}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-orange-600 hover:text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={20} />
                    <span>Previous</span>
                  </button>
                  
                  {currentStep < 3 ? (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      <span>Continue</span>
                      <ChevronDown className="rotate-270" size={20} />
                    </button>
                  ) : (
                    <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                      <Lock size={20} />
                      <span>Place Order</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm sticky top-6">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
                    
                    {/* Items */}
                    <div className="space-y-3 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Promo Code */}
                    <div className="mb-6">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Promo code"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {promoApplied && (
                        <p className="text-sm text-green-600 mt-2 flex items-center">
                          <Check size={16} className="mr-1" />
                          Promo code applied!
                        </p>
                      )}
                    </div>
                    
                    {/* Totals */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      {promoApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Promo discount</span>
                          <span>-${promoDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold">${shipping.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold">${tax.toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Security Icons */}
                    <div className="border-t pt-6">
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Shield className="text-green-500" size={16} />
                          <span>SSL secured checkout</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Lock className="text-blue-500" size={16} />
                          <span>256-bit encryption</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Truck className="text-orange-500" size={16} />
                          <span>Trackable shipping</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Safe & Secure Checkout</h3>
              <p className="text-gray-600">Your information is protected with industry-standard security</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <Shield className="text-green-600" size={28} />
                </div>
                <h4 className="font-semibold mb-2">SSL Protected</h4>
                <p className="text-sm text-gray-600">All data encrypted</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <CreditCard className="text-blue-600" size={28} />
                </div>
                <h4 className="font-semibold mb-2">Secure Payments</h4>
                <p className="text-sm text-gray-600">Multiple payment options</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <Truck className="text-orange-600" size={28} />
                </div>
                <h4 className="font-semibold mb-2">Fast Delivery</h4>
                <p className="text-sm text-gray-600">Worldwide shipping</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                  <Gift className="text-purple-600" size={28} />
                </div>
                <h4 className="font-semibold mb-2">Easy Returns</h4>
                <p className="text-sm text-gray-600">30-day guarantee</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <FAQSection 
            userType="customer"
            title="Checkout Questions"
            subtitle="Common questions about payment, shipping, and order processing"
            showContactCTA={false}
            className="max-w-6xl"
          />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
"use client";
import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { CreditCard, Plus, Edit, Trash2, ArrowLeft, Shield, Check } from 'lucide-react';
import Link from 'next/link';

export default function PaymentMethodsPage() {
  // Mock payment methods data - replace with real data
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      holderName: 'John Doe',
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      brand: 'mastercard',
      last4: '8888',
      expiryMonth: '06',
      expiryYear: '2026',
      holderName: 'John Doe',
      isDefault: false
    },
    {
      id: 3,
      type: 'mobile',
      provider: 'mpesa',
      number: '+254700123456',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentType, setPaymentType] = useState('card');

  const handleSetDefault = (methodId) => {
    setPaymentMethods(methods => methods.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
  };

  const handleDelete = (methodId) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== methodId));
  };

  const getCardIcon = (brand) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳'
    };
    return icons[brand] || '💳';
  };

  const getMobileIcon = (provider) => {
    const icons = {
      mpesa: '📱',
      airtel: '📱'
    };
    return icons[provider] || '📱';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href="/account"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Account
            </Link>
          </div>

          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="text-purple-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
                <p className="text-gray-600">Manage your saved payment methods</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add Payment Method</span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Shield className="text-blue-600 mr-3" size={20} />
              <div>
                <h3 className="text-blue-900 font-medium">Your payment information is secure</h3>
                <p className="text-blue-700 text-sm">All payment data is encrypted and stored securely. We never store your full card details.</p>
              </div>
            </div>
          </div>

          {/* Payment Methods Grid */}
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-lg shadow-md p-6 relative">
                {method.isDefault && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      <Check size={12} className="mr-1" />
                      Default
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {method.type === 'card' ? getCardIcon(method.brand) : getMobileIcon(method.provider)}
                    </div>
                    
                    <div>
                      {method.type === 'card' ? (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {method.brand} •••• {method.last4}
                          </h3>
                          <p className="text-gray-600">
                            {method.holderName} • Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {method.provider} Mobile Money
                          </h3>
                          <p className="text-gray-600">{method.number}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm px-3 py-1">
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    {!method.isDefault && (
                      <>
                        <button 
                          onClick={() => handleDelete(method.id)}
                          className="flex items-center text-red-600 hover:text-red-700 text-sm px-3 py-1"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </button>
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium px-3 py-1"
                        >
                          Set as Default
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Payment Method Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Payment Method</h3>
                
                {/* Payment Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setPaymentType('card')}
                      className={`flex-1 p-3 border rounded-lg text-center ${
                        paymentType === 'card' 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      💳 Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('mobile')}
                      className={`flex-1 p-3 border rounded-lg text-center ${
                        paymentType === 'mobile' 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      📱 Mobile Money
                    </button>
                  </div>
                </div>

                <form className="space-y-4">
                  {paymentType === 'card' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input 
                            type="text" 
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <option value="mpesa">M-Pesa</option>
                          <option value="airtel">Airtel Money</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          placeholder="+254 700 123 456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center">
                    <input type="checkbox" id="setDefaultPayment" className="mr-2" />
                    <label htmlFor="setDefaultPayment" className="text-sm text-gray-600">Set as default payment method</label>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      Save Payment Method
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

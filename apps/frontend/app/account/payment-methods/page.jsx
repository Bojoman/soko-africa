"use client";
import React, { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { paymentMethodsApi } from '../../lib/api';
import { CreditCard, Plus, Trash2, ArrowLeft, Shield, Check, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentType, setPaymentType] = useState('mobile');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentMethodsApi.list();
      setPaymentMethods(data.paymentMethods || []);
    } catch {
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSetDefault = async (methodId) => {
    try {
      await paymentMethodsApi.setDefault(methodId);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (methodId) => {
    try {
      await paymentMethodsApi.remove(methodId);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const form = e.target;

    try {
      if (paymentType === 'mobile') {
        await paymentMethodsApi.create({
          type: 'mobile',
          provider: form.provider.value,
          phoneNumber: form.phoneNumber.value,
          setDefault: form.setDefault.checked
        });
      } else {
        const expiry = form.expiry.value.split('/');
        await paymentMethodsApi.create({
          type: 'card',
          brand: form.brand.value || 'visa',
          last4: form.last4.value.slice(-4),
          expiryMonth: parseInt(expiry[0], 10),
          expiryYear: parseInt(expiry[1]?.length === 2 ? `20${expiry[1]}` : expiry[1], 10),
          holderName: form.holderName.value,
          setDefault: form.setDefault.checked
        });
      }
      setShowAddForm(false);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to save payment method');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
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
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add Payment Method</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Shield className="text-blue-600 mr-3" size={20} />
              <div>
                <h3 className="text-blue-900 font-medium">Your payment information is secure</h3>
                <p className="text-blue-700 text-sm">
                  Card details are tokenized at checkout. Saved cards store only last 4 digits.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading payment methods…</p>
            ) : paymentMethods.length === 0 ? (
              <p className="text-gray-500 text-sm">No saved payment methods yet.</p>
            ) : (
              paymentMethods.map((method) => (
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
                      <div className="p-2.5 rounded-lg bg-soko-cream/40 text-soko-dark-teal">
                        {method.type === 'card' ? (
                          <CreditCard size={24} aria-hidden="true" />
                        ) : (
                          <Smartphone size={24} aria-hidden="true" />
                        )}
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
                      {!method.isDefault && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDelete(method.id)}
                            className="flex items-center text-red-600 hover:text-red-700 text-sm px-3 py-1"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </button>
                          <button
                            type="button"
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
              ))
            )}
          </div>

          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Payment Method</h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setPaymentType('card')}
                      className={`flex-1 p-3 border rounded-lg text-center inline-flex items-center justify-center gap-2 ${
                        paymentType === 'card'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <CreditCard size={16} aria-hidden="true" />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('mobile')}
                      className={`flex-1 p-3 border rounded-lg text-center inline-flex items-center justify-center gap-2 ${
                        paymentType === 'mobile'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <Smartphone size={16} aria-hidden="true" />
                      <span>Mobile Money</span>
                    </button>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {paymentType === 'card' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last 4 digits</label>
                        <input
                          name="last4"
                          type="text"
                          maxLength={4}
                          required
                          placeholder="4242"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input
                          name="holderName"
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <select
                          name="brand"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="visa">Visa</option>
                          <option value="mastercard">Mastercard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                        <input
                          name="expiry"
                          type="text"
                          required
                          placeholder="12/28"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                        <select
                          name="provider"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="mpesa">M-Pesa</option>
                          <option value="airtel">Airtel Money</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          name="phoneNumber"
                          type="tel"
                          required
                          placeholder="+254 700 123 456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center">
                    <input type="checkbox" id="setDefaultPayment" name="setDefault" className="mr-2" />
                    <label htmlFor="setDefaultPayment" className="text-sm text-gray-600">
                      Set as default payment method
                    </label>
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
                      disabled={saving}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving…' : 'Save Payment Method'}
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

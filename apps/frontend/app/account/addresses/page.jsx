"use client";
import React, { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Link from 'next/link';
import { MapPin, Plus, Trash2, ArrowLeft, Home, Building } from 'lucide-react';
import { get, post, patch, del } from '../../lib/api';

function mapAddress(a) {
  return {
    id: a.id,
    type: 'home',
    title: a.label || 'Address',
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    postalCode: a.postalCode,
    country: a.country,
    region: a.region,
    isDefault: a.isDefault
  };
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: '',
    line1: '',
    line2: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Kenya',
    isDefault: false
  });

  const loadAddresses = useCallback(async () => {
    setError(null);
    try {
      const data = await get('/addresses');
      setAddresses((data.addresses || []).map(mapAddress));
    } catch (e) {
      setError(e.message || 'Could not load addresses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleSetDefault = async (addressId) => {
    try {
      await patch(`/addresses/${addressId}`, { isDefault: true });
      await loadAddresses();
    } catch (e) {
      alert(e.message || 'Could not update default');
    }
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Remove this address?')) return;
    try {
      await del(`/addresses/${addressId}`);
      await loadAddresses();
    } catch (e) {
      alert(e.message || 'Could not delete');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await post('/addresses', {
        label: form.label || null,
        line1: form.line1,
        line2: form.line2 || null,
        city: form.city,
        region: form.region || null,
        postalCode: form.postalCode || null,
        country: form.country,
        isDefault: form.isDefault
      });
      setShowAddForm(false);
      setForm({
        label: '',
        line1: '',
        line2: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'Kenya',
        isDefault: false
      });
      await loadAddresses();
    } catch (err) {
      alert(err.message || 'Could not save address');
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
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="text-green-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
                <p className="text-gray-600">Manage your shipping addresses</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add Address</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 text-red-800 px-4 py-3 text-sm">{error}</div>
          )}
          {loading && <p className="text-gray-500 mb-6">Loading…</p>}

          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow-md p-6 relative">
                {address.isDefault && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Default
                    </span>
                  </div>
                )}

                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    {address.type === 'home' ? (
                      <Home className="text-gray-600" size={20} />
                    ) : (
                      <Building className="text-gray-600" size={20} />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{address.title}</h3>
                </div>

                <div className="text-gray-600 space-y-1 mb-4">
                  <p className="font-medium text-gray-900">{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  <p>
                    {address.city}
                    {address.postalCode ? `, ${address.postalCode}` : ''}
                  </p>
                  {address.region && <p>{address.region}</p>}
                  <p>{address.country}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleDelete(address.id)}
                        className="flex items-center text-red-600 hover:text-red-700 text-sm"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    )}
                  </div>
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add address</h3>
                <form className="space-y-4" onSubmit={handleAddSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label (optional)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Home, Office…"
                      value={form.label}
                      onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street line 1 *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={form.line1}
                      onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Line 2</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={form.line2}
                      onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={form.city}
                        onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={form.postalCode}
                        onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region / state</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={form.region}
                      onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={form.country}
                      onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    >
                      <option value="Kenya">Kenya</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="South Africa">South Africa</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="setDefault"
                      className="mr-2"
                      checked={form.isDefault}
                      onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                    />
                    <label htmlFor="setDefault" className="text-sm text-gray-600">
                      Set as default address
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
                      {saving ? 'Saving…' : 'Save address'}
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

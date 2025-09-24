"use client";
import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Plus, Edit, Trash2, ArrowLeft, Home, Building } from 'lucide-react';
import Link from 'next/link';

export default function AddressesPage() {
  const { user } = useAuth();
  
  // Mock addresses data - replace with real data
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'home',
      title: 'Home',
      name: 'John Doe',
      address: '123 Westlands Ave',
      city: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
      phone: '+254 700 123 456',
      isDefault: true
    },
    {
      id: 2,
      type: 'office',
      title: 'Office',
      name: 'John Doe',
      address: '456 Riverside Drive',
      city: 'Nairobi',
      postalCode: '00200',
      country: 'Kenya',
      phone: '+254 700 123 456',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const handleDelete = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
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
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="text-green-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
                <p className="text-gray-600">Manage your shipping and billing addresses</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add Address</span>
            </button>
          </div>

          {/* Addresses Grid */}
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
                  <p className="font-medium text-gray-900">{address.name}</p>
                  <p>{address.address}</p>
                  <p>{address.city}, {address.postalCode}</p>
                  <p>{address.country}</p>
                  <p>{address.phone}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    {!address.isDefault && (
                      <button 
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

          {/* Add Address Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="home">Home</option>
                      <option value="office">Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      defaultValue={`${user?.firstName || ''} ${user?.lastName || ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="Kenya">Kenya</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="South Africa">South Africa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      defaultValue={user?.phone || ''}
                    />
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="setDefault" className="mr-2" />
                    <label htmlFor="setDefault" className="text-sm text-gray-600">Set as default address</label>
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
                      Save Address
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

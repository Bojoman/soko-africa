"use client";
import React, { useState } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Heart, ShoppingCart, Trash2, Search, Filter } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';

export default function WishlistPage() {
  const { user } = useAuth();
  
  const methods = useForm({
    defaultValues: {
      searchTerm: '',
      sortBy: 'date',
    },
  });
  const { watch } = methods;
  const searchTerm = watch('searchTerm');
  const sortBy = watch('sortBy');

  // Mock wishlist data (remains the same)
  const wishlistItems = [
    { id: 'WL-001', name: 'African Handwoven Basket', price: 45.00, inStock: true, addedDate: '2024-01-15' },
    { id: 'WL-002', name: 'Kenyan Coffee Beans', price: 28.00, inStock: true, addedDate: '2024-01-12' },
    { id: 'WL-003', name: 'Maasai Beaded Necklace', price: 35.00, inStock: false, addedDate: '2024-01-10' },
  ];

  const filteredItems = wishlistItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return new Date(b.addedDate) - new Date(a.addedDate);
    }
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <FormProvider {...methods}>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input {...methods.register('searchTerm')} placeholder="Search wishlist..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-gray-400" />
                  <select {...methods.register('sortBy')} className="px-3 py-2 border rounded-lg">
                    <option value="date">Recently Added</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </FormProvider>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                <div className="mt-4 flex space-x-2">
                  <button disabled={!item.inStock} className="flex-1 bg-orange-600 text-white py-2 rounded-lg disabled:bg-gray-400">
                    Add to Cart
                  </button>
                  <button className="p-2 border rounded-lg">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
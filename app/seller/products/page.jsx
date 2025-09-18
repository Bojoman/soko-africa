"use client";
import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';

export default function SellerProductsPage() {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const methods = useForm({
    defaultValues: {
      searchTerm: '',
      statusFilter: 'all',
    },
  });
  const { watch } = methods;
  const searchTerm = watch('searchTerm');
  const statusFilter = watch('statusFilter');

  // Mock products data
  const products = [
    { id: 'PROD-001', name: 'African Handwoven Basket', price: 45.00, status: 'active', stock: 25 },
    { id: 'PROD-002', name: 'Kenyan Coffee Beans', price: 28.00, status: 'active', stock: 50 },
    { id: 'PROD-003', name: 'Maasai Beaded Necklace', price: 35.00, status: 'draft', stock: 15 },
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-red-100 text-red-800',
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-orange-600">My Products</h1>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center">
              <Plus size={20} className="mr-2" />
              Add Product
            </button>
          </div>
          <FormProvider {...methods}>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input {...methods.register('searchTerm')} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 placeholder:text-blue-900 border rounded-lg" />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-blue-400" />
                  <select {...methods.register('statusFilter')} className="px-3 py-2 border placeholder:text-blue-900 rounded-lg">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </FormProvider>

          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left text-amber-900">Product</th>
                  <th className="p-4 text-left text-amber-900">Price</th>
                  <th className="p-4 text-left text-amber-900">Stock</th>
                  <th className="p-4 text-left text-amber-900">Status</th>
                  <th className="p-4 text-left text-amber-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4 text-amber-900">{product.name}</td>
                    <td className="p-4 text-amber-900">${product.price.toFixed(2)}</td>
                    <td className="p-4 text-amber-900">{product.stock}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[product.status]} text-amber-900`}>{product.status}</span>
                    </td>
                    <td className="p-4 flex space-x-2 text-amber-900">
                      <button><Eye size={18} className="text-amber-900" /></button>
                      <button><Edit size={18} className="text-amber-900" /></button>
                      <button><Trash2 size={18} className="text-amber-900" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

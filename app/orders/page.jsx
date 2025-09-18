"use client";
import React, { useState } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Package, Search, Filter, Eye, Download } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';

export default function OrdersPage() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const methods = useForm({
    defaultValues: {
      searchTerm: '',
      statusFilter: 'all',
    },
  });
  const { watch } = methods;
  const searchTerm = watch('searchTerm');
  const statusFilter = watch('statusFilter');

  // Mock orders data (remains the same)
  const orders = [
    { id: 'ORD-001', date: '2024-01-15', status: 'delivered', total: 89.99, items: [{ name: 'Item 1' }, { name: 'Item 2' }] },
    { id: 'ORD-002', date: '2024-01-10', status: 'shipped', total: 156.50, items: [{ name: 'Item 3' }] },
    { id: 'ORD-003', date: '2024-01-08', status: 'processing', total: 67.25, items: [{ name: 'Item 4' }] },
    { id: 'ORD-004', date: '2024-01-05', status: 'cancelled', total: 45.00, items: [{ name: 'Item 5' }] },
  ];

  const statusColors = {
    delivered: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = order.id.toLowerCase().includes(searchLower) ||
      order.items.some(item => item.name.toLowerCase().includes(searchLower));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <FormProvider {...methods}>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input {...methods.register('searchTerm')} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-gray-400" />
                  <select {...methods.register('statusFilter')} className="px-3 py-2 border rounded-lg">
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </FormProvider>

          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Order {order.id}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="font-bold">${order.total.toFixed(2)}</p>
                  <button onClick={() => setSelectedOrder(order)} className="text-orange-600 hover:underline">
                    View Details
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
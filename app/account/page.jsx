"use client";
import React from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { 
  User, 
  Package, 
  Heart, 
  Clock, 
  DollarSign, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Settings,
  ArrowRight,
  Eye,
  Truck
} from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  // Mock data for demonstration - replace with real API calls
  const mockStats = {
    totalOrders: 12,
    pendingOrders: 2,
    totalSpent: 1234
  };

  const mockRecentOrders = [
    {
      id: 'ORD-2024-001',
      date: 'Sep 10, 2025',
      status: 'Delivered',
      statusColor: 'bg-green-100 text-green-800',
      total: 89.99,
      action: 'View Details'
    },
    {
      id: 'ORD-2024-002',
      date: 'Sep 8, 2025',
      status: 'Shipped',
      statusColor: 'bg-blue-100 text-blue-800',
      total: 156.50,
      action: 'Track Order'
    },
    {
      id: 'ORD-2024-003',
      date: 'Sep 5, 2025',
      status: 'Processing',
      statusColor: 'bg-yellow-100 text-yellow-800',
      total: 234.00,
      action: 'View Details'
    }
  ];

  const quickActions = [
    {
      title: 'My Orders',
      description: 'Track orders and view purchase history',
      icon: Package,
      href: '/orders',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Wishlist',
      description: 'Save products for later',
      icon: Heart,
      href: '/wishlist',
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Addresses',
      description: 'Manage shipping and billing addresses',
      icon: MapPin,
      href: '/account/addresses',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Payment Methods',
      description: 'Manage saved payment methods',
      icon: CreditCard,
      href: '/account/payment-methods',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Account Settings',
      description: 'Update profile and preferences',
      icon: Settings,
      href: '/account/profile',
      color: 'bg-gray-50 text-gray-600'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="text-orange-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.firstName || 'Customer'}!
                </h1>
                <p className="text-gray-600">Manage your account and track your orders</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-orange-600">{mockStats.totalOrders}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Package className="text-orange-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Wishlist Items</p>
                  <p className="text-2xl font-bold text-red-600">{wishlistCount}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Heart className="text-red-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{mockStats.pendingOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-purple-600">${mockStats.totalSpent}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon size={24} />
                    </div>
                    <ArrowRight 
                      className="text-gray-400 group-hover:text-gray-600 transition-colors" 
                      size={20} 
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link 
                  href="/orders"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center"
                >
                  View All Orders
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockRecentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
                          {order.action === 'Track Order' ? (
                            <>
                              <Truck size={16} className="mr-1" />
                              Track Order
                            </>
                          ) : (
                            <>
                              <Eye size={16} className="mr-1" />
                              View Details
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
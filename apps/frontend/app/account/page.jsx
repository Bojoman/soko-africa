"use client";
import React, { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { get } from '../lib/api';
import {
  User,
  Package,
  Heart,
  Clock,
  DollarSign,
  ArrowRight,
  Eye,
  Truck
} from 'lucide-react';
import Link from 'next/link';

function formatOrderDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return String(iso);
  }
}

function formatMoney(amount, currency = 'USD') {
  const n = Number(amount) || 0;
  if (currency === 'KES') return `KSh ${n.toFixed(2)}`;
  return `$${n.toFixed(2)}`;
}

function statusStyle(uiStatus) {
  const map = {
    delivered: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return map[uiStatus] || 'bg-gray-100 text-gray-800';
}

function statusLabel(uiStatus) {
  if (!uiStatus) return 'Processing';
  return uiStatus.charAt(0).toUpperCase() + uiStatus.slice(1);
}

export default function AccountPage() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setOrdersLoading(true);
      try {
        const data = await get('/orders');
        if (!cancelled) setOrders(data.orders || []);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const paid = orders.filter((o) =>
      ['PAID', 'SHIPPED', 'DELIVERED'].includes(String(o.status || '').toUpperCase())
    );
    const pending = orders.filter((o) =>
      ['PENDING_PAYMENT', 'PROCESSING', 'PAID'].includes(String(o.status || '').toUpperCase()) &&
      o.uiStatus !== 'delivered' &&
      o.uiStatus !== 'shipped'
    );
    const totalSpent = paid.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return {
      totalOrders: orders.length,
      pendingOrders: pending.length,
      totalSpent
    };
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

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
      icon: Package,
      href: '/account/addresses',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Payment Methods',
      description: 'Manage saved payment methods',
      icon: DollarSign,
      href: '/account/payment-methods',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Account Settings',
      description: 'Update profile and preferences',
      icon: User,
      href: '/account/profile',
      color: 'bg-gray-50 text-gray-600'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-soko-orange/10 rounded-full flex items-center justify-center">
                <User className="text-soko-orange" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-soko-dark-teal">
                  Welcome back, {user?.firstName || 'Customer'}!
                </h1>
                <p className="text-gray-600">Manage your account and track your orders</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-soko-orange">
                    {ordersLoading ? '…' : stats.totalOrders}
                  </p>
                </div>
                <div className="p-3 bg-soko-orange/10 rounded-lg">
                  <Package className="text-soko-orange" size={24} />
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
                  <p className="text-gray-600 text-sm">Cart Items</p>
                  <p className="text-2xl font-bold text-blue-600">{itemCount}</p>
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
                  <p className="text-2xl font-bold text-purple-600">
                    {ordersLoading ? '…' : formatMoney(stats.totalSpent)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-soko-dark-teal mb-6">Quick Actions</h2>
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

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-soko-dark-teal">Recent Orders</h2>
                <Link
                  href="/orders"
                  className="text-soko-orange hover:text-soko-dark-red text-sm font-medium flex items-center"
                >
                  View All Orders
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              {ordersLoading ? (
                <p className="p-6 text-gray-500">Loading orders…</p>
              ) : recentOrders.length === 0 ? (
                <p className="p-6 text-gray-500">
                  No orders yet.{' '}
                  <Link href="/products" className="text-soko-orange font-medium hover:underline">
                    Start shopping
                  </Link>
                </p>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatOrderDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyle(order.uiStatus)}`}
                          >
                            {statusLabel(order.uiStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatMoney(order.total, order.currency)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-soko-orange hover:text-soko-dark-red font-medium inline-flex items-center"
                          >
                            {order.uiStatus === 'shipped' ? (
                              <>
                                <Truck size={16} className="mr-1" /> Track
                              </>
                            ) : (
                              <>
                                <Eye size={16} className="mr-1" /> View
                              </>
                            )}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { analyticsApi } from '../../lib/api';
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, Calendar } from 'lucide-react';

const EMPTY = {
  overview: {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    conversionRate: null,
    avgOrderValue: 0
  },
  salesData: [],
  topProducts: [],
  customerInsights: {
    newCustomers: 0,
    returningCustomers: 0,
    customerRetention: 0,
    avgCustomerValue: 0
  }
};

export default function SellerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await analyticsApi.seller(timeRange);
      setAnalytics({ ...EMPTY, ...data });
    } catch {
      setAnalytics(EMPTY);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    load();
  }, [load]);

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const maxRevenue = Math.max(...analytics.salesData.map((d) => d.revenue), 1);
  const rangeLabel = timeRanges.find((r) => r.value === timeRange)?.label || timeRange;

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-gray-600">Track your sales performance and insights</p>
                </div>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analytics.overview.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalCustomers}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="text-purple-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.conversionRate != null
                      ? `${analytics.overview.conversionRate}%`
                      : '—'}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="text-orange-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analytics.overview.avgOrderValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Package className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{rangeLabel}</span>
                  </div>
                </div>

                {loading ? (
                  <p className="text-gray-500 text-sm">Loading sales data…</p>
                ) : analytics.salesData.length === 0 ? (
                  <p className="text-gray-500 text-sm">No sales in this period yet.</p>
                ) : (
                  <div className="space-y-4">
                    {analytics.salesData.map((day) => (
                      <div key={day.date} className="flex items-center space-x-4">
                        <div className="w-16 text-sm text-gray-600">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                          <div
                            className="bg-orange-600 h-4 rounded-full"
                            style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                          />
                        </div>
                        <div className="w-20 text-sm text-gray-900 text-right">
                          ${day.revenue}
                        </div>
                        <div className="w-12 text-sm text-gray-600 text-right">
                          {day.orders} orders
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h2>
                {analytics.topProducts.length === 0 ? (
                  <p className="text-sm text-gray-500">No product sales yet.</p>
                ) : (
                  <div className="space-y-4">
                    {analytics.topProducts.map((product) => (
                      <div key={product.productId || product.name} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.sales} sales</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">${product.revenue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Insights</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{analytics.customerInsights.newCustomers}</p>
                  <p className="text-sm text-gray-600">New Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{analytics.customerInsights.returningCustomers}</p>
                  <p className="text-sm text-gray-600">Returning Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{analytics.customerInsights.customerRetention}%</p>
                  <p className="text-sm text-gray-600">Retention Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">${analytics.customerInsights.avgCustomerValue}</p>
                  <p className="text-sm text-gray-600">Avg Customer Value</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}

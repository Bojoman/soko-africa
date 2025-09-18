"use client";
import React, { useState } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, DollarSign, ShoppingCart, Users, Eye, Package, Calendar, Download } from 'lucide-react';

export default function SellerAnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analytics = {
    overview: {
      totalRevenue: 12450.75,
      totalOrders: 89,
      totalCustomers: 156,
      conversionRate: 3.2,
      avgOrderValue: 139.89
    },
    salesData: [
      { date: '2024-01-01', revenue: 450, orders: 3 },
      { date: '2024-01-02', revenue: 320, orders: 2 },
      { date: '2024-01-03', revenue: 680, orders: 4 },
      { date: '2024-01-04', revenue: 290, orders: 2 },
      { date: '2024-01-05', revenue: 520, orders: 3 },
      { date: '2024-01-06', revenue: 750, orders: 5 },
      { date: '2024-01-07', revenue: 420, orders: 3 }
    ],
    topProducts: [
      { name: 'African Handwoven Basket', sales: 25, revenue: 1125.00, growth: '+12%' },
      { name: 'Kenyan Coffee Beans', sales: 18, revenue: 504.00, growth: '+8%' },
      { name: 'Maasai Beaded Necklace', sales: 15, revenue: 525.00, growth: '+15%' },
      { name: 'Ethiopian Spices Set', sales: 12, revenue: 264.00, growth: '+5%' }
    ],
    customerInsights: {
      newCustomers: 23,
      returningCustomers: 45,
      customerRetention: 68.5,
      avgCustomerValue: 79.81
    }
  };

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
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
              <div className="flex items-center space-x-3">
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
                <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${analytics.overview.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
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
                  <p className="text-sm text-green-600">+8% from last month</p>
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
                  <p className="text-sm text-green-600">+15% from last month</p>
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
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.conversionRate}%</p>
                  <p className="text-sm text-green-600">+0.3% from last month</p>
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
                  <p className="text-2xl font-bold text-gray-900">${analytics.overview.avgOrderValue}</p>
                  <p className="text-sm text-green-600">+5% from last month</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Package className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Last 7 days</span>
                  </div>
                </div>
                
                {/* Simple bar chart representation */}
                <div className="space-y-4">
                  {analytics.salesData.map((day, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 text-sm text-gray-600">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div 
                          className="bg-orange-600 h-4 rounded-full"
                          style={{ width: `${(day.revenue / 800) * 100}%` }}
                        ></div>
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
              </div>
            </div>

            {/* Top Products */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h2>
                <div className="space-y-4">
                  {analytics.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">${product.revenue}</p>
                        <p className="text-xs text-green-600">{product.growth}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Insights */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Insights</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics.customerInsights.newCustomers}</p>
                  <p className="text-sm text-gray-600">New Customers</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="text-green-600" size={24} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics.customerInsights.returningCustomers}</p>
                  <p className="text-sm text-gray-600">Returning Customers</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analytics.customerInsights.customerRetention}%</p>
                  <p className="text-sm text-gray-600">Retention Rate</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="text-orange-600" size={24} />
                  </div>
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

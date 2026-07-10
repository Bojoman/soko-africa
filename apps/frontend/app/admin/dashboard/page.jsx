"use client";
import React, { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../lib/api';
import { Shield, Users, Store, Package, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

const STAT_META = [
  { key: 'totalUsers', name: 'Total Users', icon: Users, color: 'blue' },
  { key: 'activeSellers', name: 'Active Sellers', icon: Store, color: 'green' },
  { key: 'totalProducts', name: 'Total Products', icon: Package, color: 'purple' },
  { key: 'platformRevenue', name: 'Platform Revenue', icon: DollarSign, color: 'orange' }
];

function formatStatValue(key, stat) {
  if (!stat) return '—';
  if (key === 'platformRevenue') {
    return `$${Number(stat.value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
  return Number(stat.value || 0).toLocaleString();
}

function typeLabel(type) {
  if (type === 'seller_application') return 'Seller Application';
  if (type === 'product_listing') return 'Product Listing';
  return type;
}

function formatSubmitted(iso) {
  if (!iso) return '—';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.dashboard();
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (item) => {
    setActionId(item.id);
    try {
      if (item.type === 'seller_application') {
        await adminApi.approveSeller(item.id);
      } else {
        await adminApi.publishProduct(item.id);
      }
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (item) => {
    if (item.type !== 'seller_application') return;
    setActionId(item.id);
    try {
      await adminApi.rejectSeller(item.id);
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const stats = data?.stats || {};
  const pendingApprovals = data?.pendingApprovals || [];
  const recentActivities = data?.recentActivity || [];
  const systemStatus = data?.systemStatus || {};

  const statusIcon = (status) => {
    if (status === 'connected' || status === 'online' || status === 'healthy') {
      return <CheckCircle className="text-green-500" size={16} />;
    }
    if (status === 'warning') return <AlertTriangle className="text-yellow-500" size={16} />;
    return <AlertTriangle className="text-red-500" size={16} />;
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="text-red-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {STAT_META.map((meta) => (
              <div key={meta.key} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{meta.name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '…' : formatStatValue(meta.key, stats[meta.key])}
                    </p>
                    <p className="text-sm text-green-600">
                      {stats[meta.key]?.changeLabel || ''}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    meta.color === 'blue' ? 'bg-blue-100' :
                    meta.color === 'green' ? 'bg-green-100' :
                    meta.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <meta.icon className={`${
                      meta.color === 'blue' ? 'text-blue-600' :
                      meta.color === 'green' ? 'text-green-600' :
                      meta.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {pendingApprovals.length} pending
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {pendingApprovals.length === 0 ? (
                    <p className="px-6 py-8 text-gray-500 text-sm">No pending approvals.</p>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingApprovals.map((item) => (
                          <tr key={`${item.type}-${item.id}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                {typeLabel(item.type)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.email || item.sellerName || '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatSubmitted(item.submittedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  disabled={actionId === item.id}
                                  onClick={() => handleApprove(item)}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                {item.type === 'seller_application' && (
                                  <button
                                    type="button"
                                    disabled={actionId === item.id}
                                    onClick={() => handleReject(item)}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivities.length === 0 ? (
                    <p className="text-sm text-gray-500">No recent activity.</p>
                  ) : (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'warning' ? 'bg-yellow-500' :
                          activity.status === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  {[
                    ['API Status', systemStatus.api],
                    ['Database', systemStatus.database],
                    ['Payment Gateway', systemStatus.paymentGateway],
                    ['Email Service', systemStatus.emailService]
                  ].map(([label, status]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{label}</span>
                      <div className="flex items-center space-x-2">
                        {statusIcon(status)}
                        <span className={`text-sm capitalize ${
                          status === 'warning' ? 'text-yellow-600' :
                          status === 'connected' || status === 'online' || status === 'healthy'
                            ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {status || 'unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
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

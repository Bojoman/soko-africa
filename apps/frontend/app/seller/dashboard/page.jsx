"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { get, productsApi } from '../../lib/api';
import { Store, Package, TrendingUp, DollarSign, Eye, Edit } from 'lucide-react';

function formatMoney(n, currency = 'USD') {
  const v = Number(n) || 0;
  if (currency === 'KES') return `KSh ${v.toFixed(2)}`;
  return `$${v.toFixed(2)}`;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [prodRes, ordRes] = await Promise.all([
          productsApi.listMine().catch(() => ({ products: [] })),
          get('/seller/orders').catch(() => ({ orders: [] }))
        ]);
        if (!cancelled) {
          setProducts(prodRes.products || []);
          setOrders(ordRes.orders || []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + Number(o.sellerSubtotal || 0), 0);
    const published = products.filter((p) => p.status === 'PUBLISHED').length;
    const buyers = new Set(
      orders.map((o) => o.buyerEmail).filter(Boolean)
    ).size;
    return {
      productCount: products.length,
      publishedCount: published,
      orderCount: orders.length,
      revenue,
      buyers
    };
  }, [products, orders]);

  const recentProducts = products.slice(0, 5);

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-soko-orange/10 rounded-lg">
                <Store className="text-soko-orange" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-soko-dark-teal">Seller Dashboard</h1>
                <p className="text-gray-600">
                  {user?.sellerProfile?.shopName || 'Your shop'} · Welcome, {user?.firstName}!
                </p>
              </div>
            </div>
            <Link
              href="/seller/products"
              className="bg-soko-orange text-white px-4 py-2 rounded-lg hover:bg-soko-dark-red font-semibold"
            >
              Manage products
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { name: 'Products', value: loading ? '…' : stats.productCount, icon: Package, sub: `${stats.publishedCount} published` },
              { name: 'Revenue', value: loading ? '…' : formatMoney(stats.revenue), icon: DollarSign, sub: 'From your line items' },
              { name: 'Orders', value: loading ? '…' : stats.orderCount, icon: TrendingUp, sub: 'Containing your items' },
              { name: 'Customers', value: loading ? '…' : stats.buyers, icon: Store, sub: 'Unique buyers' }
            ].map((stat) => (
              <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-soko-dark-teal">{stat.value}</p>
                    <p className="text-sm text-emerald-600">{stat.sub}</p>
                  </div>
                  <div className="p-3 bg-soko-orange/10 rounded-lg">
                    <stat.icon className="text-soko-orange" size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-soko-dark-teal">Recent Products</h2>
                <Link href="/seller/products" className="text-soko-orange text-sm font-semibold hover:underline">
                  View all
                </Link>
              </div>
              {loading ? (
                <p className="p-6 text-gray-500">Loading…</p>
              ) : recentProducts.length === 0 ? (
                <p className="p-6 text-gray-500">
                  No products yet.{' '}
                  <Link href="/seller/products" className="text-soko-orange font-medium">
                    Add your first product
                  </Link>
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentProducts.map((p) => (
                        <tr key={p.id}>
                          <td className="px-6 py-4 text-sm font-medium">{p.name}</td>
                          <td className="px-6 py-4 text-sm">{formatMoney(p.price, p.currency)}</td>
                          <td className="px-6 py-4 text-sm">{p.stock}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <Link href={`/products/${p.slug || p.id}`} className="text-soko-orange">
                              <Eye size={18} />
                            </Link>
                            <Link href="/seller/products" className="text-soko-dark-teal">
                              <Edit size={18} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-soko-dark-teal mb-4">Quick links</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/seller/products" className="text-soko-orange font-medium hover:underline">
                    Manage products
                  </Link>
                </li>
                <li>
                  <Link href="/seller/orders" className="text-soko-orange font-medium hover:underline">
                    View orders
                  </Link>
                </li>
                <li>
                  <Link href="/account/profile" className="text-soko-orange font-medium hover:underline">
                    Account profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

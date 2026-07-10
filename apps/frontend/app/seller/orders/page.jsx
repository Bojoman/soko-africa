"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Package, ArrowLeft, User } from 'lucide-react';
import { get } from '../../lib/api';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await get('/seller/orders');
        if (!cancelled) setOrders(data.orders || []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load orders');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-6 py-8">
          <div className="mb-6">
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to dashboard
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your orders</h1>
          <p className="text-gray-600 mb-8">
            Orders that include products you fulfill.
          </p>

          {loading && (
            <p className="text-gray-500">Loading orders…</p>
          )}
          {error && (
            <p className="text-red-600">{error}</p>
          )}
          {!loading && !error && orders.length === 0 && (
            <div className="bg-white rounded-lg shadow p-10 text-center text-gray-600">
              <Package className="mx-auto mb-3 text-gray-400" size={48} />
              <p>No customer orders for your shop yet.</p>
            </div>
          )}

          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-lg shadow border border-gray-100 p-6"
              >
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order</p>
                    <p className="font-mono font-semibold text-gray-900">{o.id}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Your subtotal</p>
                    <p className="text-xl font-bold text-orange-600">
                      {o.currency === 'KES' ? 'KSh ' : '$'}
                      {Number(o.sellerSubtotal).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{o.status}</p>
                  </div>
                </div>

                {(o.buyerName || o.buyerEmail) && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                    <User size={16} className="text-gray-400" />
                    <span>{o.buyerName || o.buyerEmail}</span>
                    {o.buyerName && o.buyerEmail && (
                      <span className="text-gray-400">· {o.buyerEmail}</span>
                    )}
                  </div>
                )}

                {o.tracking && (
                  <p className="text-sm text-blue-700 mb-4">
                    Tracking: {o.tracking}
                  </p>
                )}

                <ul className="divide-y divide-gray-100 border-t border-gray-100">
                  {(o.lineItems || []).map((line) => (
                    <li key={line.id} className="py-3 flex justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {line.product?.name || 'Product'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty {line.quantity} · {line.fulfillmentStatus}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {o.currency === 'KES' ? 'KSh ' : '$'}
                        {(line.unitPrice * line.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

"use client";
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Package, ArrowLeft, MapPin, Truck, User } from 'lucide-react';
import { get } from '../../lib/api';
import { formatMoney, formatQuantity } from '../../lib/product-utils';
import { lineTotal } from '../../lib/cart-totals';

/** Button label for each transition the API says is available. */
const ACTION_LABEL = {
  PROCESSING: 'Start preparing',
  SHIPPED: 'Mark shipped',
  DELIVERED: 'Mark delivered',
  CANCELLED: 'Cancel item'
};

const STATUS_STYLE = {
  UNFULFILLED: 'bg-gray-100 text-gray-700',
  PROCESSING: 'bg-amber-100 text-amber-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-700'
};

function statusLabel(status) {
  return String(status || '').toLowerCase().replace(/_/g, ' ');
}

function AddressBlock({ address }) {
  if (!address) return null;
  const parts = [
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(', '),
    address.postalCode,
    address.country
  ].filter(Boolean);

  return (
    <div className="flex items-start gap-2 text-sm text-gray-700 mb-4">
      <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
      <div>
        {address.name && <p className="font-medium">{address.name}</p>}
        <p className="text-gray-600">{parts.join(' · ')}</p>
      </div>
    </div>
  );
}

/** Carrier + tracking for this seller's parcel. */
function ShipmentForm({ order, onSaved }) {
  const [carrier, setCarrier] = useState(order.shipment?.carrier || '');
  const [tracking, setTracking] = useState(order.shipment?.trackingNumber || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const dirty =
    carrier !== (order.shipment?.carrier || '') ||
    tracking !== (order.shipment?.trackingNumber || '');

  async function save() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/seller/orders/${order.id}/shipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carrier, trackingNumber: tracking })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Could not save tracking');
      onSaved();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
        <Truck size={16} className="text-gray-400" />
        Shipping details
      </div>
      <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
        <input
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          placeholder="Carrier (e.g. Sendy)"
          className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-soko-orange focus:outline-none"
        />
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="Tracking number"
          className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-soko-orange focus:outline-none"
        />
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="rounded-lg bg-soko-dark-teal px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyItem, setBusyItem] = useState(null);
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await get('/seller/orders');
      setOrders(data.orders || []);
    } catch (e) {
      setError(e.message || 'Could not load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * The API is the authority on which transitions are legal, so the buttons
   * come from `line.nextStatuses` rather than being re-derived here.
   */
  async function advance(orderId, line, status) {
    if (status === 'CANCELLED' && !window.confirm('Cancel this item?')) return;
    setBusyItem(line.id);
    setActionError('');
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/items/${line.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: status })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Could not update item');
      await load();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusyItem(null);
    }
  }

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

          {loading && <p className="text-gray-500">Loading orders…</p>}
          {error && <p className="text-red-600">{error}</p>}
          {actionError && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionError}
            </p>
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
                      {formatMoney(o.sellerSubtotal, o.currency)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {statusLabel(o.status)}
                    </p>
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

                {/* Sellers could not previously see where to send anything. */}
                <AddressBlock address={o.shippingAddress} />

                <ul className="divide-y divide-gray-100 border-t border-gray-100">
                  {(o.lineItems || []).map((line) => (
                    <li key={line.id} className="py-3">
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">
                            {line.product?.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty {formatQuantity(line.quantity, line, { force: true })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                            {formatMoney(
                              lineTotal({
                                price: line.unitPrice,
                                quantity: line.quantity,
                                currency: o.currency
                              }),
                              o.currency
                            )}
                          </p>
                          <span
                            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                              STATUS_STYLE[line.fulfillmentStatus] ||
                              STATUS_STYLE.UNFULFILLED
                            }`}
                          >
                            {statusLabel(line.fulfillmentStatus)}
                          </span>
                        </div>
                      </div>

                      {(line.nextStatuses || []).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {line.nextStatuses.map((status) => (
                            <button
                              key={status}
                              type="button"
                              disabled={busyItem === line.id}
                              onClick={() => advance(o.id, line, status)}
                              className={`rounded-lg px-3 py-1.5 text-sm font-semibold disabled:opacity-50 ${
                                status === 'CANCELLED'
                                  ? 'border border-red-200 text-red-700 hover:bg-red-50'
                                  : 'bg-soko-orange text-white hover:bg-soko-dark-red'
                              }`}
                            >
                              {ACTION_LABEL[status] || statusLabel(status)}
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {o.fulfillable ? (
                  <ShipmentForm order={o} onSaved={load} />
                ) : (
                  <p className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    Waiting on payment — nothing to fulfil yet.
                  </p>
                )}
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

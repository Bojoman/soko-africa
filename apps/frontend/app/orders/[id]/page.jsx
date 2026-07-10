"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { formatMoney, PLACEHOLDER_PRODUCT_IMAGE } from '../../lib/product-utils';
import { getOrder, pollMpesaStatus } from '../../lib/payments';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Package,
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone
} from 'lucide-react';

const PROVIDER_ICON = {
  STRIPE: CreditCard,
  PAYPAL: Wallet,
  MPESA: Smartphone
};

function statusStyle(status) {
  switch (status) {
    case 'PAID':
      return {
        label: 'Payment received',
        icon: CheckCircle2,
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    case 'PENDING_PAYMENT':
      return {
        label: 'Awaiting payment',
        icon: Clock,
        classes: 'bg-amber-50 text-amber-700 border-amber-200'
      };
    case 'FAILED':
      return {
        label: 'Payment failed',
        icon: XCircle,
        classes: 'bg-red-50 text-red-700 border-red-200'
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        icon: XCircle,
        classes: 'bg-gray-50 text-gray-700 border-gray-200'
      };
    case 'REFUNDED':
      return {
        label: 'Refunded',
        icon: Package,
        classes: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    default:
      return {
        label: status || 'Processing',
        icon: Loader2,
        classes: 'bg-gray-50 text-gray-700 border-gray-200 animate-pulse'
      };
  }
}

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useMemo(
    () => async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data.order);
        setError(null);
        return data.order;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [orderId]
  );

  useEffect(() => {
    if (!orderId) return undefined;
    fetchOrder();
    // Poll every 3s while the order isn't in a terminal state.
    const interval = setInterval(async () => {
      const next = await fetchOrder();
      const terminal = ['PAID', 'FAILED', 'CANCELLED', 'REFUNDED'];
      if (next && terminal.includes(next.status)) {
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId, fetchOrder]);

  // For M-Pesa, also ping the dedicated status endpoint so the backend
  // gets a chance to query Daraja and finalize the payment.
  useEffect(() => {
    if (!order) return undefined;
    const inflight = (order.payments || []).find(
      (p) =>
        p.provider === 'MPESA' &&
        (p.status === 'INITIATED' || p.status === 'PENDING')
    );
    if (!inflight?.providerRef) return undefined;
    const interval = setInterval(async () => {
      try {
        await pollMpesaStatus(inflight.providerRef);
      } catch {
        // ignore — order poller will surface the real state
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <Loader2 className="mx-auto animate-spin text-soko-orange" size={36} />
          <p className="mt-4 text-soko-dark-teal">Loading your order…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <XCircle className="mx-auto text-red-500" size={48} />
          <h1 className="mt-4 text-2xl font-extrabold text-soko-dark-teal">
            Order not found
          </h1>
          <p className="mt-2 text-gray-500">{error || 'It may have expired.'}</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold"
          >
            <ArrowLeft size={16} /> Browse products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const meta = statusStyle(order.status);
  const StatusIcon = meta.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-gray-400">
              Order
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-soko-dark-teal break-all">
              #{order.id}
            </h1>
            <p className="text-sm text-gray-500">
              Placed {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <Link
            href="/orders"
            className="text-sm font-semibold text-soko-dark-teal hover:text-soko-orange inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> All my orders
          </Link>
        </header>

        <section
          className={`rounded-2xl border p-6 flex items-center gap-4 ${meta.classes}`}
        >
          <StatusIcon size={28} className="shrink-0" />
          <div className="flex-1">
            <p className="text-lg font-bold">{meta.label}</p>
            <p className="text-sm opacity-80">
              {order.status === 'PENDING_PAYMENT'
                ? 'Waiting for your payment to settle. This page auto-refreshes.'
                : order.status === 'PAID'
                ? 'Thanks! Your payment has been received and your order is on its way.'
                : null}
            </p>
          </div>
          <p className="text-2xl font-extrabold whitespace-nowrap">
            {formatMoney(order.total, order.currency)}
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-soko-dark-teal mb-4">Items</h2>
          <ul className="divide-y divide-gray-100">
            {(order.products || []).map((p, idx) => (
              <li key={`${p.id}-${idx}`} className="py-3 flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl bg-gray-100 bg-cover bg-center shrink-0"
                  style={{
                    backgroundImage: `url(${p.image || PLACEHOLDER_PRODUCT_IMAGE})`
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-soko-dark-teal truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty {p.quantity} · {formatMoney(p.price, order.currency)} each
                  </p>
                </div>
                <p className="font-bold text-soko-dark-teal whitespace-nowrap">
                  {formatMoney(p.price * p.quantity, order.currency)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-soko-dark-teal mb-4">
            Payment attempts
          </h2>
          {(!order.payments || order.payments.length === 0) ? (
            <p className="text-sm text-gray-500">No payments recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {order.payments.map((p) => {
                const Icon = PROVIDER_ICON[p.provider] || CreditCard;
                return (
                  <li key={p.id} className="py-3 flex items-center gap-4">
                    <Icon size={20} className="text-soko-dark-teal shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-soko-dark-teal">
                        {p.provider}
                      </p>
                      <p className="text-xs text-gray-500 break-all">
                        Ref: {p.providerRef || '—'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                        p.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.status === 'FAILED' || p.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {order.shippingAddress || order.shippingAddressJson ? (
          <section className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-soko-dark-teal mb-3">
              Shipping to
            </h2>
            <p className="text-sm text-soko-dark-teal font-semibold">
              {order.shippingAddress?.name ||
                order.shippingAddressJson?.name ||
                'Customer'}
            </p>
            <p className="text-sm text-gray-500">
              {(order.shippingAddress?.address || order.shippingAddressJson?.line1) ?? '—'},{' '}
              {(order.shippingAddress?.city || order.shippingAddressJson?.city) ?? ''}{' '}
              {(order.shippingAddress?.postalCode ||
                order.shippingAddressJson?.postalCode) ?? ''},{' '}
              {(order.shippingAddress?.country ||
                order.shippingAddressJson?.country) ?? ''}
            </p>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

"use client";
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { useCart } from '../hooks/useCart';
import {
  PLACEHOLDER_PRODUCT_IMAGE,
  formatMoney,
  formatUnitPrice
} from '../lib/product-utils';
import {
  computeOrderTotals,
  couponLabel,
  lineTotal,
  normalizeCartLineItems,
  validateCouponCode
} from '../lib/cart-totals';
import QuantityStepper from '../components/products/QuantityStepper';
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  RefreshCcw,
  ShoppingBag,
  Shield,
  Tag,
  Trash2,
  Truck,
  XCircle
} from 'lucide-react';


function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
    appliedCoupon,
    setAppliedCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const cartItems = useMemo(
    () =>
      normalizeCartLineItems(cart).map((item) => ({
        ...item,
        image: item.image || PLACEHOLDER_PRODUCT_IMAGE,
        seller: item.seller || 'SokoAfrica Seller',
        category: item.category || 'Marketplace'
      })),
    [cart]
  );

  // The summary used to call formatMoney with no currency, so a KES cart's
  // totals rendered as "$270.00" while each line above them read "KES".
  const currency = cartItems[0]?.currency || 'USD';

  const totals = useMemo(
    () =>
      computeOrderTotals(cartItems, {
        shippingMethod: 'standard',
        appliedCoupon
      }),
    [cartItems, appliedCoupon]
  );

  const {
    subtotal,
    couponDiscount,
    shipping,
    total
  } = totals;

  const applyCoupon = async () => {
    setCouponError('');
    setCouponLoading(true);
    try {
      const coupon = await validateCouponCode(couponInput);
      setAppliedCoupon(coupon);
      setCouponInput(coupon.code);
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-40 bg-white rounded-2xl border border-gray-100" />
            <div className="h-40 bg-white rounded-2xl border border-gray-100" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-soko-orange">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-soko-dark-teal font-medium">Cart</span>
        </nav>

        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-soko-dark-teal">
              Your <span className="text-soko-orange">cart</span>
            </h1>
            <p className="text-gray-500 mt-1">
              {cartItems.length === 0
                ? 'Your cart is empty.'
                : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} ready to ship.`}
            </p>
          </div>
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="hidden sm:inline-flex items-center gap-1 text-sm text-soko-dark-red hover:text-soko-orange font-semibold"
            >
              <Trash2 size={14} /> Clear cart
            </button>
          )}
        </header>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl text-center py-20 px-6">
            <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-soko-dark-teal mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              Browse the catalog to discover authentic African products and add
              them to your cart.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors"
            >
              Browse products <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items list */}
            <section className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                // Same per-line rounding as the server, so this figure and the
                // amount charged can never disagree by a cent.
                const itemTotal = lineTotal(item);
                return (
                  <article
                    key={`${item.id}-${JSON.stringify(item.selectedVariant)}`}
                    className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 96px, 128px"
                          className="object-cover"
                          unoptimized={isHttpUrl(item.image)}
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                                {item.category}
                              </p>
                              <Link
                                href={`/products/${item.slug || item.id}`}
                                className="block text-base sm:text-lg font-bold text-soko-dark-teal hover:text-soko-orange transition-colors truncate"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-gray-500 mt-1">
                                by{' '}
                                <span className="font-medium text-gray-700">
                                  {item.seller}
                                </span>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id, item.selectedVariant)}
                              className="text-gray-400 hover:text-soko-dark-red"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                          <QuantityStepper
                            product={item}
                            value={item.quantity}
                            size="sm"
                            onChange={(next) =>
                              updateQuantity(item.id, next, item.selectedVariant)
                            }
                          />
                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              {formatUnitPrice(item)}
                            </p>
                            <p className="text-lg font-extrabold text-soko-dark-teal">
                              {formatMoney(itemTotal, item.currency)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center text-sm font-semibold text-soko-dark-teal hover:text-soko-orange"
                >
                  <ChevronRight size={16} className="rotate-180 mr-1" /> Continue
                  shopping
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="sm:hidden inline-flex items-center gap-1 text-sm text-soko-dark-red hover:text-soko-orange font-semibold"
                >
                  <Trash2 size={14} /> Clear cart
                </button>
              </div>
            </section>

            {/* Summary */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-soko-dark-teal mb-6">
                  Order summary
                </h2>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Subtotal</dt>
                    <dd className="font-semibold text-soko-dark-teal">
                      {formatMoney(subtotal, currency)}
                    </dd>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <dt>Coupon ({appliedCoupon.code})</dt>
                      <dd>-{formatMoney(couponDiscount, currency)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Estimated shipping</dt>
                    <dd className="font-semibold text-soko-dark-teal">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        formatMoney(shipping, currency)
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <dt className="font-bold text-soko-dark-teal">Total</dt>
                    <dd className="text-2xl font-extrabold text-soko-orange">
                      {formatMoney(total, currency)}
                    </dd>
                  </div>
                </dl>

                {/* Coupon */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <label
                    htmlFor="coupon"
                    className="text-xs uppercase tracking-wider font-bold text-soko-dark-teal flex items-center gap-1 mb-2"
                  >
                    <Tag size={12} /> Promo code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon"
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. SOKO10"
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-2 focus:ring-soko-orange/30"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="px-4 py-2 text-sm font-bold rounded-lg bg-soko-dark-teal text-white hover:bg-soko-dark-teal/90 disabled:opacity-60"
                    >
                      {couponLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-emerald-700">
                      <CheckCircle size={14} /> {couponLabel(appliedCoupon)} applied
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="ml-auto text-gray-500 hover:text-soko-dark-red"
                      >
                        Remove
                      </button>
                    </p>
                  )}
                  {couponError && !appliedCoupon && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-soko-dark-red">
                      <XCircle size={14} /> {couponError}
                    </p>
                  )}
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors"
                >
                  Checkout <ArrowRight size={18} />
                </Link>

                <ul className="mt-6 space-y-2 text-xs text-gray-500">
                  <li className="flex items-center gap-2">
                    <Shield size={14} className="text-emerald-600" /> SSL secure
                    checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <Truck size={14} className="text-soko-orange" /> Ships across
                    Africa & globally
                  </li>
                  <li className="flex items-center gap-2">
                    <RefreshCcw size={14} className="text-soko-bright-cyan" />{' '}
                    30-day return window
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

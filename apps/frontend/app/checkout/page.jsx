"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import {
  PLACEHOLDER_PRODUCT_IMAGE,
  formatLineLabel,
  formatMoney,
  formatQuantity,
  getQuantityBounds
} from '../lib/product-utils';
import {
  CHECKOUT_STEP_FIELDS,
  checkoutSchema
} from '../lib/validations';
import { FormInput } from '../components/forms/FormInput';
import { FormSelect } from '../components/forms/FormSelect';
import { FormCheckbox } from '../components/forms/FormCheckbox';
import { FormRadioGroup } from '../components/forms/FormRadioGroup';
import { FormAlert } from '../components/forms/FormAlert';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShoppingBag,
  Smartphone,
  Truck,
  User,
  Wallet
} from 'lucide-react';
import {
  computeOrderTotals,
  couponLabel,
  lineTotal,
  normalizeCartLineItems,
  SHIPPING_EXPRESS,
  SHIPPING_STANDARD
} from '../lib/cart-totals';
import {
  createPaypalOrder,
  capturePaypal,
  createStripeIntent,
  startMpesaStk,
  pollMpesaStatus,
  pollUntilTerminal
} from '../lib/payments';

const STEPS = [
  { id: 1, key: 'contact', label: 'Contact', icon: Mail },
  { id: 2, key: 'shipping', label: 'Shipping', icon: Truck },
  { id: 3, key: 'payment', label: 'Payment', icon: CreditCard },
  { id: 4, key: 'review', label: 'Review', icon: Shield }
];

const SHIPPING_METHODS = [
  {
    value: 'standard',
    label: 'Standard',
    description: `5–10 business days · $${SHIPPING_STANDARD.toFixed(2)}`,
    icon: Truck
  },
  {
    value: 'express',
    label: 'Express',
    description: `2–4 business days · $${SHIPPING_EXPRESS.toFixed(2)}`,
    icon: Truck
  }
];

const PAYMENT_METHODS = [
  {
    value: 'card',
    label: 'Credit / Debit card',
    description: 'Visa, Mastercard, Amex (powered by Stripe)',
    icon: CreditCard
  },
  {
    value: 'paypal',
    label: 'PayPal',
    description: 'Pay with your PayPal balance or linked card',
    icon: Wallet
  },
  {
    value: 'mpesa',
    label: 'M-Pesa',
    description: 'Daraja STK push to your phone',
    icon: Smartphone
  }
];

const COUNTRIES = [
  'Kenya',
  'Uganda',
  'Tanzania',
  'Rwanda',
  'Nigeria',
  'Ghana',
  'South Africa',
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Australia'
];

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function normalizeKenyanPhone(input) {
  if (!input) return null;
  let s = String(input).replace(/\s|-|\(|\)|\+/g, '');
  if (s.startsWith('07') || s.startsWith('01')) s = '254' + s.slice(1);
  else if (s.startsWith('7') || s.startsWith('1')) s = '254' + s;
  if (!/^2547\d{8}$|^2541\d{8}$/.test(s)) return null;
  return s;
}

/**
 * Lazy-loaded Stripe context. Lives in a separate module so the checkout
 * page tree-shakes Stripe out when the publishable key is missing (e.g. on
 * preview builds without env vars).
 */
function StripeCardSection({ orderId, total, currency, onSuccess, onError }) {
  const [stripeBundle, setStripeBundle] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(false);

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    let active = true;
    if (!publishableKey) return undefined;
    (async () => {
      const [{ loadStripe }, reactStripe] = await Promise.all([
        import('@stripe/stripe-js'),
        import('@stripe/react-stripe-js')
      ]);
      if (!active) return;
      const stripePromise = loadStripe(publishableKey);
      setStripeBundle({ stripePromise, ...reactStripe });
    })().catch((err) => {
      onError?.(`Failed to load Stripe: ${err.message}`);
    });
    return () => {
      active = false;
    };
  }, [publishableKey, onError]);

  useEffect(() => {
    let cancelled = false;
    if (!orderId) return undefined;
    setLoadingIntent(true);
    createStripeIntent(orderId)
      .then((res) => {
        if (cancelled) return;
        setClientSecret(res.clientSecret);
      })
      .catch((err) => {
        if (!cancelled) onError?.(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingIntent(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, onError]);

  if (!publishableKey) {
    return (
      <FormAlert
        type="error"
        message="Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable card payments."
      />
    );
  }
  if (!stripeBundle || !clientSecret) {
    return (
      <div className="flex items-center gap-3 text-soko-dark-teal text-sm">
        <Loader2 className="animate-spin" size={18} />
        {loadingIntent ? 'Preparing secure card form…' : 'Loading Stripe…'}
      </div>
    );
  }

  const { Elements, PaymentElement, useStripe, useElements } = stripeBundle;

  function StripeForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);

    async function handleConfirm(e) {
      e.preventDefault();
      if (!stripe || !elements) return;
      setSubmitting(true);
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${orderId}`
        },
        redirect: 'if_required'
      });
      setSubmitting(false);
      if (error) {
        onError?.(error.message || 'Card payment failed');
        return;
      }
      if (paymentIntent?.status === 'succeeded') {
        onSuccess?.({ paymentIntentId: paymentIntent.id });
      } else if (paymentIntent?.status === 'processing') {
        // The webhook will finalise — treat as soft success for UI flow.
        onSuccess?.({ paymentIntentId: paymentIntent.id, pending: true });
      } else {
        onError?.(`Unexpected payment state: ${paymentIntent?.status}`);
      }
    }

    return (
      <form onSubmit={handleConfirm} className="space-y-4">
        <PaymentElement />
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Charging…
            </>
          ) : (
            <>
              <Lock size={16} /> Pay {formatMoney(total, currency)}
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <Elements
      stripe={stripeBundle.stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#f97316',
            colorBackground: '#ffffff',
            colorText: '#0f3a3a',
            borderRadius: '12px'
          }
        }
      }}
    >
      <StripeForm />
    </Elements>
  );
}

function PayPalSection({ orderId, total, currency, onSuccess, onError }) {
  const [bundle, setBundle] = useState(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    let active = true;
    if (!clientId) return undefined;
    import('@paypal/react-paypal-js')
      .then((mod) => {
        if (active) setBundle(mod);
      })
      .catch((err) => onError?.(`Failed to load PayPal: ${err.message}`));
    return () => {
      active = false;
    };
  }, [clientId, onError]);

  if (!clientId) {
    return (
      <FormAlert
        type="error"
        message="PayPal is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID to enable PayPal."
      />
    );
  }
  if (!bundle) {
    return (
      <div className="flex items-center gap-3 text-soko-dark-teal text-sm">
        <Loader2 className="animate-spin" size={18} /> Loading PayPal…
      </div>
    );
  }

  const { PayPalScriptProvider, PayPalButtons } = bundle;

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: (currency || 'USD').toUpperCase(),
        intent: 'capture'
      }}
    >
      <div className="rounded-xl border border-gray-100 p-4">
        <p className="text-sm text-gray-500 mb-3">
          You&apos;ll be sent to PayPal to approve {formatMoney(total, currency)}, then
          returned to Soko Africa.
        </p>
        <PayPalButtons
          style={{ layout: 'vertical', shape: 'rect', color: 'gold' }}
          createOrder={async () => {
            try {
              const res = await createPaypalOrder(orderId, {
                returnUrl: `${window.location.origin}/orders/${orderId}`,
                cancelUrl: `${window.location.origin}/checkout`
              });
              return res.paypalOrderId;
            } catch (err) {
              onError?.(err.message);
              throw err;
            }
          }}
          onApprove={async (data) => {
            try {
              const res = await capturePaypal(data.orderID);
              if (res.status === 'SUCCESS') {
                onSuccess?.({ paypalOrderId: data.orderID });
              } else {
                onError?.('PayPal capture failed');
              }
            } catch (err) {
              onError?.(err.message);
            }
          }}
          onCancel={() => onError?.('Payment cancelled')}
          onError={(err) => onError?.(err?.message || 'PayPal error')}
        />
      </div>
    </PayPalScriptProvider>
  );
}

function MpesaSection({ orderId, total, currency, phoneDefault, onSuccess, onError }) {
  const [phone, setPhone] = useState(phoneDefault || '');
  const [stkState, setStkState] = useState('idle'); // idle | initiating | waiting | success | failed
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [message, setMessage] = useState('');
  const inFlightRef = useRef(false);

  async function trigger({ forceNew = false } = {}) {
    if (inFlightRef.current || stkState === 'success') return;
    setMessage('');
    const phoneE164 = normalizeKenyanPhone(phone);
    if (!phoneE164) {
      setMessage('Enter a valid Kenyan phone (e.g. 2547XXXXXXXX)');
      return;
    }
    inFlightRef.current = true;
    setStkState('initiating');
    try {
      const res = await startMpesaStk(orderId, phoneE164, { forceNew });
      setCheckoutRequestId(res.checkoutRequestId);
      setMessage(
        res.reused
          ? res.customerMessage || 'A payment prompt is already on your phone'
          : res.customerMessage || 'Check your phone for the M-Pesa prompt'
      );
      setStkState('waiting');
      const final = await pollUntilTerminal(
        () => pollMpesaStatus(res.checkoutRequestId),
        { intervalMs: 3000, timeoutMs: 120000 }
      );
      if (final.status === 'SUCCESS') {
        setStkState('success');
        onSuccess?.({ checkoutRequestId: res.checkoutRequestId });
      } else {
        setStkState('failed');
        setMessage(
          final.status === 'CANCELLED'
            ? 'You cancelled the payment on your phone'
            : 'Payment was not completed'
        );
        onError?.(`M-Pesa: ${final.status}`);
      }
    } catch (err) {
      setStkState('failed');
      if (err.code === 'TIMEOUT') {
        setMessage(
          'Still waiting for confirmation. If you already paid on your phone, refresh your orders — do not send another prompt unless payment failed.'
        );
      } else {
        setMessage(err.message || 'Could not start M-Pesa payment');
      }
      onError?.(err.message);
    } finally {
      inFlightRef.current = false;
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-soko-dark-teal">
        M-Pesa phone (Safaricom)
      </label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="2547XXXXXXXX"
        disabled={stkState === 'initiating' || stkState === 'waiting' || stkState === 'success'}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-soko-dark-teal focus:outline-none focus:ring-2 focus:ring-soko-orange disabled:opacity-60"
      />
      <button
        type="button"
        onClick={() => trigger({ forceNew: stkState === 'failed' })}
        disabled={stkState === 'initiating' || stkState === 'waiting' || stkState === 'success'}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors disabled:opacity-60"
      >
        {stkState === 'initiating' && (
          <>
            <Loader2 className="animate-spin" size={16} /> Sending STK prompt…
          </>
        )}
        {stkState === 'waiting' && (
          <>
            <Loader2 className="animate-spin" size={16} /> Waiting for your phone…
          </>
        )}
        {stkState === 'success' && (
          <>
            <Check size={16} /> Payment received
          </>
        )}
        {stkState === 'idle' && (
          <>
            <Smartphone size={16} /> Pay {formatMoney(total, currency)} via M-Pesa
          </>
        )}
        {stkState === 'failed' && (
          <>
            <Smartphone size={16} /> Retry M-Pesa payment
          </>
        )}
      </button>
      {message && (
        <p
          className={`text-sm ${
            stkState === 'failed' ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {message}
        </p>
      )}
      {checkoutRequestId && (
        <p className="text-[10px] text-gray-400 break-all">
          Ref: {checkoutRequestId}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, isLoading: cartLoading, appliedCoupon } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [orderError, setOrderError] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const idempotencyKeyRef = useRef(null);
  const createOrderInFlightRef = useRef(null);

  if (!idempotencyKeyRef.current && typeof crypto !== 'undefined') {
    idempotencyKeyRef.current =
      crypto.randomUUID?.() || `idem-${Date.now()}-${Math.random()}`;
  }

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
      email: user?.email || '',
      phone: user?.phone || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Kenya',
      shippingMethod: 'standard',
      paymentMethod: 'card',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardName: '',
      mpesaPhone: '',
      saveCard: false,
      agreeToTerms: false
    }
  });

  const { handleSubmit, watch, trigger, formState, getValues } = methods;
  const shippingMethod = watch('shippingMethod');
  const paymentMethod = watch('paymentMethod');

  const cartItems = useMemo(
    () =>
      normalizeCartLineItems(cart).map((item) => ({
        ...item,
        image: item.image || PLACEHOLDER_PRODUCT_IMAGE,
        seller: item.seller || 'SokoAfrica Seller'
      })),
    [cart]
  );

  const orderTotals = useMemo(
    () =>
      computeOrderTotals(cartItems, {
        shippingMethod,
        appliedCoupon
      }),
    [cartItems, shippingMethod, appliedCoupon]
  );

  const {
    subtotal,
    couponDiscount,
    shipping: shippingCost,
    tax,
    total
  } = orderTotals;
  const currency = cartItems[0]?.currency || 'USD';

  const canSubmit = cartItems.length > 0;

  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1));

  const goNext = async () => {
    const stepKey = STEPS[currentStep - 1].key;
    const fields = CHECKOUT_STEP_FIELDS[stepKey];
    const valid = await trigger(fields, { shouldFocus: true });
    if (!valid) return;
    setCurrentStep((s) => Math.min(STEPS.length, s + 1));
  };

  const ensureOrder = useCallback(async () => {
    if (orderId) return orderId;
    if (createOrderInFlightRef.current) return createOrderInFlightRef.current;

    setCreatingOrder(true);
    setOrderError('');
    const run = (async () => {
      try {
        const values = getValues();
        const payload = {
          items: cartItems.map((it) => ({
            id: it.id,
            productId: it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            image: it.image,
            currency: it.currency
          })),
          contact: { email: values.email, phone: values.phone },
          shippingAddress: {
            firstName: values.firstName,
            lastName: values.lastName,
            name: `${values.firstName} ${values.lastName}`.trim(),
            line1: values.address,
            city: values.city,
            region: values.state,
            state: values.state,
            postalCode: values.postalCode,
            country: values.country
          },
          totals: {
            subtotal,
            shipping: shippingCost,
            tax,
            total
          },
          currency,
          shippingMethod: values.shippingMethod,
          couponCode: appliedCoupon?.code || undefined,
          paymentMethod: values.paymentMethod
        };
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKeyRef.current
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message || `Order failed (${res.status})`);
        }
        setOrderId(data.orderId);
        return data.orderId;
      } catch (err) {
        setOrderError(err.message);
        return null;
      } finally {
        setCreatingOrder(false);
        createOrderInFlightRef.current = null;
      }
    })();

    createOrderInFlightRef.current = run;
    return run;
  }, [
    orderId,
    cartItems,
    getValues,
    subtotal,
    shippingCost,
    tax,
    total,
    currency,
    appliedCoupon
  ]);

  const handlePaymentSuccess = useCallback(() => {
    if (!orderId) return;
    clearCart();
    router.push(`/orders/${orderId}`);
  }, [clearCart, router, orderId]);

  const handlePaymentError = useCallback((message) => {
    setOrderError(message || 'Payment failed');
  }, []);

  const onPlaceOrder = async () => {
    setOrderError('');
    if (cartItems.length === 0) {
      setOrderError('Your cart is empty.');
      return;
    }
    await ensureOrder();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-soko-orange">
            Home
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/cart" className="hover:text-soko-orange">
            Cart
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-soko-dark-teal font-medium">Checkout</span>
        </nav>

        <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-soko-dark-teal">
              Secure <span className="text-soko-orange">checkout</span>
            </h1>
            <p className="text-gray-500 mt-1">
              Almost there — finish your order in a few quick steps.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex items-center text-sm font-semibold text-soko-dark-teal hover:text-soko-orange"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to cart
          </Link>
        </header>

        {!cartLoading && cartItems.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl text-center py-16 px-6">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-soko-dark-teal mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Add a few items before heading to checkout.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onPlaceOrder)} noValidate>
              <ol className="mb-10 grid grid-cols-4 gap-2 sm:gap-4">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isDone = currentStep > step.id;
                  return (
                    <li key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : isActive
                            ? 'bg-soko-orange border-soko-orange text-white'
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}
                      >
                        {isDone ? <Check size={18} /> : <Icon size={18} />}
                      </div>
                      <span
                        className={`mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-center ${
                          isActive ? 'text-soko-orange' : 'text-soko-dark-teal'
                        }`}
                      >
                        {step.id}. {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {orderError && (
                    <FormAlert message={orderError} type="error" />
                  )}

                  {currentStep === 1 && (
                    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                      <header>
                        <h2 className="text-xl font-bold text-soko-dark-teal">
                          Contact details
                        </h2>
                        <p className="text-sm text-gray-500">
                          We&apos;ll send your order updates to this contact.
                        </p>
                      </header>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput
                          name="email"
                          label="Email"
                          type="email"
                          placeholder="you@example.com"
                          icon={Mail}
                        />
                        <FormInput
                          name="phone"
                          label="Phone"
                          type="tel"
                          placeholder="+254 700 000 000"
                          icon={Phone}
                        />
                      </div>
                    </section>
                  )}

                  {currentStep === 2 && (
                    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                      <header>
                        <h2 className="text-xl font-bold text-soko-dark-teal">
                          Shipping address
                        </h2>
                        <p className="text-sm text-gray-500">
                          Where should we deliver your order?
                        </p>
                      </header>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput
                          name="firstName"
                          label="First name"
                          icon={User}
                          placeholder="John"
                        />
                        <FormInput
                          name="lastName"
                          label="Last name"
                          icon={User}
                          placeholder="Doe"
                        />
                        <div className="sm:col-span-2">
                          <FormInput
                            name="address"
                            label="Street address"
                            icon={MapPin}
                            placeholder="123 Mombasa Road"
                          />
                        </div>
                        <FormInput name="city" label="City" placeholder="Nairobi" />
                        <FormInput
                          name="state"
                          label="State / Province"
                          placeholder="Nairobi County"
                        />
                        <FormInput
                          name="postalCode"
                          label="Postal code"
                          placeholder="00100"
                        />
                        <FormSelect name="country" label="Country">
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </FormSelect>
                      </div>
                      <FormRadioGroup
                        name="shippingMethod"
                        label="Shipping method"
                        options={SHIPPING_METHODS}
                        selectedValue={shippingMethod}
                      />
                    </section>
                  )}

                  {currentStep === 3 && (
                    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                      <header>
                        <h2 className="text-xl font-bold text-soko-dark-teal">
                          Payment method
                        </h2>
                        <p className="text-sm text-gray-500">
                          Choose how you&apos;d like to pay. Card details are
                          collected securely by Stripe; PayPal redirects you
                          for approval; M-Pesa sends a prompt to your phone.
                        </p>
                      </header>
                      <FormRadioGroup
                        name="paymentMethod"
                        options={PAYMENT_METHODS}
                        selectedValue={paymentMethod}
                      />
                      {paymentMethod === 'mpesa' && (
                        <FormInput
                          name="mpesaPhone"
                          label="M-Pesa phone (used to pre-fill the next step)"
                          icon={Smartphone}
                          placeholder="2547XXXXXXXX"
                          type="tel"
                        />
                      )}
                    </section>
                  )}

                  {currentStep === 4 && (
                    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                      <header>
                        <h2 className="text-xl font-bold text-soko-dark-teal">
                          Review your order
                        </h2>
                        <p className="text-sm text-gray-500">
                          Confirm the details below, then complete payment.
                        </p>
                      </header>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="rounded-xl border border-gray-100 p-4">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                            Contact
                          </p>
                          <p className="font-semibold text-soko-dark-teal">
                            {watch('email')}
                          </p>
                          <p className="text-gray-500">{watch('phone')}</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 p-4">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                            Shipping to
                          </p>
                          <p className="font-semibold text-soko-dark-teal">
                            {watch('firstName')} {watch('lastName')}
                          </p>
                          <p className="text-gray-500">
                            {watch('address')}, {watch('city')}{' '}
                            {watch('postalCode')}, {watch('country')}
                          </p>
                        </div>
                        <div className="rounded-xl border border-gray-100 p-4">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                            Shipping method
                          </p>
                          <p className="font-semibold text-soko-dark-teal capitalize">
                            {watch('shippingMethod')}
                          </p>
                        </div>
                        <div className="rounded-xl border border-gray-100 p-4">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                            Payment method
                          </p>
                          <p className="font-semibold text-soko-dark-teal capitalize">
                            {paymentMethod === 'card'
                              ? 'Card (Stripe)'
                              : paymentMethod}
                          </p>
                        </div>
                      </div>

                      <FormCheckbox
                        name="agreeToTerms"
                        label="I agree to the Terms of Service and Privacy Policy."
                      />

                      {!orderId ? (
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                          <button
                            type="submit"
                            disabled={!canSubmit || creatingOrder || formState.isSubmitting}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors disabled:opacity-60"
                          >
                            {creatingOrder ? (
                              <>
                                <Loader2 className="animate-spin" size={16} />{' '}
                                Creating order…
                              </>
                            ) : (
                              <>
                                <Lock size={16} /> Place order &amp; pay{' '}
                                {formatMoney(total, currency)}
                              </>
                            )}
                          </button>
                          <p className="text-xs text-gray-500">
                            Your card / wallet won&apos;t be charged until you
                            confirm in the next step.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-soko-orange/30 bg-orange-50 p-5 space-y-4">
                          <p className="text-sm text-soko-dark-teal">
                            Order <span className="font-mono">{orderId}</span>{' '}
                            created in <strong>PENDING_PAYMENT</strong>. Complete
                            payment below to finalise.
                          </p>
                          {paymentMethod === 'card' && (
                            <StripeCardSection
                              orderId={orderId}
                              total={total}
                              currency={currency}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                            />
                          )}
                          {paymentMethod === 'paypal' && (
                            <PayPalSection
                              orderId={orderId}
                              total={total}
                              currency={currency}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                            />
                          )}
                          {paymentMethod === 'mpesa' && (
                            <MpesaSection
                              orderId={orderId}
                              total={total}
                              currency={currency}
                              phoneDefault={watch('mpesaPhone') || watch('phone')}
                              onSuccess={handlePaymentSuccess}
                              onError={handlePaymentError}
                            />
                          )}
                        </div>
                      )}
                    </section>
                  )}

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={currentStep === 1}
                      className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl border-2 border-soko-dark-teal text-soko-dark-teal font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-soko-dark-teal hover:text-white transition-colors"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    {currentStep < STEPS.length && (
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-soko-orange hover:bg-soko-dark-red text-white font-bold transition-colors"
                      >
                        Continue <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <aside className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-soko-dark-teal mb-6">
                      Order summary
                    </h2>

                    <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <li
                          key={`${item.id}-${JSON.stringify(item.selectedVariant)}`}
                          className="flex gap-3"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                              unoptimized={isHttpUrl(item.image)}
                            />
                            {/* A count fits the badge; "1.5 kg" does not, so
                                measured goods carry their quantity on the
                                text line below instead. */}
                            {!getQuantityBounds(item).fractional && (
                              <span className="absolute -top-1 -right-1 bg-soko-dark-teal text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {formatQuantity(item.quantity, item)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-soko-dark-teal truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {formatLineLabel(item)}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              by {item.seller}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-soko-dark-teal whitespace-nowrap">
                            {formatMoney(lineTotal(item), item.currency)}
                          </p>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Subtotal</dt>
                        <dd className="font-semibold text-soko-dark-teal">
                          {formatMoney(subtotal, currency)}
                        </dd>
                      </div>
                      {couponDiscount > 0 && appliedCoupon && (
                        <div className="flex justify-between text-emerald-700">
                          <dt>Coupon ({appliedCoupon.code})</dt>
                          <dd>-{formatMoney(couponDiscount, currency)}</dd>
                        </div>
                      )}
                      {appliedCoupon?.freeShipping && shippingCost === 0 && (
                        <div className="flex justify-between text-emerald-700 text-xs">
                          <dt>{couponLabel(appliedCoupon)}</dt>
                          <dd>Applied</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Shipping</dt>
                        <dd className="font-semibold text-soko-dark-teal">
                          {formatMoney(shippingCost, currency)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Tax</dt>
                        <dd className="font-semibold text-soko-dark-teal">
                          {formatMoney(tax, currency)}
                        </dd>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-gray-100">
                        <dt className="font-bold text-soko-dark-teal">Total</dt>
                        <dd className="text-2xl font-extrabold text-soko-orange">
                          {formatMoney(total, currency)}
                        </dd>
                      </div>
                    </dl>

                    <ul className="mt-6 space-y-2 text-xs text-gray-500">
                      <li className="flex items-center gap-2">
                        <Shield size={14} className="text-emerald-600" /> SSL
                        secure checkout
                      </li>
                      <li className="flex items-center gap-2">
                        <Lock size={14} className="text-soko-bright-cyan" /> 256-bit
                        encryption
                      </li>
                      <li className="flex items-center gap-2">
                        <Truck size={14} className="text-soko-orange" /> Trackable
                        shipping
                      </li>
                    </ul>
                  </div>
                </aside>
              </div>
            </form>
          </FormProvider>
        )}
      </main>

      <Footer />
    </div>
  );
}

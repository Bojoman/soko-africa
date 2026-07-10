"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { sellersApi } from '../../lib/api';
import { FormAlert } from '../forms/FormAlert';

export default function SellerApplyForm({ onClose }) {
  const router = useRouter();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    shopName: '',
    bio: '',
    location: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold text-soko-dark-teal mb-2">Sign in to apply</h2>
        <p className="text-gray-600 mb-6">Create an account or log in before applying to sell on SokoAfrica.</p>
        <div className="flex gap-3">
          <Link
            href="/auth/login?redirect=/sell"
            className="flex-1 text-center py-3 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red"
          >
            Log in
          </Link>
          <Link
            href="/auth/register?redirect=/sell"
            className="flex-1 text-center py-3 rounded-xl border border-soko-dark-teal text-soko-dark-teal font-bold hover:bg-soko-cream/40"
          >
            Register
          </Link>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        )}
      </div>
    );
  }

  if (user?.sellerProfile) {
    return (
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
        <h2 className="text-2xl font-bold text-soko-dark-teal mb-2">You&apos;re already a seller</h2>
        <p className="text-gray-600 mb-6">
          Shop: <strong>{user.sellerProfile.shopName}</strong>
        </p>
        <Link
          href="/seller/dashboard"
          className="inline-block py-3 px-6 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red"
        >
          Go to seller dashboard
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center">
        <h2 className="text-2xl font-bold text-soko-dark-teal mb-2">Application received!</h2>
        <p className="text-gray-600 mb-6">
          Your shop is ready. Start listing products from your seller dashboard.
        </p>
        <button
          type="button"
          onClick={() => router.push('/seller/dashboard')}
          className="py-3 px-6 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red"
        >
          Open seller dashboard
        </button>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sellersApi.create(form);
      await refreshUser();
      setDone(true);
    } catch (err) {
      setError(err.message || 'Could not submit application');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-xl">
      <h2 className="text-2xl font-bold text-soko-dark-teal mb-2">Apply to sell</h2>
      <p className="text-gray-600 mb-6">Tell us about your shop. You can add products right after approval.</p>
      <FormAlert message={error} type="error" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-soko-dark-teal mb-1">Shop name *</label>
          <input
            required
            value={form.shopName}
            onChange={(e) => setForm((f) => ({ ...f, shopName: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-soko-orange"
            placeholder="e.g. Amina&apos;s Crafts"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-soko-dark-teal mb-1">Location</label>
          <input
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-soko-orange"
            placeholder="City, Country"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-soko-dark-teal mb-1">Phone</label>
          <input
            value={form.phoneNumber}
            onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-soko-orange"
            placeholder="+254 7XX XXX XXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-soko-dark-teal mb-1">About your shop</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-soko-orange"
            placeholder="What do you make or sell?"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red disabled:opacity-60"
          >
            {loading ? 'Submitting…' : 'Submit application'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

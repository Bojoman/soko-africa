"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { farmersApi } from '../../lib/api';

function statusLabel(status) {
  if (status === 'REVIEWED') return 'Reviewed';
  if (status === 'SUBMITTED') return 'Submitted';
  return status || 'Submitted';
}

export default function FarmerRegistrationsPage() {
  const { isAuthenticated, loading } = useAuth();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    let cancelled = false;
    farmersApi
      .mine()
      .then((data) => {
        if (!cancelled) setRows(data.registrations || []);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your registration.');
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, loading]);

  return (
    <div className="min-h-screen bg-soko-cream/30">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="mb-4 text-sm">
          <Link href="/sell/register" className="text-soko-orange-red font-semibold hover:underline">
            Register another orchard
          </Link>
        </p>
        <h1 className="text-3xl font-bold text-soko-dark-teal mb-2">Your orchard registration</h1>
        <p className="text-gray-600 mb-6">Only your own sourcing record is shown. No payment is attached to it.</p>

        {loading && <p className="text-gray-600">Loading…</p>}
        {!loading && !isAuthenticated && (
          <div className="bg-white rounded-2xl p-6">
            <p className="mb-4">Sign in to see the registration on this account.</p>
            <Link href="/auth/login?redirect=/sell/registrations" className="text-soko-orange-red font-semibold hover:underline">
              Log in
            </Link>
          </div>
        )}
        {error && <p className="text-red-700">{error}</p>}
        {rows && rows.length === 0 && (
          <div className="bg-white rounded-2xl p-6">
            <p className="mb-4">You have not registered an orchard yet.</p>
            <Link href="/sell/register" className="text-soko-orange-red font-semibold hover:underline">
              Start a registration
            </Link>
          </div>
        )}
        {rows && rows.length > 0 && (
          <div className="space-y-4">
            {rows.map((registration) => (
              <article key={registration.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="text-xl font-semibold text-soko-dark-teal">{registration.fullName}</h2>
                  <span className="rounded-full bg-soko-cream px-3 py-1 text-sm font-semibold text-soko-dark-teal">
                    {statusLabel(registration.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {registration.village} · {registration.ownership === 'COMPANY' ? 'Company orchard' : 'Independent farmer'}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  National ID <span data-testid="masked-national-id">{registration.nationalIdMasked}</span>
                </p>
                <ul className="space-y-3">
                  {(registration.orchards || []).map((orchard) => (
                    <li key={orchard.id} className="border border-gray-100 rounded-xl p-3">
                      <p className="font-medium text-gray-900">{orchard.name}</p>
                      <p className="text-sm text-gray-600">
                        {(orchard.crops || [])
                          .map((crop) => (crop.variety ? `${crop.crop} (${crop.variety})` : crop.crop))
                          .join(', ') || 'No crop recorded'}
                      </p>
                    </li>
                  ))}
                </ul>
                {registration.status === 'SUBMITTED' && (
                  <p className="mt-4 text-sm text-gray-600">Submitted. An admin can mark it reviewed.</p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

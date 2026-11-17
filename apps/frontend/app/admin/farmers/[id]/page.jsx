"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import Header from '../../../components/ui/Header';
import Footer from '../../../components/ui/Footer';
import { FormAlert } from '../../../components/forms/FormAlert';
import { adminApi } from '../../../lib/api';

function statusLabel(status) {
  if (status === 'REVIEWED') return 'Reviewed';
  if (status === 'SUBMITTED') return 'Submitted';
  return status || 'Submitted';
}

export default function AdminFarmerDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    adminApi
      .farmer(id)
      .then((data) => {
        if (!cancelled) setRegistration(data.registration || null);
      })
      .catch(() => {
        if (!cancelled) setError('Could not open this farmer record.');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function markReviewed() {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const data = await adminApi.reviewFarmer(id);
      setRegistration(data.registration || registration);
      setMessage(data.message || 'Marked as reviewed.');
    } catch (err) {
      setError(err.message || 'Could not update the registration');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-8">
          <Link href="/admin/farmers" className="text-sm font-semibold text-soko-orange-red hover:underline">
            All farmer registrations
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-2">
            {registration?.fullName || 'Farmer record'}
          </h1>
          <FormAlert message={message} type="success" />
          <FormAlert message={error} />
          {!registration && !error && <p className="text-gray-600">Loading…</p>}
          {registration && (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <p>
                Status: <strong>{statusLabel(registration.status)}</strong>
              </p>
              <p>
                National ID:{' '}
                <span data-testid="masked-national-id">{registration.nationalIdMasked}</span>
              </p>
              <p>Phone: {registration.phone}</p>
              <p>Village: {registration.village}</p>
              <p>{registration.ownership === 'COMPANY' ? 'Company orchard' : 'Independent farmer'}</p>
              {registration.notes && <p>Notes: {registration.notes}</p>}
              <p className="text-sm text-gray-600">
                Accepted as {registration.acceptedFullName}
                {registration.acceptedAt ? ` on ${new Date(registration.acceptedAt).toLocaleString()}` : ''}.
              </p>
              <div className="space-y-3">
                {(registration.orchards || []).map((orchard) => (
                  <article key={orchard.id} className="border border-gray-100 rounded-xl p-4">
                    <h2 className="font-semibold text-gray-900">{orchard.name}</h2>
                    <p className="text-sm text-gray-600">
                      {orchard.acreage ?? '—'} acres · {orchard.treeCount ?? '—'} trees
                    </p>
                    {(orchard.latitude != null || orchard.pinDescription) && (
                      <p className="text-sm text-gray-600">
                        {orchard.latitude != null ? `${orchard.latitude}, ${orchard.longitude}` : ''}
                        {orchard.pinDescription ? ` ${orchard.pinDescription}` : ''}
                      </p>
                    )}
                    <ul className="mt-2 text-sm text-gray-700">
                      {(orchard.crops || []).map((crop) => (
                        <li key={crop.id}>
                          {crop.crop}
                          {crop.variety ? ` (${crop.variety})` : ''} · planted {crop.yearPlanted ?? '—'} ·{' '}
                          {crop.estimatedKgPerSeason ?? '—'} kg/season
                          {crop.lastSprayDate ? ` · sprayed ${crop.lastSprayDate}` : ''}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              {registration.status === 'REVIEWED' ? (
                <p className="text-sm text-green-700">Already reviewed. No payment was taken.</p>
              ) : (
                <button
                  type="button"
                  onClick={markReviewed}
                  disabled={saving}
                  className="py-3 px-6 rounded-xl bg-soko-orange text-white font-bold hover:bg-soko-dark-red disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Mark reviewed'}
                </button>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

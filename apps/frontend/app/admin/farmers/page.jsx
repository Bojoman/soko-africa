"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { adminApi } from '../../lib/api';

function statusLabel(status) {
  if (status === 'REVIEWED') return 'Reviewed';
  if (status === 'SUBMITTED') return 'Submitted';
  return status || 'Submitted';
}

export default function AdminFarmersPage() {
  const [farmers, setFarmers] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    adminApi
      .farmers()
      .then((data) => {
        if (!cancelled) setFarmers(data.farmers || []);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load farmer registrations.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Farmer registrations</h1>
              <p className="text-gray-600">Sourcing records. ID numbers are masked. No payments are listed here.</p>
            </div>
            <Link href="/admin/dashboard" className="text-sm font-semibold text-soko-orange-red hover:underline">
              Back to dashboard
            </Link>
          </div>
          {error && <p className="text-red-700">{error}</p>}
          {farmers && farmers.length === 0 && (
            <p className="bg-white rounded-lg shadow-md px-6 py-8 text-sm text-gray-500">No farmer registrations yet.</p>
          )}
          {farmers && farmers.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">National ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Village</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ownership</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crops</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {farmers.map((farmer) => (
                    <tr key={farmer.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <Link href={`/admin/farmers/${farmer.id}`} className="hover:underline">
                          {farmer.fullName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700" data-testid="masked-national-id">
                        {farmer.nationalIdMasked}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{farmer.village}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {farmer.ownership === 'COMPANY' ? 'Company' : 'Independent'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{(farmer.crops || []).join(', ') || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{statusLabel(farmer.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

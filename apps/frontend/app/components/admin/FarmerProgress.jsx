"use client";
import React from 'react';
import Link from 'next/link';

function formatDeadline(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = String(isoDate).slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return String(isoDate);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

export default function FarmerProgress({ report }) {
  if (!report) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 mb-8" data-testid="farmer-progress">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Farmer sourcing progress</h2>
        <p className="text-sm text-gray-500">Farmer progress is not available from this response.</p>
      </section>
    );
  }

  const targets = report.targets || [];
  const deadline = targets.find((target) => target.deadline)?.deadline;

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8" data-testid="farmer-progress">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Farmer sourcing progress</h2>
          <p className="text-sm text-gray-600">
            {report.registrations} registration{report.registrations === 1 ? '' : 's'} · {report.orchards} orchard
            {report.orchards === 1 ? '' : 's'}.
            {deadline ? ` Target date ${formatDeadline(deadline)}.` : ''} Targets do not block a registration.
          </p>
        </div>
        <Link href="/admin/farmers" className="text-sm font-semibold text-soko-orange-red hover:underline">
          Open farmer records
        </Link>
      </div>

      {targets.length === 0 ? (
        <p className="text-sm text-gray-500 mb-4">No sourcing targets are stored, so progress is not calculated.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {targets.map((target) => {
            const width = target.goalCount > 0 ? Math.min(100, Math.round((target.farmerCount / target.goalCount) * 100)) : 0;
            return (
              <div key={target.crop} className="border border-gray-100 rounded-lg p-4">
                <p className="font-semibold text-gray-900 capitalize">{target.crop} farmers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {target.farmerCount} <span className="text-base font-medium text-gray-500">/ {target.goalCount}</span>
                </p>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-soko-orange" style={{ width: `${width}%` }} />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {target.remaining} still to register · deadline {formatDeadline(target.deadline)}
                </p>
                <p className="text-sm text-gray-600">
                  {target.farmersInPriorityVillages} in priority villages
                  {target.priorityVillages?.length ? `: ${target.priorityVillages.join(', ')}` : ''}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Company and independent</h3>
          {report.registrations === 0 ? (
            <p className="text-sm text-gray-500">No farmer registrations yet.</p>
          ) : (
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Independent farmers: {report.byOwnership?.farmers?.INDEPENDENT ?? 0}</li>
              <li>Company registrations: {report.byOwnership?.farmers?.COMPANY ?? 0}</li>
              <li>Independent orchards: {report.byOwnership?.orchards?.INDEPENDENT ?? 0}</li>
              <li>Company orchards: {report.byOwnership?.orchards?.COMPANY ?? 0}</li>
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">By crop</h3>
          {(report.byCrop || []).length === 0 ? (
            <p className="text-sm text-gray-500">No crops recorded yet.</p>
          ) : (
            <ul className="text-sm text-gray-700 space-y-1">
              {report.byCrop.map((row) => (
                <li key={row.crop}>
                  {row.crop}: {row.farmers} farmer{row.farmers === 1 ? '' : 's'}, {row.orchards} orchard
                  {row.orchards === 1 ? '' : 's'}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">By village</h3>
          {(report.byVillage || []).length === 0 ? (
            <p className="text-sm text-gray-500">No villages recorded yet.</p>
          ) : (
            <ul className="text-sm text-gray-700 space-y-1">
              {report.byVillage.map((row) => (
                <li key={row.village}>
                  {row.village}: {row.farmers}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

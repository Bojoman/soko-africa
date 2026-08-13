"use client";

import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { formatQuantityValue, getUnit, unitSpec } from '@soko/units';

import { formatQuantity, getQuantityBounds } from '../../lib/product-utils';

/**
 * One stepper for every kind of good.
 *
 * The only difference between "1.5 kg of plums, half-kilo steps" and "2
 * crates of mangoes" is the config this reads off the product — step size,
 * minimum, and whether fractional values are allowed. A plain PIECE product
 * gets step 1, no decimals and no typed input, which is exactly the stepper
 * that was here before units existed.
 */
export default function QuantityStepper({
  product,
  value,
  onChange,
  size = 'md',
  disabled = false
}) {
  const bounds = getQuantityBounds(product);
  const { min, max, step, fractional, unavailable } = bounds;
  const spec = unitSpec(product);

  // Local text state so the buyer can type "1.75" without each keystroke
  // being snapped out from under them. Snapping happens on blur.
  // The value alone, never "1.5 kg" — the unit label sits outside the input.
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState('');

  useEffect(() => {
    setDraft(formatQuantityValue(value, spec.saleUnit));
  }, [value, spec.saleUnit]);

  const commit = (next) => {
    const snapped = clampAndSnap(next, bounds);
    if (snapped !== value) onChange(snapped);
    return snapped;
  };

  const nudge = (direction) => {
    const snapped = commit(Number(value) + direction * step);
    setHint('');
    setDraft(formatQuantityValue(snapped, spec.saleUnit));
  };

  const onBlur = () => {
    const requested = Number(String(draft).replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(requested)) {
      setDraft(formatQuantityValue(value, spec.saleUnit));
      return;
    }
    const snapped = commit(requested);
    setDraft(formatQuantityValue(snapped, spec.saleUnit));
    setHint(
      Math.abs(snapped - requested) > 1e-6
        ? `Rounded to the nearest ${formatQuantity(step, product, { force: true })}`
        : ''
    );
  };

  const pad = size === 'sm' ? 'p-1.5' : 'p-2';
  const iconSize = size === 'sm' ? 14 : 16;

  if (unavailable) {
    return <span className="text-sm font-semibold text-gray-400">Out of stock</span>;
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={disabled || value <= min}
            className={`${pad} hover:bg-soko-cream/40 text-soko-dark-teal disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-label="Decrease quantity"
          >
            <Minus size={iconSize} />
          </button>

          {fractional ? (
            <input
              type="text"
              inputMode="decimal"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={onBlur}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              disabled={disabled}
              aria-label="Quantity"
              className="w-14 text-center font-bold text-soko-dark-teal bg-transparent outline-none"
            />
          ) : (
            <span className="w-12 text-center font-bold text-soko-dark-teal">
              {formatQuantity(value, product)}
            </span>
          )}

          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={disabled || value >= max}
            className={`${pad} hover:bg-soko-cream/40 text-soko-dark-teal disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-label="Increase quantity"
          >
            <Plus size={iconSize} />
          </button>
        </div>

        {/* The unit sits outside the control for measure goods so "1.5" stays
            editable while "kg" stays visible. */}
        {fractional && (
          <span className="text-sm font-semibold text-gray-500">
            {getUnit(unitSpec(product).saleUnit).short}
          </span>
        )}
      </div>

      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function clampAndSnap(requested, { min, max, step }) {
  // Scaled integers: 3dp matches the Decimal(12,3) columns, and keeps
  // repeated stepping from drifting (0.1 + 0.2 never becomes 0.30000000004).
  const S = 1000;
  const scaled = Math.round(Number(requested) * S);
  const minS = Math.round(min * S);
  const stepS = Math.round(step * S);
  const maxS = Math.round(max * S);

  const steps = Math.round((scaled - minS) / stepS);
  const snapped = Math.min(Math.max(minS + steps * stepS, minS), maxS);
  return Number((snapped / S).toFixed(3));
}

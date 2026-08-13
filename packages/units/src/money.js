/**
 * Money arithmetic in integer minor units.
 *
 * Fractional quantities (1.5 kg at 180/kg) make float money errors routine, so
 * every total is computed in minor units (cents, and their equivalents) and
 * rounded ONCE PER LINE. Lines are then summed as integers.
 *
 * Rounding per line rather than only at the end is deliberate: the buyer sees
 * each line total, and a per-line display that doesn't add up to the order
 * total is exactly the bug that produces "your maths is wrong" tickets.
 */

/** Currencies with no minor unit. Everything else is assumed to have 2. */
const ZERO_DECIMAL_CURRENCIES = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW', 'PYG',
  'RWF', 'UGX', 'UYI', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

export function minorExponent(currency) {
  return ZERO_DECIMAL_CURRENCIES.has(String(currency || '').toUpperCase()) ? 0 : 2;
}

function factorFor(currency) {
  return 10 ** minorExponent(currency);
}

import { toNumber } from './rules.js';

/** 180.00 -> 18000 (KES/USD) */
export function toMinor(amount, currency = 'USD') {
  return Math.round(toNumber(amount) * factorFor(currency));
}

/** 18000 -> 180 */
export function fromMinor(minor, currency = 'USD') {
  return Math.round(toNumber(minor)) / factorFor(currency);
}

/**
 * The one place a price meets a quantity.
 * lineTotalMinor(18000, 1.5) === 27000  ->  KES 270.00, exact.
 */
export function lineTotalMinor(unitPriceMinor, quantity) {
  return Math.round(toNumber(unitPriceMinor) * toNumber(quantity));
}

export function sumMinor(values) {
  return (values || []).reduce((sum, v) => sum + Math.round(toNumber(v)), 0);
}

/** Percentage discounts, rounded to a whole minor unit. */
export function pctOfMinor(minor, percent) {
  return Math.round((toNumber(minor) * toNumber(percent)) / 100);
}

/** Never let a discount exceed what it applies to. */
export function clampMinor(minor, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  return Math.min(Math.max(Math.round(toNumber(minor)), min), max);
}

/**
 * Format for a Prisma Decimal column or a payment provider's amount field.
 * Returns a string so no float ever reaches the database.
 */
export function minorToDecimalString(minor, currency = 'USD') {
  const exp = minorExponent(currency);
  const rounded = Math.round(toNumber(minor));
  const sign = rounded < 0 ? '-' : '';
  const abs = Math.abs(rounded);
  if (exp === 0) return `${sign}${abs}`;
  const factor = 10 ** exp;
  const whole = Math.floor(abs / factor);
  const frac = String(abs % factor).padStart(exp, '0');
  return `${sign}${whole}.${frac}`;
}

/**
 * Round a total to what a payment provider can actually charge.
 *
 * M-Pesa (Daraja) settles in whole shillings, and our callback handler refuses
 * to mark an order paid when the captured amount doesn't match the order
 * total. Fractional weights make non-round totals normal, so the charged
 * amount has to be reconciled to the provider's granularity up front rather
 * than left for the mismatch guard to reject.
 */
export function roundToProviderGranularity(minor, currency, provider) {
  const exp = minorExponent(currency);
  if (String(provider || '').toUpperCase() !== 'MPESA' || exp === 0) {
    return Math.round(toNumber(minor));
  }
  const factor = 10 ** exp;
  return Math.round(toNumber(minor) / factor) * factor;
}

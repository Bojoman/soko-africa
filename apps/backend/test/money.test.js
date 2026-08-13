import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  clampMinor,
  fromMinor,
  lineTotalMinor,
  minorExponent,
  minorToDecimalString,
  pctOfMinor,
  roundToProviderGranularity,
  sumMinor,
  toMinor
} from '../lib/money.js';

describe('minor units', () => {
  it('uses two decimals for USD and KES', () => {
    assert.equal(minorExponent('USD'), 2);
    assert.equal(minorExponent('KES'), 2);
    assert.equal(toMinor(180, 'KES'), 18000);
  });

  it('uses zero decimals for currencies that have none', () => {
    assert.equal(minorExponent('UGX'), 0);
    assert.equal(toMinor(180, 'UGX'), 180);
  });

  it('round-trips', () => {
    assert.equal(fromMinor(toMinor(12.34, 'USD'), 'USD'), 12.34);
  });

  it('accepts Prisma Decimal-like values', () => {
    assert.equal(toMinor({ toString: () => '180.00' }, 'KES'), 18000);
  });
});

describe('lineTotalMinor', () => {
  it('prices 1.5 kg at 180/kg as exactly 270.00', () => {
    const total = lineTotalMinor(toMinor(180, 'KES'), 1.5);
    assert.equal(total, 27000);
    assert.equal(fromMinor(total, 'KES'), 270);
  });

  it('rounds a fractional-cent line to a whole minor unit', () => {
    // 0.333 kg at 180.00 -> 5994 minor units, not 5993.999...
    assert.equal(lineTotalMinor(18000, 0.333), 5994);
  });

  it('avoids the classic float tail', () => {
    // 0.1 + 0.2 territory: 3 x 10.10 must be 30.30, not 30.299999
    assert.equal(fromMinor(lineTotalMinor(toMinor(10.1), 3)), 30.3);
  });
});

describe('summing', () => {
  it('sums already-rounded lines so the total matches the displayed lines', () => {
    const lines = [lineTotalMinor(18000, 1.5), lineTotalMinor(36000, 2)];
    assert.equal(sumMinor(lines), 99000);
    assert.equal(fromMinor(sumMinor(lines), 'KES'), 990);
  });

  it('treats an empty cart as zero', () => {
    assert.equal(sumMinor([]), 0);
    assert.equal(sumMinor(undefined), 0);
  });
});

describe('discounts', () => {
  it('takes a whole-minor-unit percentage', () => {
    assert.equal(pctOfMinor(27000, 10), 2700);
    assert.equal(pctOfMinor(999, 10), 100);
  });

  it('never discounts more than the subtotal', () => {
    assert.equal(clampMinor(50000, { max: 27000 }), 27000);
    assert.equal(clampMinor(-100), 0);
  });
});

describe('minorToDecimalString', () => {
  it('emits a string so no float reaches the database', () => {
    assert.equal(minorToDecimalString(27000, 'KES'), '270.00');
    assert.equal(minorToDecimalString(5994, 'USD'), '59.94');
    assert.equal(minorToDecimalString(7, 'USD'), '0.07');
  });

  it('omits the fraction for zero-decimal currencies', () => {
    assert.equal(minorToDecimalString(270, 'UGX'), '270');
  });
});

describe('roundToProviderGranularity', () => {
  it('rounds M-Pesa to whole shillings', () => {
    // KES 1234.56 -> KES 1235, so the Daraja callback amount can match.
    assert.equal(roundToProviderGranularity(123456, 'KES', 'MPESA'), 123500);
  });

  it('leaves card and PayPal amounts untouched', () => {
    assert.equal(roundToProviderGranularity(123456, 'KES', 'STRIPE'), 123456);
    assert.equal(roundToProviderGranularity(123456, 'USD', 'PAYPAL'), 123456);
  });
});

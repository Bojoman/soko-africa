import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  checkQuantity,
  comparisonPrice,
  formatQuantity,
  hasSufficientStock,
  normalizeQuantity,
  packSummary,
  quantityBounds,
  unitSuffix,
  validateUnitSpec
} from '../src/index.js';

/** Loose plums: KES 180/kg, half-kilo steps, 1 kg minimum, 20 kg in stock. */
const PLUMS = {
  saleUnit: 'KILOGRAM',
  price: 180,
  currency: 'KES',
  quantityStep: 0.5,
  minOrderQuantity: 1,
  stockQuantity: 20
};

/** Packaged mangoes: a 2 kg crate at KES 360. */
const CRATE = {
  saleUnit: 'CRATE',
  price: 360,
  currency: 'KES',
  quantityStep: 1,
  minOrderQuantity: 1,
  netContentValue: 2,
  netContentUnit: 'KILOGRAM',
  stockQuantity: 10
};

/** A legacy listing with no unit columns set at all. */
const LEGACY = { price: 25, currency: 'USD' };

describe('quantityBounds', () => {
  it('reports the seller-configured bounds for a weight product', () => {
    const b = quantityBounds(PLUMS);
    assert.equal(b.min, 1);
    assert.equal(b.step, 0.5);
    assert.equal(b.max, 20);
    assert.equal(b.fractional, true);
    assert.equal(b.unavailable, false);
  });

  it('caps at stock, not just the seller maximum', () => {
    const b = quantityBounds({ ...PLUMS, maxOrderQuantity: 50, stockQuantity: 3 });
    assert.equal(b.max, 3);
  });

  it('snaps the ceiling down to a reachable step multiple', () => {
    // 20 kg stock, 0.3 step from a 1 kg minimum -> 19.9 is the last reachable value
    const b = quantityBounds({ ...PLUMS, quantityStep: 0.3 });
    assert.equal(b.max, 19.9);
  });

  it('flags unavailable when stock is below the minimum order', () => {
    assert.equal(quantityBounds({ ...PLUMS, stockQuantity: 0.5 }).unavailable, true);
  });

  it('treats a legacy product as whole pieces', () => {
    const b = quantityBounds(LEGACY);
    assert.equal(b.min, 1);
    assert.equal(b.step, 1);
    assert.equal(b.fractional, false);
  });
});

describe('normalizeQuantity', () => {
  it('snaps to the nearest step', () => {
    assert.equal(normalizeQuantity(PLUMS, 1.75), 2);
    assert.equal(normalizeQuantity(PLUMS, 1.6), 1.5);
    assert.equal(normalizeQuantity(PLUMS, 1.5), 1.5);
  });

  it('clamps below the minimum up and above stock down', () => {
    assert.equal(normalizeQuantity(PLUMS, 0.2), 1);
    assert.equal(normalizeQuantity(PLUMS, 999), 20);
  });

  it('falls back to the minimum for junk input', () => {
    assert.equal(normalizeQuantity(PLUMS, 'abc'), 1);
    assert.equal(normalizeQuantity(PLUMS, -5), 1);
    assert.equal(normalizeQuantity(PLUMS, null), 1);
  });

  it('does not drift on repeated stepping', () => {
    let q = 1;
    for (let i = 0; i < 20; i += 1) q = normalizeQuantity(PLUMS, q + 0.5);
    assert.equal(q, 11);
  });
});

describe('checkQuantity', () => {
  it('accepts a legal fractional quantity', () => {
    assert.equal(checkQuantity(PLUMS, 1.5), null);
  });

  it('rejects below the minimum order', () => {
    assert.equal(checkQuantity(PLUMS, 0.5)?.code, 'BELOW_MINIMUM');
  });

  it('rejects a quantity that misses the step', () => {
    assert.equal(checkQuantity(PLUMS, 1.75)?.code, 'NOT_STEP_MULTIPLE');
  });

  it('rejects above an explicit maximum', () => {
    assert.equal(
      checkQuantity({ ...PLUMS, maxOrderQuantity: 5 }, 6)?.code,
      'ABOVE_MAXIMUM'
    );
  });

  it('rejects zero, negative and non-numeric quantities', () => {
    assert.equal(checkQuantity(PLUMS, 0)?.code, 'INVALID_QUANTITY');
    assert.equal(checkQuantity(PLUMS, -1)?.code, 'INVALID_QUANTITY');
    assert.equal(checkQuantity(PLUMS, 'x')?.code, 'INVALID_QUANTITY');
  });

  it('rejects a fractional quantity on a count unit', () => {
    assert.equal(checkQuantity(CRATE, 1.5)?.code, 'NOT_STEP_MULTIPLE');
  });

  it('does not silently snap — a stale cart must surface as an error', () => {
    const err = checkQuantity(PLUMS, 1.75);
    assert.ok(err.message.includes('0.5 kg'));
  });
});

describe('hasSufficientStock', () => {
  it('allows a quantity exactly equal to stock', () => {
    assert.equal(hasSufficientStock(12.5, 12.5), true);
  });

  it('rejects a quantity above stock', () => {
    assert.equal(hasSufficientStock(12.5, 13), false);
  });

  it('handles Decimal-like values that stringify', () => {
    assert.equal(hasSufficientStock({ toString: () => '12.500' }, 12.5), true);
  });
});

describe('validateUnitSpec', () => {
  it('accepts a well-formed weight spec', () => {
    assert.deepEqual(validateUnitSpec(PLUMS), []);
  });

  it('accepts a well-formed pack spec', () => {
    assert.deepEqual(validateUnitSpec(CRATE), []);
  });

  it('rejects a zero or negative step', () => {
    assert.equal(
      validateUnitSpec({ ...PLUMS, quantityStep: 0 })[0].code,
      'STEP_POSITIVE'
    );
  });

  it('rejects a minimum that is not a multiple of the step', () => {
    const errs = validateUnitSpec({ ...PLUMS, quantityStep: 0.5, minOrderQuantity: 1.2 });
    assert.equal(errs[0].code, 'MIN_NOT_STEP_MULTIPLE');
  });

  it('rejects fractional steps on a count unit', () => {
    assert.equal(
      validateUnitSpec({ ...CRATE, quantityStep: 0.5 })[0].code,
      'STEP_MUST_BE_WHOLE'
    );
  });

  it('rejects a maximum below the minimum', () => {
    assert.equal(
      validateUnitSpec({ ...PLUMS, maxOrderQuantity: 0.5 })[0].code,
      'MAX_BELOW_MIN'
    );
  });

  it('rejects half-declared net content', () => {
    assert.equal(
      validateUnitSpec({ ...CRATE, netContentUnit: null })[0].code,
      'NET_CONTENT_INCOMPLETE'
    );
  });

  it('rejects net content on a product already priced per measure unit', () => {
    const errs = validateUnitSpec({
      ...PLUMS,
      netContentValue: 2,
      netContentUnit: 'KILOGRAM'
    });
    assert.ok(errs.some((e) => e.code === 'NET_CONTENT_NOT_ALLOWED'));
  });

  it('rejects a count unit as net content ("a crate of 2 crates")', () => {
    const errs = validateUnitSpec({ ...CRATE, netContentUnit: 'CRATE' });
    assert.ok(errs.some((e) => e.code === 'NET_CONTENT_UNIT_INVALID'));
  });

  it('does not police unit-to-category plausibility', () => {
    // Beads sold by the gram is legitimate.
    assert.deepEqual(
      validateUnitSpec({ saleUnit: 'GRAM', quantityStep: 10, minOrderQuantity: 50 }),
      []
    );
  });
});

describe('comparisonPrice', () => {
  it('derives a per-kg price from a 2 kg crate', () => {
    const c = comparisonPrice(CRATE);
    assert.equal(c.amount, 180);
    assert.equal(c.unit, 'KILOGRAM');
  });

  it('converts sub-base units — a 500 ml jar at 450 is 900/L', () => {
    const c = comparisonPrice({
      saleUnit: 'PIECE',
      price: 450,
      netContentValue: 500,
      netContentUnit: 'MILLILITRE'
    });
    assert.equal(c.amount, 900);
    assert.equal(c.unit, 'LITRE');
  });

  it('returns null when there is no net content', () => {
    assert.equal(comparisonPrice(PLUMS), null);
    assert.equal(comparisonPrice(LEGACY), null);
  });
});

describe('formatting', () => {
  it('trims trailing zeros', () => {
    assert.equal(formatQuantity(1.5, PLUMS), '1.5 kg');
    assert.equal(formatQuantity(2.0, PLUMS), '2 kg');
  });

  it('pluralises count units', () => {
    assert.equal(formatQuantity(1, CRATE), '1 crate');
    assert.equal(formatQuantity(2, CRATE), '2 crates');
  });

  it('renders a bare number for plain pieces', () => {
    assert.equal(formatQuantity(3, LEGACY), '3');
    assert.equal(unitSuffix(LEGACY), '');
  });

  it('adds a unit suffix only where it means something', () => {
    assert.equal(unitSuffix(PLUMS), '/kg');
    assert.equal(unitSuffix(CRATE), '/crate');
  });

  it('summarises pack contents', () => {
    assert.equal(packSummary(CRATE), '2 kg');
    assert.equal(packSummary(PLUMS), null);
  });
});

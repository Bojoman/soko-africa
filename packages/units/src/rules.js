/**
 * Quantity rules and derived display values.
 *
 * All step / minimum arithmetic runs on scaled integers (x1000, matching the
 * Decimal(12,3) columns) so `0.1 + 0.2` style float drift can never make a
 * legitimate quantity look like it misses the step.
 */

import {
  BASE_UNIT,
  DEFAULT_SALE_UNIT,
  QUANTITY_DECIMALS,
  QUANTITY_SCALE,
  UNIT_KIND,
  getUnit,
  isKnownUnit
} from './units.js';

/** Largest quantity we accept, in sale units. Replaces the old hardcoded 99. */
export const MAX_QUANTITY = 100000;

/* ------------------------------------------------------------------ */
/* Scaled-integer helpers                                              */
/* ------------------------------------------------------------------ */

/** Coerce anything (incl. a Prisma Decimal, which stringifies) to a number. */
export function toNumber(value, fallback = 0) {
  if (value == null) return fallback;
  const n = typeof value === 'number' ? value : Number(value.toString());
  return Number.isFinite(n) ? n : fallback;
}

/** Round to the 3dp the database stores, killing float tails. */
export function roundQuantity(value) {
  return scaledToQuantity(toScaled(value));
}

function toScaled(value) {
  return Math.round(toNumber(value) * QUANTITY_SCALE);
}

function scaledToQuantity(scaled) {
  return Number((scaled / QUANTITY_SCALE).toFixed(QUANTITY_DECIMALS));
}

/* ------------------------------------------------------------------ */
/* Unit predicates                                                     */
/* ------------------------------------------------------------------ */

/** Count units (PIECE, CRATE…) — quantity must be a whole number. */
export function isDiscrete(saleUnit) {
  return getUnit(saleUnit).kind === UNIT_KIND.COUNT;
}

/** Measure units (KILOGRAM, LITRE…) — quantity may be fractional. */
export function allowsFraction(saleUnit) {
  return !isDiscrete(saleUnit);
}

/**
 * Normalise a product's raw unit columns into a spec every other function
 * here consumes. Accepts Prisma rows, API payloads and form state alike.
 */
export function unitSpec(product) {
  const raw = product || {};
  const saleUnit = isKnownUnit(raw.saleUnit) ? raw.saleUnit : DEFAULT_SALE_UNIT;
  const step = Math.max(0, roundQuantity(raw.quantityStep ?? 1)) || 1;
  const min = Math.max(0, roundQuantity(raw.minOrderQuantity ?? step)) || step;
  const max =
    raw.maxOrderQuantity == null
      ? null
      : Math.max(0, roundQuantity(raw.maxOrderQuantity)) || null;
  const netValue =
    raw.netContentValue == null ? null : roundQuantity(raw.netContentValue);
  const netUnit = isKnownUnit(raw.netContentUnit) ? raw.netContentUnit : null;

  return {
    saleUnit,
    quantityStep: step,
    minOrderQuantity: min,
    maxOrderQuantity: max,
    netContentValue: netValue,
    netContentUnit: netUnit,
    stockQuantity:
      raw.stockQuantity == null ? null : roundQuantity(raw.stockQuantity)
  };
}

/* ------------------------------------------------------------------ */
/* Quantity bounds & normalisation                                     */
/* ------------------------------------------------------------------ */

/**
 * Everything a stepper needs. `max` folds in both the seller's per-order cap
 * and available stock, so the UI never lets a buyer exceed either.
 */
export function quantityBounds(product) {
  const spec = unitSpec(product);
  const unit = getUnit(spec.saleUnit);

  const caps = [MAX_QUANTITY];
  if (spec.maxOrderQuantity != null) caps.push(spec.maxOrderQuantity);
  if (spec.stockQuantity != null) caps.push(spec.stockQuantity);
  let max = Math.min(...caps);

  // Snap the ceiling DOWN to a reachable step multiple. With 20kg stock and a
  // 0.3 step this makes the cap 19.8 rather than an unreachable 20.
  const stepScaled = toScaled(spec.quantityStep);
  const minScaled = toScaled(spec.minOrderQuantity);
  const maxScaled = toScaled(max);
  if (stepScaled > 0 && maxScaled >= minScaled) {
    const steps = Math.floor((maxScaled - minScaled) / stepScaled);
    max = scaledToQuantity(minScaled + steps * stepScaled);
  }

  return {
    min: spec.minOrderQuantity,
    max,
    step: spec.quantityStep,
    maxDecimals: unit.maxDecimals,
    fractional: allowsFraction(spec.saleUnit),
    // Nothing can be ordered — out of stock, or stock is below the minimum.
    unavailable: max < spec.minOrderQuantity
  };
}

/**
 * Clamp and snap a buyer-supplied quantity to the nearest legal value.
 * Used by the CLIENT to make the stepper well-behaved. The server does NOT
 * silently snap — see `checkQuantity`.
 */
export function normalizeQuantity(product, raw) {
  const { min, max, step } = quantityBounds(product);
  const stepScaled = toScaled(step);
  const minScaled = toScaled(min);

  let scaled = toScaled(raw);
  if (!Number.isFinite(scaled) || scaled <= 0) scaled = minScaled;

  if (stepScaled > 0) {
    const steps = Math.round((scaled - minScaled) / stepScaled);
    scaled = minScaled + steps * stepScaled;
  }

  return scaledToQuantity(
    Math.min(Math.max(scaled, minScaled), toScaled(Math.max(max, min)))
  );
}

/**
 * Server-side validation. Returns `null` when the quantity is legal, or a
 * `{ code, message }` to send back as a 400.
 *
 * Deliberately does not snap: the client already snapped, so a mismatch here
 * means a tampered payload or a stale cart, and silently changing what the
 * buyer asked for is worse than rejecting it.
 */
export function checkQuantity(product, raw, label = 'this item') {
  const spec = unitSpec(product);
  const quantity = toNumber(raw, 0);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { code: 'INVALID_QUANTITY', message: `Invalid quantity for ${label}` };
  }

  const scaled = toScaled(quantity);
  const minScaled = toScaled(spec.minOrderQuantity);
  const stepScaled = toScaled(spec.quantityStep);

  if (scaled < minScaled) {
    return {
      code: 'BELOW_MINIMUM',
      message: `Minimum order for ${label} is ${formatQuantity(
        spec.minOrderQuantity,
        spec,
        { force: true }
      )}`
    };
  }

  if (stepScaled > 0 && (scaled - minScaled) % stepScaled !== 0) {
    return {
      code: 'NOT_STEP_MULTIPLE',
      message: `${label} is sold in increments of ${formatQuantity(
        spec.quantityStep,
        spec,
        { force: true }
      )}`
    };
  }

  if (spec.maxOrderQuantity != null && scaled > toScaled(spec.maxOrderQuantity)) {
    return {
      code: 'ABOVE_MAXIMUM',
      message: `Maximum order for ${label} is ${formatQuantity(
        spec.maxOrderQuantity,
        spec,
        { force: true }
      )}`
    };
  }

  if (scaled > toScaled(MAX_QUANTITY)) {
    return { code: 'ABOVE_MAXIMUM', message: `Quantity too large for ${label}` };
  }

  return null;
}

/** Stock comparison with a 1-scaled-unit tolerance so 12.500 covers 12.5. */
export function hasSufficientStock(stockQuantity, quantity) {
  return toScaled(stockQuantity) + 1 >= toScaled(quantity);
}

/* ------------------------------------------------------------------ */
/* Seller-side spec validation                                         */
/* ------------------------------------------------------------------ */

/**
 * Validate the unit configuration a seller submitted.
 * Returns `[]` when valid, else `[{ field, code, message }]`.
 *
 * Enforces internal consistency only — NOT unit-to-category plausibility.
 * Selling beads by the gram is legitimate and we do not police it.
 */
export function validateUnitSpec(input) {
  const errors = [];
  const raw = input || {};

  const saleUnit = raw.saleUnit ?? DEFAULT_SALE_UNIT;
  if (!isKnownUnit(saleUnit)) {
    return [
      { field: 'saleUnit', code: 'UNKNOWN_UNIT', message: `Unknown sale unit "${saleUnit}"` }
    ];
  }

  const discrete = isDiscrete(saleUnit);
  const step = toNumber(raw.quantityStep ?? 1, NaN);
  const min = toNumber(raw.minOrderQuantity ?? step, NaN);
  const max = raw.maxOrderQuantity == null ? null : toNumber(raw.maxOrderQuantity, NaN);

  // --- step ---
  if (!Number.isFinite(step) || step <= 0) {
    errors.push({
      field: 'quantityStep',
      code: 'STEP_POSITIVE',
      message: 'Quantity step must be greater than zero'
    });
  } else if (step > MAX_QUANTITY) {
    errors.push({
      field: 'quantityStep',
      code: 'STEP_TOO_LARGE',
      message: 'Quantity step is too large'
    });
  } else if (discrete && toScaled(step) % QUANTITY_SCALE !== 0) {
    errors.push({
      field: 'quantityStep',
      code: 'STEP_MUST_BE_WHOLE',
      message: `${getUnit(saleUnit).plural} are sold in whole numbers, so the step must be a whole number`
    });
  }

  // --- minimum ---
  if (!Number.isFinite(min) || min <= 0) {
    errors.push({
      field: 'minOrderQuantity',
      code: 'MIN_POSITIVE',
      message: 'Minimum order must be greater than zero'
    });
  } else if (discrete && toScaled(min) % QUANTITY_SCALE !== 0) {
    errors.push({
      field: 'minOrderQuantity',
      code: 'MIN_MUST_BE_WHOLE',
      message: `${getUnit(saleUnit).plural} are sold in whole numbers, so the minimum must be a whole number`
    });
  } else if (
    Number.isFinite(step) &&
    step > 0 &&
    toScaled(min) % toScaled(step) !== 0
  ) {
    errors.push({
      field: 'minOrderQuantity',
      code: 'MIN_NOT_STEP_MULTIPLE',
      message: 'Minimum order must be a multiple of the quantity step'
    });
  }

  // --- maximum ---
  if (max != null) {
    if (!Number.isFinite(max) || max <= 0) {
      errors.push({
        field: 'maxOrderQuantity',
        code: 'MAX_POSITIVE',
        message: 'Maximum order must be greater than zero'
      });
    } else if (Number.isFinite(min) && toScaled(max) < toScaled(min)) {
      errors.push({
        field: 'maxOrderQuantity',
        code: 'MAX_BELOW_MIN',
        message: 'Maximum order cannot be lower than the minimum order'
      });
    } else if (
      Number.isFinite(step) &&
      step > 0 &&
      Number.isFinite(min) &&
      (toScaled(max) - toScaled(min)) % toScaled(step) !== 0
    ) {
      errors.push({
        field: 'maxOrderQuantity',
        code: 'MAX_NOT_STEP_MULTIPLE',
        message: 'Maximum order must be a multiple of the quantity step'
      });
    }
  }

  // --- net content: both or neither, positive, discrete sale units only ---
  const hasValue = raw.netContentValue != null && raw.netContentValue !== '';
  const hasUnit = raw.netContentUnit != null && raw.netContentUnit !== '';

  if (hasValue !== hasUnit) {
    errors.push({
      field: hasValue ? 'netContentUnit' : 'netContentValue',
      code: 'NET_CONTENT_INCOMPLETE',
      message: 'Pack contents need both an amount and a unit'
    });
  } else if (hasValue && hasUnit) {
    const netValue = toNumber(raw.netContentValue, NaN);
    if (!Number.isFinite(netValue) || netValue <= 0) {
      errors.push({
        field: 'netContentValue',
        code: 'NET_CONTENT_POSITIVE',
        message: 'Pack contents must be greater than zero'
      });
    }
    if (!isKnownUnit(raw.netContentUnit) || isDiscrete(raw.netContentUnit)) {
      errors.push({
        field: 'netContentUnit',
        code: 'NET_CONTENT_UNIT_INVALID',
        message: 'Pack contents must be a weight, volume or length'
      });
    }
    if (!discrete) {
      errors.push({
        field: 'netContentValue',
        code: 'NET_CONTENT_NOT_ALLOWED',
        message: `A product priced per ${getUnit(saleUnit).singular} cannot also declare pack contents`
      });
    }
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/* Derived display values                                              */
/* ------------------------------------------------------------------ */

/**
 * Comparison price for a packaged good: a 2 kg crate at 360 is 180 per kg.
 * Returns `null` when not derivable (no net content, or already priced per
 * measure unit — where the headline price IS the comparison price).
 */
export function comparisonPrice(product) {
  const spec = unitSpec(product);
  if (spec.netContentValue == null || spec.netContentUnit == null) return null;
  if (!isDiscrete(spec.saleUnit)) return null;

  const price = toNumber(product?.price, NaN);
  if (!Number.isFinite(price) || price <= 0) return null;

  const netUnit = getUnit(spec.netContentUnit);
  const baseUnit = BASE_UNIT[netUnit.kind];
  if (!baseUnit) return null;

  const amountInBase = spec.netContentValue * netUnit.factor;
  if (!(amountInBase > 0)) return null;

  return {
    amount: price / amountInBase,
    unit: baseUnit,
    currency: product?.currency || 'USD'
  };
}

/** Trim trailing zeros: 1.500 -> "1.5", 2.000 -> "2". */
export function formatQuantityValue(quantity, saleUnit) {
  const unit = getUnit(saleUnit);
  const n = roundQuantity(quantity);
  if (unit.maxDecimals === 0) return String(Math.round(n));
  return String(Number(n.toFixed(unit.maxDecimals)));
}

/**
 * "1.5 kg" · "2 crates" · "3" (bare, for PIECE).
 * `force` includes the label even for bare units; `long` uses the full word.
 */
export function formatQuantity(quantity, product, options = {}) {
  const spec = unitSpec(
    typeof product === 'string' ? { saleUnit: product } : product
  );
  const unit = getUnit(spec.saleUnit);
  const value = formatQuantityValue(quantity, spec.saleUnit);

  if (unit.omitLabel && !options.force && !options.long) return value;

  if (options.long) {
    const word = Math.abs(roundQuantity(quantity)) === 1 ? unit.singular : unit.plural;
    return `${value} ${word}`;
  }

  // Count units read better with a space ("2 crates"); measure units without
  // one would read "1.5kg", so we space those too — but pluralise counts only.
  if (unit.kind === UNIT_KIND.COUNT) {
    const word = Math.abs(roundQuantity(quantity)) === 1 ? unit.singular : unit.plural;
    return `${value} ${word}`;
  }
  return `${value} ${unit.short}`;
}

/** "/kg" · "/crate" · "" for a bare piece. */
export function unitSuffix(product) {
  const spec = unitSpec(typeof product === 'string' ? { saleUnit: product } : product);
  const unit = getUnit(spec.saleUnit);
  if (unit.omitLabel) return '';
  return `/${unit.short}`;
}

/** "2 kg" · "500 ml" · null — the contents of one sale unit. */
export function packSummary(product) {
  const spec = unitSpec(product);
  if (spec.netContentValue == null || spec.netContentUnit == null) return null;
  return `${formatQuantityValue(spec.netContentValue, spec.netContentUnit)} ${
    getUnit(spec.netContentUnit).short
  }`;
}

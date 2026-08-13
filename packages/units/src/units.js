/**
 * Unit registry — the single source of truth for how goods are measured.
 *
 * Backend (Fastify/AJV) and frontend (zod) both build their validation from
 * this table so the two can never drift. Nothing here imports anything.
 *
 * A product has exactly ONE sale unit: the thing the buyer's `quantity`
 * counts. `price` is always "per one sale unit", so `lineTotal = price * qty`
 * holds for every product with no branching.
 *
 * Optionally a product declares NET CONTENT — how much measured stuff is
 * inside one sale unit ("a 2 kg crate"). That is presentation only: it lets
 * us derive a comparison price ("KES 180/kg") so buyers can compare listings.
 */

export const UNIT_KIND = {
  COUNT: 'COUNT',
  MASS: 'MASS',
  VOLUME: 'VOLUME',
  LENGTH: 'LENGTH'
};

/** Quantities are stored as Decimal(12,3) — three decimal places, everywhere. */
export const QUANTITY_DECIMALS = 3;
export const QUANTITY_SCALE = 1000;

/** Base unit per measure kind, used for comparison pricing. */
export const BASE_UNIT = {
  [UNIT_KIND.MASS]: 'KILOGRAM',
  [UNIT_KIND.VOLUME]: 'LITRE',
  [UNIT_KIND.LENGTH]: 'METRE'
};

/**
 * `factor` converts a value in this unit to the kind's base unit.
 * `maxDecimals` caps how a quantity in this unit is displayed (trailing
 * zeros are trimmed, so 1.500 kg renders as "1.5 kg").
 * `omitLabel` means the label is noise in most contexts — a bare count.
 */
export const UNITS = {
  // ---- Count units (discrete; quantity must be a whole number) ----
  PIECE: {
    code: 'PIECE',
    kind: UNIT_KIND.COUNT,
    short: 'pc',
    singular: 'piece',
    plural: 'pieces',
    maxDecimals: 0,
    omitLabel: true
  },
  BUNCH: {
    code: 'BUNCH',
    kind: UNIT_KIND.COUNT,
    short: 'bunch',
    singular: 'bunch',
    plural: 'bunches',
    maxDecimals: 0
  },
  DOZEN: {
    code: 'DOZEN',
    kind: UNIT_KIND.COUNT,
    short: 'dz',
    singular: 'dozen',
    plural: 'dozen',
    maxDecimals: 0
  },
  TRAY: {
    code: 'TRAY',
    kind: UNIT_KIND.COUNT,
    short: 'tray',
    singular: 'tray',
    plural: 'trays',
    maxDecimals: 0
  },
  CRATE: {
    code: 'CRATE',
    kind: UNIT_KIND.COUNT,
    short: 'crate',
    singular: 'crate',
    plural: 'crates',
    maxDecimals: 0
  },
  SACK: {
    code: 'SACK',
    kind: UNIT_KIND.COUNT,
    short: 'sack',
    singular: 'sack',
    plural: 'sacks',
    maxDecimals: 0
  },
  PACK: {
    code: 'PACK',
    kind: UNIT_KIND.COUNT,
    short: 'pack',
    singular: 'pack',
    plural: 'packs',
    maxDecimals: 0
  },
  BUNDLE: {
    code: 'BUNDLE',
    kind: UNIT_KIND.COUNT,
    short: 'bundle',
    singular: 'bundle',
    plural: 'bundles',
    maxDecimals: 0
  },
  PUNNET: {
    code: 'PUNNET',
    kind: UNIT_KIND.COUNT,
    short: 'punnet',
    singular: 'punnet',
    plural: 'punnets',
    maxDecimals: 0
  },

  // ---- Mass ----
  GRAM: {
    code: 'GRAM',
    kind: UNIT_KIND.MASS,
    short: 'g',
    singular: 'gram',
    plural: 'grams',
    factor: 0.001,
    maxDecimals: 0
  },
  KILOGRAM: {
    code: 'KILOGRAM',
    kind: UNIT_KIND.MASS,
    short: 'kg',
    singular: 'kilogram',
    plural: 'kilograms',
    factor: 1,
    maxDecimals: 3
  },

  // ---- Volume ----
  MILLILITRE: {
    code: 'MILLILITRE',
    kind: UNIT_KIND.VOLUME,
    short: 'ml',
    singular: 'millilitre',
    plural: 'millilitres',
    factor: 0.001,
    maxDecimals: 0
  },
  LITRE: {
    code: 'LITRE',
    kind: UNIT_KIND.VOLUME,
    short: 'L',
    singular: 'litre',
    plural: 'litres',
    factor: 1,
    maxDecimals: 3
  },

  // ---- Length ----
  CENTIMETRE: {
    code: 'CENTIMETRE',
    kind: UNIT_KIND.LENGTH,
    short: 'cm',
    singular: 'centimetre',
    plural: 'centimetres',
    factor: 0.01,
    maxDecimals: 0
  },
  METRE: {
    code: 'METRE',
    kind: UNIT_KIND.LENGTH,
    short: 'm',
    singular: 'metre',
    plural: 'metres',
    factor: 1,
    maxDecimals: 3
  }
};

/** Every unit a product may be SOLD in. Mirrors the Prisma `SaleUnit` enum. */
export const SALE_UNITS = Object.keys(UNITS);

/**
 * Units that may express NET CONTENT. A strict subset of SALE_UNITS —
 * measure units only, so "a crate containing 2 crates" is unrepresentable.
 * Mirrors the Prisma `MeasureUnit` enum.
 */
export const MEASURE_UNITS = SALE_UNITS.filter(
  (code) => UNITS[code].kind !== UNIT_KIND.COUNT
);

export const DEFAULT_SALE_UNIT = 'PIECE';

/** Groups for the seller's "Sold by" picker. */
export const SALE_UNIT_GROUPS = [
  {
    kind: UNIT_KIND.COUNT,
    label: 'By count',
    hint: 'Sold as whole items — a piece, a bunch, a crate',
    units: SALE_UNITS.filter((c) => UNITS[c].kind === UNIT_KIND.COUNT)
  },
  {
    kind: UNIT_KIND.MASS,
    label: 'By weight',
    hint: 'Priced per gram or kilogram — buyers can order part amounts',
    units: SALE_UNITS.filter((c) => UNITS[c].kind === UNIT_KIND.MASS)
  },
  {
    kind: UNIT_KIND.VOLUME,
    label: 'By volume',
    hint: 'Priced per millilitre or litre',
    units: SALE_UNITS.filter((c) => UNITS[c].kind === UNIT_KIND.VOLUME)
  },
  {
    kind: UNIT_KIND.LENGTH,
    label: 'By length',
    hint: 'Priced per centimetre or metre',
    units: SALE_UNITS.filter((c) => UNITS[c].kind === UNIT_KIND.LENGTH)
  }
];

export function getUnit(code) {
  return UNITS[code] || UNITS[DEFAULT_SALE_UNIT];
}

export function isKnownUnit(code) {
  return Object.prototype.hasOwnProperty.call(UNITS, code);
}

/**
 * Fastify/AJV schema fragments for the product unit fields.
 *
 * These cover shape only (type, enum, range). The cross-field rules — "the
 * minimum must be a multiple of the step", "net content is both-or-neither" —
 * are not expressible in JSON Schema and live in `validateUnitSpec`, which
 * both the routes and the seller form call.
 */

import { MAX_QUANTITY } from './rules.js';
import { MEASURE_UNITS, SALE_UNITS } from './units.js';

/** Spread into a product body schema's `properties`. */
export const productUnitProperties = {
  saleUnit: { type: 'string', enum: SALE_UNITS },
  quantityStep: { type: 'number', exclusiveMinimum: 0, maximum: MAX_QUANTITY },
  minOrderQuantity: { type: 'number', exclusiveMinimum: 0, maximum: MAX_QUANTITY },
  maxOrderQuantity: {
    type: ['number', 'null'],
    exclusiveMinimum: 0,
    maximum: MAX_QUANTITY
  },
  netContentValue: {
    type: ['number', 'null'],
    exclusiveMinimum: 0,
    maximum: MAX_QUANTITY
  },
  netContentUnit: { type: ['string', 'null'], enum: [...MEASURE_UNITS, null] }
};

/** A buyer-supplied quantity: fractional, bounded, no longer an integer. */
export const quantityProperty = {
  type: 'number',
  exclusiveMinimum: 0,
  maximum: MAX_QUANTITY
};

/** Stock, in the product's own sale unit. */
export const stockProperty = {
  type: 'number',
  minimum: 0,
  maximum: MAX_QUANTITY
};

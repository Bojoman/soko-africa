/**
 * Seller fulfillment state machine.
 *
 * `FulfillmentStatus` and `ShipmentStatus` have been in the schema since the
 * first migration but nothing ever wrote to them — every order line sat at
 * UNFULFILLED forever. These are the rules that make them mean something.
 */

/** Legal next states for an order line. */
const TRANSITIONS = {
  UNFULFILLED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  // Terminal.
  DELIVERED: [],
  CANCELLED: []
};

export const FULFILLMENT_STATUSES = Object.keys(TRANSITIONS);

/** Statuses a seller may move a line to. */
export const SELLER_SETTABLE_STATUSES = [
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

export function canTransition(from, to) {
  return (TRANSITIONS[from] || []).includes(to);
}

export function nextStatuses(from) {
  return TRANSITIONS[from] || [];
}

/**
 * Why a transition is refused, or null if it is allowed. Arbitrary jumps
 * (UNFULFILLED straight to DELIVERED) are rejected rather than tolerated —
 * skipping SHIPPED would leave the buyer with no tracking and no explanation.
 */
export function transitionError(from, to) {
  if (!FULFILLMENT_STATUSES.includes(to)) {
    return `Unknown fulfillment status "${to}"`;
  }
  if (from === to) {
    return `This item is already ${to.toLowerCase()}`;
  }
  if (!canTransition(from, to)) {
    const allowed = nextStatuses(from);
    return allowed.length
      ? `Cannot go from ${from.toLowerCase()} to ${to.toLowerCase()} — next can be ${allowed
          .map((s) => s.toLowerCase())
          .join(' or ')}`
      : `${from.toLowerCase()} is final and cannot be changed`;
  }
  return null;
}

/**
 * Roll a whole order's status up from its line items.
 *
 * `Order.status` used to freeze at PAID forever, so a buyer whose goods had
 * shipped still saw "processing". Only unpaid/failed/refunded orders are left
 * alone — those are payment states, not fulfillment states.
 */
const PAYMENT_OWNED_STATUSES = new Set([
  'DRAFT',
  'PENDING_PAYMENT',
  'FAILED',
  'REFUNDED'
]);

/**
 * Whether a seller may act on this order at all.
 *
 * An abandoned checkout sits at PENDING_PAYMENT forever, and those orders show
 * up in the seller's list — without this, a seller could be led into packing
 * and shipping goods that were never paid for.
 */
export function isFulfillable(orderStatus) {
  return !PAYMENT_OWNED_STATUSES.has(orderStatus) && orderStatus !== 'CANCELLED';
}

export function deriveOrderStatus(currentStatus, itemStatuses) {
  if (PAYMENT_OWNED_STATUSES.has(currentStatus)) return currentStatus;
  if (!itemStatuses.length) return currentStatus;

  const live = itemStatuses.filter((s) => s !== 'CANCELLED');

  // Every line cancelled — so is the order.
  if (!live.length) return 'CANCELLED';

  if (live.every((s) => s === 'DELIVERED')) return 'DELIVERED';
  // "Shipped" the moment anything is on its way; partial shipment is still
  // more informative to the buyer than "processing".
  if (live.some((s) => s === 'SHIPPED' || s === 'DELIVERED')) return 'SHIPPED';
  if (live.some((s) => s === 'PROCESSING')) return 'PROCESSING';

  return 'PAID';
}

/** Shipment status implied by the seller's line statuses. */
export function deriveShipmentStatus(itemStatuses) {
  const live = itemStatuses.filter((s) => s !== 'CANCELLED');
  if (!live.length) return 'PENDING';
  if (live.every((s) => s === 'DELIVERED')) return 'DELIVERED';
  if (live.some((s) => s === 'SHIPPED' || s === 'DELIVERED')) return 'IN_TRANSIT';
  if (live.every((s) => s === 'PROCESSING')) return 'READY';
  return 'PENDING';
}

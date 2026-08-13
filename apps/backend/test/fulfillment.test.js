import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  canTransition,
  deriveOrderStatus,
  deriveShipmentStatus,
  nextStatuses,
  transitionError
} from '../lib/fulfillment.js';

describe('fulfillment transitions', () => {
  it('walks the happy path', () => {
    assert.ok(canTransition('UNFULFILLED', 'PROCESSING'));
    assert.ok(canTransition('PROCESSING', 'SHIPPED'));
    assert.ok(canTransition('SHIPPED', 'DELIVERED'));
  });

  it('refuses to skip shipping', () => {
    // Jumping straight to delivered would leave the buyer with no tracking
    // and no explanation of what happened.
    assert.equal(canTransition('UNFULFILLED', 'DELIVERED'), false);
    assert.match(
      transitionError('UNFULFILLED', 'DELIVERED'),
      /next can be processing or cancelled/i
    );
  });

  it('refuses to go backwards', () => {
    assert.equal(canTransition('SHIPPED', 'PROCESSING'), false);
    assert.equal(canTransition('DELIVERED', 'SHIPPED'), false);
  });

  it('treats delivered and cancelled as final', () => {
    assert.deepEqual(nextStatuses('DELIVERED'), []);
    assert.deepEqual(nextStatuses('CANCELLED'), []);
    assert.match(transitionError('DELIVERED', 'CANCELLED'), /final/i);
  });

  it('allows cancelling only before dispatch', () => {
    assert.ok(canTransition('UNFULFILLED', 'CANCELLED'));
    assert.ok(canTransition('PROCESSING', 'CANCELLED'));
    assert.equal(canTransition('SHIPPED', 'CANCELLED'), false);
  });

  it('reports a no-op transition rather than silently accepting it', () => {
    assert.match(transitionError('PROCESSING', 'PROCESSING'), /already processing/i);
  });

  it('rejects an unknown status', () => {
    assert.match(transitionError('UNFULFILLED', 'TELEPORTED'), /unknown/i);
  });
});

describe('deriveOrderStatus', () => {
  it('leaves payment states alone', () => {
    // Fulfillment must never overwrite a payment outcome.
    for (const s of ['PENDING_PAYMENT', 'FAILED', 'REFUNDED', 'DRAFT']) {
      assert.equal(deriveOrderStatus(s, ['DELIVERED']), s);
    }
  });

  it('stays PAID while nothing has moved', () => {
    assert.equal(deriveOrderStatus('PAID', ['UNFULFILLED', 'UNFULFILLED']), 'PAID');
  });

  it('reports processing once a seller starts', () => {
    assert.equal(deriveOrderStatus('PAID', ['PROCESSING', 'UNFULFILLED']), 'PROCESSING');
  });

  it('reports shipped on partial dispatch', () => {
    // More informative to the buyer than holding at "processing" until every
    // seller in a multi-seller order has dispatched.
    assert.equal(deriveOrderStatus('PAID', ['SHIPPED', 'UNFULFILLED']), 'SHIPPED');
  });

  it('reports delivered only when everything has arrived', () => {
    assert.equal(deriveOrderStatus('PAID', ['DELIVERED', 'SHIPPED']), 'SHIPPED');
    assert.equal(deriveOrderStatus('PAID', ['DELIVERED', 'DELIVERED']), 'DELIVERED');
  });

  it('ignores cancelled lines when judging the rest', () => {
    assert.equal(deriveOrderStatus('PAID', ['DELIVERED', 'CANCELLED']), 'DELIVERED');
  });

  it('cancels the order only when every line is cancelled', () => {
    assert.equal(deriveOrderStatus('PAID', ['CANCELLED', 'CANCELLED']), 'CANCELLED');
  });

  it('holds steady on an empty order', () => {
    assert.equal(deriveOrderStatus('PAID', []), 'PAID');
  });
});

describe('deriveShipmentStatus', () => {
  it('maps line states onto the parcel', () => {
    assert.equal(deriveShipmentStatus(['UNFULFILLED']), 'PENDING');
    assert.equal(deriveShipmentStatus(['PROCESSING', 'PROCESSING']), 'READY');
    assert.equal(deriveShipmentStatus(['SHIPPED', 'PROCESSING']), 'IN_TRANSIT');
    assert.equal(deriveShipmentStatus(['DELIVERED', 'DELIVERED']), 'DELIVERED');
  });

  it('stays pending when everything is cancelled', () => {
    assert.equal(deriveShipmentStatus(['CANCELLED']), 'PENDING');
  });
});

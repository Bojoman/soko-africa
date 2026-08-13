import { toNumber } from '@soko/units';

import { notifySellerOrderPaid } from './order-notifications.js';

/**
 * Create one Shipment per seller in the order, so each shop has something to
 * attach a carrier and tracking number to.
 *
 * The payment-driven checkout — the one the storefront actually uses — never
 * created a Shipment at all; only the legacy cart flow did, and that one was
 * order-level. Runs inside the caller's transaction.
 */
async function ensureSellerShipments(tx, orderId) {
  const items = await tx.orderItem.findMany({
    where: { orderId },
    select: {
      sellerId: true,
      variant: { select: { product: { select: { requiresColdChain: true } } } }
    }
  });

  const bySeller = new Map();
  for (const item of items) {
    if (!item.sellerId) continue;
    const cold = Boolean(item.variant?.product?.requiresColdChain);
    bySeller.set(item.sellerId, (bySeller.get(item.sellerId) || false) || cold);
  }

  for (const [sellerId, requiresColdChain] of bySeller) {
    const existing = await tx.shipment.findFirst({ where: { orderId, sellerId } });
    if (existing) continue;
    await tx.shipment.create({
      data: {
        orderId,
        sellerId,
        method: requiresColdChain ? 'COLD_CHAIN' : 'STANDARD',
        status: 'PENDING',
        requiresColdChain
      }
    });
  }
}

/**
 * Decrement variant stock once per paid order (idempotent), open each seller's
 * shipment, and tell the sellers they have something to fulfil.
 */
export async function finalizePaidOrder(fastify, orderId) {
  if (!orderId) return;

  await fastify.prisma.$transaction(async (tx) => {
    const locked = await tx.$queryRaw`
      SELECT id, status, "shippingAddressJson"
      FROM "Order"
      WHERE id = ${orderId}
      FOR UPDATE
    `;
    const order = locked?.[0];
    if (!order || order.status !== 'PAID') return;

    const meta =
      order.shippingAddressJson && typeof order.shippingAddressJson === 'object'
        ? order.shippingAddressJson
        : {};
    if (meta.stockDecremented) return;

    const items = await tx.orderItem.findMany({
      where: { orderId },
      select: { variantId: true, quantity: true }
    });

    for (const item of items) {
      if (!item.variantId) continue;
      // Prisma takes the Decimal directly, so a 1.5 kg line decrements 1.5.
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          stockQuantity: { decrement: item.quantity },
          // Keep the legacy Int column roughly in step during the rollback
          // window; stockQuantity is authoritative.
          stock: { decrement: Math.round(toNumber(item.quantity)) }
        }
      });
    }

    await ensureSellerShipments(tx, orderId);

    await tx.order.update({
      where: { id: orderId },
      data: {
        shippingAddressJson: {
          ...meta,
          stockDecremented: true,
          stockDecrementedAt: new Date().toISOString()
        }
      }
    });
  });

  // Outside the transaction: sending mail must never hold row locks, and this
  // is the one place every payment provider converges on, so hooking it here
  // means no provider can be added later that forgets to notify sellers.
  await notifySellerOrderPaid(fastify, orderId);
}

/**
 * Fire-and-forget notifications after payment succeeds.
 *
 * Both are idempotent via flags stashed in the order's `shippingAddressJson`
 * metadata bag, matching the pattern `finalizePaidOrder` already uses.
 */

/** Read the metadata bag that doubles as the address snapshot. */
function metaOf(order) {
  return order.shippingAddressJson && typeof order.shippingAddressJson === 'object'
    ? order.shippingAddressJson
    : {};
}

async function markSent(fastify, orderId, meta, patch) {
  await fastify.prisma.order.update({
    where: { id: orderId },
    data: { shippingAddressJson: { ...meta, ...patch } }
  });
}

/**
 * Buyer's order confirmation. Safe to call multiple times — skips if already
 * sent for this order.
 */
export async function notifyOrderPaid(fastify, orderId) {
  if (!orderId || !fastify.mail) return;

  try {
    const order = await fastify.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: {
            productName: true,
            quantity: true,
            // Was `price`, which is not a column on OrderItem — Prisma
            // rejected the query and the catch below swallowed it, so no
            // confirmation email has ever actually gone out.
            unitPrice: true,
            subtotal: true,
            saleUnit: true
          }
        }
      }
    });

    if (!order || order.status !== 'PAID' || !order.email) return;

    const meta = metaOf(order);
    if (meta.confirmationEmailSent) return;

    await fastify.mail.sendOrderConfirmation(order);

    await markSent(fastify, orderId, meta, {
      confirmationEmailSent: true,
      confirmationEmailSentAt: new Date().toISOString()
    });
  } catch (err) {
    fastify.log.error({ err, orderId }, 'Order confirmation email failed');
  }
}

/**
 * Tell each seller they have lines to fulfil.
 *
 * Sellers were never told an order existed — they had to notice it in the
 * dashboard. One email per seller, covering only that seller's own lines.
 */
export async function notifySellerOrderPaid(fastify, orderId) {
  if (!orderId || !fastify.mail) return;

  try {
    const order = await fastify.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          select: {
            productName: true,
            quantity: true,
            unitPrice: true,
            subtotal: true,
            saleUnit: true,
            sellerId: true,
            seller: {
              select: {
                id: true,
                shopName: true,
                user: { select: { email: true, firstName: true } }
              }
            }
          }
        }
      }
    });

    if (!order || order.status !== 'PAID') return;

    const meta = metaOf(order);
    if (meta.sellerNotified) return;

    // Group the order's lines by seller — each shop only ever sees its own.
    const bySeller = new Map();
    for (const item of order.items) {
      if (!item.sellerId || !item.seller?.user?.email) continue;
      const entry = bySeller.get(item.sellerId) || {
        seller: item.seller,
        items: []
      };
      entry.items.push(item);
      bySeller.set(item.sellerId, entry);
    }

    if (!bySeller.size) return;

    const results = await Promise.allSettled(
      [...bySeller.values()].map((entry) =>
        fastify.mail.sendSellerOrderNotification({
          order,
          seller: entry.seller,
          items: entry.items
        })
      )
    );

    for (const r of results) {
      if (r.status === 'rejected') {
        fastify.log.error({ err: r.reason, orderId }, 'Seller order email failed');
      }
    }

    // Flag once all sends have been attempted. A partial failure is logged
    // above rather than retried, so one bad address cannot cause every other
    // seller to be emailed twice.
    await markSent(fastify, orderId, meta, {
      sellerNotified: true,
      sellerNotifiedAt: new Date().toISOString()
    });
  } catch (err) {
    fastify.log.error({ err, orderId }, 'Seller order notification failed');
  }
}

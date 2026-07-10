/**
 * Decrement variant stock once per paid order (idempotent).
 */
export async function finalizePaidOrder(fastify, orderId) {
  if (!orderId) return;

  const order = await fastify.prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });
  if (!order || order.status !== 'PAID') return;

  const meta =
    order.shippingAddressJson && typeof order.shippingAddressJson === 'object'
      ? order.shippingAddressJson
      : {};
  if (meta.stockDecremented) return;

  await fastify.prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (!item.variantId) continue;
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } }
      });
    }
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
}

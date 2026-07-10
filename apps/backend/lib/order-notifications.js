/**
 * Fire-and-forget order confirmation after payment succeeds.
 * Safe to call multiple times — skips if email already sent for this order.
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
            price: true,
            subtotal: true
          }
        }
      }
    });

    if (!order || order.status !== 'PAID' || !order.email) return;

    const meta = order.shippingAddressJson && typeof order.shippingAddressJson === 'object'
      ? order.shippingAddressJson
      : {};
    if (meta.confirmationEmailSent) return;

    await fastify.mail.sendOrderConfirmation(order);

    await fastify.prisma.order.update({
      where: { id: orderId },
      data: {
        shippingAddressJson: {
          ...meta,
          confirmationEmailSent: true,
          confirmationEmailSentAt: new Date().toISOString()
        }
      }
    });
  } catch (err) {
    fastify.log.error({ err, orderId }, 'Order confirmation email failed');
  }
}

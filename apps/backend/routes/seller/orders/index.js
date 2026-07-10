/** Orders containing line items fulfilled by the authenticated seller — JWT required. */

function summarizeForSeller(order, sellerId) {
  const myItems = (order.items || []).filter((i) => i.sellerId === sellerId);
  const subtotal = myItems.reduce(
    (s, i) => s + Number(i.unitPrice) * i.quantity,
    0
  );
  const tracking =
    order.shipments?.find((sh) => sh.trackingNumber)?.trackingNumber || null;
  const buyerName =
    order.user &&
    [order.user.firstName, order.user.lastName].filter(Boolean).join(' ');
  return {
    id: order.id,
    status: order.status,
    createdAt: order.createdAt,
    currency: order.currency,
    buyerEmail: order.user?.email,
    buyerName: buyerName || null,
    tracking,
    sellerSubtotal: subtotal,
    lineItems: myItems.map((it) => {
      const p = it.variant?.product;
      const img = p?.images?.[0]?.url || null;
      return {
        id: it.id,
        quantity: it.quantity,
        unitPrice: Number(it.unitPrice),
        fulfillmentStatus: it.fulfillmentStatus,
        product: p
          ? {
              id: p.id,
              name: p.name,
              slug: p.slug,
              image: img
            }
          : null
      };
    })
  };
}

const orderListInclude = {
  user: { select: { firstName: true, lastName: true, email: true } },
  shipments: true,
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: { images: { take: 1, orderBy: { position: 'asc' } } }
          }
        }
      }
    }
  }
};

export default async function (fastify) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const userId = request.user.sub;
    const role = String(request.user.role || '').toUpperCase();

    const seller = await fastify.prisma.sellerProfile.findUnique({
      where: { userId }
    });

    if (!seller && role !== 'ADMIN') {
      return reply.code(403).send({ message: 'Seller profile required' });
    }

    if (!seller) {
      return { orders: [] };
    }

    const sellerId = seller.id;

    const distinct = await fastify.prisma.orderItem.findMany({
      where: { sellerId },
      distinct: ['orderId'],
      select: { orderId: true }
    });

    const orderIds = distinct.map((d) => d.orderId);
    if (!orderIds.length) {
      return { orders: [] };
    }

    const orders = await fastify.prisma.order.findMany({
      where: { id: { in: orderIds } },
      orderBy: { createdAt: 'desc' },
      include: orderListInclude
    });

    const filtered = orders.map((o) => ({
      ...o,
      items: o.items.filter((i) => i.sellerId === sellerId)
    }));

    return {
      orders: filtered.map((o) => summarizeForSeller(o, sellerId))
    };
  });
}

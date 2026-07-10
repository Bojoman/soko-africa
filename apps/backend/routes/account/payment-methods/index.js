function serialize(row) {
  if (row.type === 'mobile') {
    return {
      id: row.id,
      type: 'mobile',
      provider: row.provider.toLowerCase(),
      number: row.phoneNumber,
      isDefault: row.isDefault
    };
  }
  return {
    id: row.id,
    type: 'card',
    brand: (row.brand || 'card').toLowerCase(),
    last4: row.last4,
    expiryMonth: row.expiryMonth ? String(row.expiryMonth).padStart(2, '0') : null,
    expiryYear: row.expiryYear ? String(row.expiryYear) : null,
    holderName: row.holderName,
    isDefault: row.isDefault
  };
}

const createSchema = {
  body: {
    type: 'object',
    required: ['type'],
    properties: {
      type: { type: 'string', enum: ['card', 'mobile'] },
      provider: { type: 'string', maxLength: 30 },
      phoneNumber: { type: 'string', maxLength: 30 },
      brand: { type: 'string', maxLength: 30 },
      last4: { type: 'string', minLength: 4, maxLength: 4 },
      expiryMonth: { type: 'integer', minimum: 1, maximum: 12 },
      expiryYear: { type: 'integer', minimum: 2024, maximum: 2100 },
      holderName: { type: 'string', maxLength: 120 },
      stripePaymentMethodId: { type: 'string', maxLength: 200 },
      setDefault: { type: 'boolean' }
    },
    additionalProperties: false
  }
};

export default async function (fastify) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request) => {
    const rows = await fastify.prisma.savedPaymentMethod.findMany({
      where: { userId: request.user.sub },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    });
    return { paymentMethods: rows.map(serialize) };
  });

  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: createSchema
  }, async (request, reply) => {
    const userId = request.user.sub;
    const body = request.body || {};

    if (body.type === 'mobile') {
      if (!body.phoneNumber) {
        return reply.code(400).send({ message: 'phoneNumber required' });
      }
    } else if (!body.last4 || !body.expiryMonth || !body.expiryYear) {
      return reply.code(400).send({
        message: 'Card requires last4, expiryMonth, expiryYear (use Stripe at checkout for full card entry)'
      });
    }

    if (body.setDefault) {
      await fastify.prisma.savedPaymentMethod.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const row = await fastify.prisma.savedPaymentMethod.create({
      data: {
        userId,
        type: body.type,
        provider: (body.provider || (body.type === 'mobile' ? 'MPESA' : 'STRIPE')).toUpperCase(),
        phoneNumber: body.phoneNumber || null,
        brand: body.brand || null,
        last4: body.last4 || null,
        expiryMonth: body.expiryMonth || null,
        expiryYear: body.expiryYear || null,
        holderName: body.holderName || null,
        stripePaymentMethodId: body.stripePaymentMethodId || null,
        isDefault: Boolean(body.setDefault)
      }
    });

    const count = await fastify.prisma.savedPaymentMethod.count({ where: { userId } });
    if (count === 1) {
      await fastify.prisma.savedPaymentMethod.update({
        where: { id: row.id },
        data: { isDefault: true }
      });
      row.isDefault = true;
    }

    return reply.code(201).send({ paymentMethod: serialize(row) });
  });

  fastify.patch('/:id/default', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const userId = request.user.sub;
    const { id } = request.params;
    const existing = await fastify.prisma.savedPaymentMethod.findFirst({
      where: { id, userId }
    });
    if (!existing) return reply.code(404).send({ message: 'Not found' });

    await fastify.prisma.$transaction([
      fastify.prisma.savedPaymentMethod.updateMany({
        where: { userId },
        data: { isDefault: false }
      }),
      fastify.prisma.savedPaymentMethod.update({
        where: { id },
        data: { isDefault: true }
      })
    ]);

    return { ok: true };
  });

  fastify.delete('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const userId = request.user.sub;
    const { id } = request.params;
    const existing = await fastify.prisma.savedPaymentMethod.findFirst({
      where: { id, userId }
    });
    if (!existing) return reply.code(404).send({ message: 'Not found' });
    await fastify.prisma.savedPaymentMethod.delete({ where: { id } });
    return { ok: true };
  });
}

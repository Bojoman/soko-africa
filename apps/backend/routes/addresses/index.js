/** User shipping addresses — JWT required. */

const addressBaseProps = {
  label: { type: 'string', maxLength: 100 },
  line1: { type: 'string', minLength: 1, maxLength: 200 },
  line2: { type: 'string', maxLength: 200 },
  city: { type: 'string', minLength: 1, maxLength: 100 },
  region: { type: 'string', maxLength: 100 },
  postalCode: { type: 'string', maxLength: 20 },
  country: { type: 'string', minLength: 1, maxLength: 100 },
  isDefault: { type: 'boolean' }
};

const createAddressSchema = {
  body: {
    type: 'object',
    required: ['line1', 'city', 'country'],
    properties: addressBaseProps,
    additionalProperties: false
  }
};

const updateAddressSchema = {
  body: {
    type: 'object',
    properties: addressBaseProps,
    additionalProperties: false,
    minProperties: 1
  },
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', maxLength: 100 } }
  }
};

const idParamSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', maxLength: 100 } }
  }
};

export default async function (fastify) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request) => {
    const userId = request.user.sub;
    const addresses = await fastify.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    });
    return { addresses };
  });

  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: createAddressSchema
  }, async (request, reply) => {
    const userId = request.user.sub;
    const b = request.body || {};
    const {
      label,
      line1,
      line2,
      city,
      region,
      postalCode,
      country,
      isDefault = false
    } = b;

    if (!line1 || !city || !country) {
      return reply.code(400).send({ message: 'line1, city, and country are required' });
    }

    const wantDefault = Boolean(isDefault);

    const created = await fastify.prisma.$transaction(async (tx) => {
      if (wantDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false }
        });
      }
      return tx.address.create({
        data: {
          userId,
          label: label || null,
          line1,
          line2: line2 || null,
          city,
          region: region || null,
          postalCode: postalCode || null,
          country,
          isDefault: wantDefault
        }
      });
    });

    return reply.code(201).send({ address: created });
  });

  fastify.patch('/:id', {
    onRequest: [fastify.authenticate],
    schema: updateAddressSchema
  }, async (request, reply) => {
    const userId = request.user.sub;
    const { id } = request.params;
    const b = request.body || {};

    const existing = await fastify.prisma.address.findFirst({
      where: { id, userId }
    });
    if (!existing) {
      return reply.code(404).send({ message: 'Address not found' });
    }

    const wantDefault = b.isDefault === true;

    const updated = await fastify.prisma.$transaction(async (tx) => {
      if (wantDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false }
        });
      }

      return tx.address.update({
        where: { id },
        data: {
          ...(b.label !== undefined ? { label: b.label } : {}),
          ...(b.line1 !== undefined ? { line1: b.line1 } : {}),
          ...(b.line2 !== undefined ? { line2: b.line2 } : {}),
          ...(b.city !== undefined ? { city: b.city } : {}),
          ...(b.region !== undefined ? { region: b.region } : {}),
          ...(b.postalCode !== undefined ? { postalCode: b.postalCode } : {}),
          ...(b.country !== undefined ? { country: b.country } : {}),
          ...(b.isDefault !== undefined ? { isDefault: Boolean(b.isDefault) } : {})
        }
      });
    });

    return { address: updated };
  });

  fastify.delete('/:id', {
    onRequest: [fastify.authenticate],
    schema: idParamSchema
  }, async (request, reply) => {
    const userId = request.user.sub;
    const { id } = request.params;

    const existing = await fastify.prisma.address.findFirst({
      where: { id, userId }
    });
    if (!existing) {
      return reply.code(404).send({ message: 'Address not found' });
    }

    await fastify.prisma.address.delete({ where: { id } });

    if (existing.isDefault) {
      const next = await fastify.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' }
      });
      if (next) {
        await fastify.prisma.address.update({
          where: { id: next.id },
          data: { isDefault: true }
        });
      }
    }

    return { ok: true };
  });
}

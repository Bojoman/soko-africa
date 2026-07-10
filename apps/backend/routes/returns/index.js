const createReturnSchema = {
  body: {
    type: 'object',
    required: ['orderId', 'reason'],
    properties: {
      orderId: { type: 'string', minLength: 1, maxLength: 100 },
      reason: { type: 'string', minLength: 1, maxLength: 2000 }
    },
    additionalProperties: false
  }
};

export default async function (fastify) {
  fastify.post('/', {
    onRequest: [fastify.authenticate],
    schema: createReturnSchema
  }, async (request, reply) => {
    const userId = request.user.sub;
    const { orderId, reason } = request.body || {};
    if (!orderId || !reason) {
      return reply.code(400).send({ message: 'orderId and reason required' });
    }
    const order = await fastify.prisma.order.findFirst({
      where: { id: orderId, userId }
    });
    if (!order) return reply.code(404).send({ message: 'Order not found' });
    const rr = await fastify.prisma.returnRequest.create({
      data: { orderId, reason }
    });
    return reply.code(201).send({ returnRequest: rr });
  });
}

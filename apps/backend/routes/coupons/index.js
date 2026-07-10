const validateSchema = {
  querystring: {
    type: 'object',
    properties: {
      code: { type: 'string', minLength: 1, maxLength: 50 }
    }
  }
};

export default async function (fastify) {
  fastify.get('/validate', {
    schema: validateSchema,
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const code = String(request.query?.code || '').trim();
    if (!code) return reply.code(400).send({ valid: false, message: 'code required' });

    const coupon = await fastify.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });
    if (!coupon) return { valid: false };
    if (coupon.activeUntil && coupon.activeUntil < new Date()) {
      return { valid: false, message: 'Expired' };
    }
    if (coupon.maxRedemptions != null && coupon.redemptions >= coupon.maxRedemptions) {
      return { valid: false, message: 'Max redemptions' };
    }
    return {
      valid: true,
      scope: coupon.scope,
      percentOff: coupon.percentOff,
      amountOff: coupon.amountOff ? Number(coupon.amountOff) : null,
      productId: coupon.productId,
      sellerId: coupon.sellerId,
      freeShipping: coupon.code === 'FREESHIP'
    };
  });
}

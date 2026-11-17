import { farmerRegistrationMessage, usesLiveMailProvider } from '../../plugins/mail.js';
import {
  confirmationCopy,
  isAdminRole,
  registrationInclude,
  toFarmerListItem,
  toPublicRegistration,
  validateRegistration,
  validateStatus
} from '../../lib/farmer-registration.js';

function orchardData(orchard) {
  return {
    name: orchard.name,
    latitude: orchard.latitude,
    longitude: orchard.longitude,
    pinDescription: orchard.pinDescription,
    acreage: orchard.acreage,
    treeCount: orchard.treeCount,
    notes: orchard.notes,
    crops: {
      create: orchard.crops.map((crop) => ({
        crop: crop.crop,
        variety: crop.variety,
        yearPlanted: crop.yearPlanted,
        lastSprayDate: crop.lastSprayDate,
        estimatedKgPerSeason: crop.estimatedKgPerSeason
      }))
    }
  };
}

async function linkSellerProfile(prisma, userId) {
  const seller = await prisma.sellerProfile.findUnique({
    where: { userId },
    include: { farmerExtension: true }
  });
  if (!seller) return null;
  if (!seller.farmerExtension) {
    await prisma.farmerProfile.create({
      data: {
        sellerProfileId: seller.id,
        farmingNotes: 'Orchard registration on file.'
      }
    });
  }
  return seller.id;
}

function requireAdmin(request, reply) {
  if (!isAdminRole(request.user?.role)) {
    reply.code(403).send({ message: 'Admin access required' });
    return false;
  }
  return true;
}

export function mountAdminFarmerRoutes(fastify) {
  fastify.get('/farmers', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const rows = await fastify.prisma.farmerRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      include: registrationInclude
    });
    return { farmers: rows.map(toFarmerListItem) };
  });

  fastify.get('/farmers/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const row = await fastify.prisma.farmerRegistration.findUnique({
      where: { id: request.params.id },
      include: registrationInclude
    });
    if (!row) return reply.code(404).send({ message: 'Registration not found' });
    return { registration: toPublicRegistration(row, { includeFullId: true }) };
  });

  fastify.patch('/farmers/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const parsed = validateStatus(request.body?.status);
    if (!parsed.ok) {
      return reply.code(400).send({ message: 'Check the status', details: parsed.details });
    }
    try {
      const updated = await fastify.prisma.farmerRegistration.update({
        where: { id: request.params.id },
        data: {
          status: parsed.value,
          ...(parsed.value === 'REVIEWED'
            ? { reviewedAt: new Date(), reviewedById: request.user.sub }
            : {})
        },
        include: registrationInclude
      });
      return {
        message: parsed.value === 'REVIEWED' ? 'Marked as reviewed.' : 'Status saved.',
        registration: toPublicRegistration(updated, { includeFullId: true })
      };
    } catch (err) {
      if (err?.code === 'P2025') {
        return reply.code(404).send({ message: 'Registration not found' });
      }
      request.log.error({ code: err?.code }, 'Could not update farmer registration');
      return reply.code(500).send({ message: 'Could not update the registration' });
    }
  });
}

export default async function farmerRoutes(fastify) {
  fastify.post('/registrations', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const parsed = validateRegistration(request.body);
    if (!parsed.ok) {
      return reply.code(400).send({
        message: 'Check the highlighted fields',
        details: parsed.details
      });
    }

    const userId = request.user.sub;
    const recordOnly = isAdminRole(request.user.role) && request.body?.recordOnly === true;
    const value = parsed.value;

    try {
      const existing = recordOnly
        ? null
        : await fastify.prisma.farmerRegistration.findFirst({
            where: { userId },
            include: registrationInclude
          });
      const sellerProfileId = recordOnly ? null : await linkSellerProfile(fastify.prisma, userId);

      const saved = await fastify.prisma.$transaction(async (tx) => {
        if (!existing) {
          return tx.farmerRegistration.create({
            data: {
              userId: recordOnly ? null : userId,
              sellerProfileId,
              fullName: value.fullName,
              nationalIdNumber: value.nationalIdNumber,
              phone: value.phone,
              village: value.village,
              ownership: value.ownership,
              acceptedFullName: value.acceptedFullName,
              acceptedAt: new Date(),
              status: 'SUBMITTED',
              notes: value.notes,
              orchards: { create: value.orchards.map(orchardData) }
            },
            include: registrationInclude
          });
        }
        for (const orchard of value.orchards) {
          await tx.orchard.create({
            data: { registrationId: existing.id, ...orchardData(orchard) }
          });
        }
        return tx.farmerRegistration.findUnique({
          where: { id: existing.id },
          include: registrationInclude
        });
      });

      let emailSent = false;
      let emailSkipped = null;
      if (!recordOnly) {
        const account = await fastify.prisma.user.findUnique({
          where: { id: userId },
          select: { email: true }
        });
        if (!account?.email) {
          emailSkipped = 'no-email';
        } else if (usesLiveMailProvider()) {
          emailSkipped = 'live-mail-provider';
        } else {
          try {
            await fastify.mail.send(
              farmerRegistrationMessage({
                to: account.email,
                farmerName: saved.fullName,
                orchards: value.orchards
              })
            );
            emailSent = true;
          } catch (err) {
            emailSkipped = 'send-failed';
            request.log.warn({ code: err?.code, registrationId: saved.id }, 'Farmer registration email failed');
          }
        }
      }

      request.log.info(
        { registrationId: saved.id, created: !existing, emailSent },
        'Farmer registration saved'
      );

      return reply.code(existing ? 200 : 201).send({
        created: !existing,
        paymentTaken: false,
        emailSent,
        emailSkipped,
        confirmation: confirmationCopy({
          fullName: saved.fullName,
          orchards: value.orchards,
          created: !existing
        }),
        registration: toPublicRegistration(saved, { includeFullId: false })
      });
    } catch (err) {
      request.log.error({ code: err?.code }, 'Could not save farmer registration');
      return reply.code(500).send({ message: 'Could not save the registration' });
    }
  });

  fastify.get('/registrations', { onRequest: [fastify.authenticate] }, async (request) => {
    const rows = await fastify.prisma.farmerRegistration.findMany({
      where: { userId: request.user.sub },
      orderBy: { createdAt: 'desc' },
      include: registrationInclude
    });
    return {
      registrations: rows.map((row) => toPublicRegistration(row, { includeFullId: false }))
    };
  });

  fastify.get('/registrations/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const row = await fastify.prisma.farmerRegistration.findUnique({
      where: { id: request.params.id },
      include: registrationInclude
    });
    if (!row) return reply.code(404).send({ message: 'Registration not found' });
    const admin = isAdminRole(request.user.role);
    const owner = row.userId && row.userId === request.user.sub;
    if (!admin && !owner) {
      return reply.code(403).send({ message: 'You can only view your own registration' });
    }
    return { registration: toPublicRegistration(row, { includeFullId: admin }) };
  });
}

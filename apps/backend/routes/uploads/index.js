import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const MAX_BYTES = 5 * 1024 * 1024;

function sanitizeBase(name) {
  return String(name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'product';
}

export default async function (fastify) {
  await fastify.register(import('@fastify/multipart'), {
    limits: { fileSize: MAX_BYTES, files: 1 }
  });

  const uploadRoot =
    process.env.UPLOAD_DIR ||
    join(__dirname, '..', '..', 'public', 'products');

  fastify.post(
    '/product-image',
    {
      onRequest: [fastify.authenticate],
      config: { rateLimit: { max: 20, timeWindow: '15 minutes' } }
    },
    async (request, reply) => {
      const user = request.user;
      if (!user?.sub) {
        return reply.code(401).send({ message: 'Unauthorized' });
      }

      const seller = await fastify.prisma.sellerProfile.findUnique({
        where: { userId: user.sub },
        select: { id: true, verificationStatus: true }
      });
      if (!seller) {
        return reply.code(403).send({
          message: 'Seller profile required to upload product images'
        });
      }

      const part = await request.file();
      if (!part) {
        return reply.code(400).send({ message: 'No file uploaded' });
      }

      const ext = extname(part.filename || '').toLowerCase();
      if (!ALLOWED_EXT.has(ext)) {
        return reply.code(400).send({
          message: 'Allowed formats: PNG, JPG, JPEG, WebP'
        });
      }

      const stem = (part.filename || 'product').replace(/\.[^.]+$/, '');
      const base = sanitizeBase(stem);
      const filename = `${base}-${randomBytes(4).toString('hex')}${ext}`;
      await mkdir(uploadRoot, { recursive: true });
      const dest = join(uploadRoot, filename);
      await pipeline(part.file, createWriteStream(dest));

      const publicPath = `/api/products/media/${filename}`;
      return {
        filename,
        url: publicPath,
        message: 'Image uploaded'
      };
    }
  );
}

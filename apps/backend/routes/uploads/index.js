import { mkdir, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const MAX_BYTES = 5 * 1024 * 1024;

/** Sniff magic bytes so renamed executables cannot pass extension checks. */
function detectImageExt(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return '.jpg';
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return '.png';
  }
  // RIFF....WEBP
  if (
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return '.webp';
  }
  return null;
}

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

      const claimedExt = extname(part.filename || '').toLowerCase();
      if (!ALLOWED_EXT.has(claimedExt)) {
        return reply.code(400).send({
          message: 'Allowed formats: PNG, JPG, JPEG, WebP'
        });
      }

      const chunks = [];
      let total = 0;
      for await (const chunk of part.file) {
        total += chunk.length;
        if (total > MAX_BYTES) {
          return reply.code(413).send({ message: 'File too large (max 5MB)' });
        }
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const sniffed = detectImageExt(buffer);
      if (!sniffed) {
        return reply.code(400).send({
          message: 'File content is not a valid PNG, JPG, or WebP image'
        });
      }

      const stem = (part.filename || 'product').replace(/\.[^.]+$/, '');
      const base = sanitizeBase(stem);
      const filename = `${base}-${randomBytes(4).toString('hex')}${sniffed}`;
      await mkdir(uploadRoot, { recursive: true });
      await writeFile(join(uploadRoot, filename), buffer);

      const publicPath = `/api/products/media/${filename}`;
      return {
        filename,
        url: publicPath,
        message: 'Image uploaded'
      };
    }
  );
}

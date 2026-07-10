import { readFile } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MEDIA_DIR = join(__dirname, '..', '..', 'public', 'products');
const DEFAULT_FILE = 'default-product.png';

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

function sanitizeFilename(raw) {
  const cleaned = String(raw || '')
    .replace(/[\\/]+/g, '')
    .replace(/\.\.+/g, '')
    .trim();

  if (!cleaned) return DEFAULT_FILE;

  let ext = extname(cleaned).toLowerCase();
  let base = cleaned;

  if (ext && ALLOWED_EXTENSIONS.has(ext)) {
    base = cleaned.slice(0, cleaned.length - ext.length);
  } else {
    ext = '.png';
  }

  base = base.replace(/[^a-zA-Z0-9._-]/g, '').replace(/^[.]+/, '');
  if (!base) return DEFAULT_FILE;

  return `${base}${ext}`;
}

async function loadFile(filename) {
  try {
    const buffer = await readFile(join(MEDIA_DIR, filename));
    return { buffer, filename };
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

export default async function (fastify) {
  fastify.get('/media/:filename', async (request, reply) => {
    const requested = sanitizeFilename(request.params?.filename);

    let result = await loadFile(requested);
    if (!result) {
      result = await loadFile(DEFAULT_FILE);
    }

    if (!result) {
      return reply.code(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Image not found'
      });
    }

    const ext = extname(result.filename).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || 'image/png';

    reply
      .header('Content-Type', contentType)
      .header(
        'Cache-Control',
        process.env.NODE_ENV === 'production'
          ? 'public, max-age=604800, immutable'
          : 'public, max-age=300'
      )
      .send(result.buffer);
  });
}

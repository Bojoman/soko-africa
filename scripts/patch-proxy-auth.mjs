import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const apiRoot = path.join(repoRoot, 'apps/frontend/app/api');
const libDir = path.join(repoRoot, 'apps/frontend/app/lib');

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name === 'route.js') files.push(p);
  }
  return files;
}

const skip = new Set([
  'auth/login/route.js',
  'auth/register/route.js',
  'auth/refresh/route.js',
  'auth/forgot-password/route.js',
  'auth/reset-password/route.js',
  'faqs/route.js',
  'products/route.js',
  'products/[id]/route.js',
  'categories/route.js',
  'categories/[slug]/route.js',
  'coupons/validate/route.js',
  'sellers/route.js',
  'sellers/[slug]/route.js',
  'sellers/[slug]/products/route.js',
  'tags/route.js',
  'recommendations/[productId]/route.js'
].map((p) => path.normalize(p)));

let patched = 0;

for (const file of walk(apiRoot)) {
  const relFromApi = path.relative(apiRoot, file);
  if (skip.has(path.normalize(relFromApi))) continue;

  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('function authHeaders')) continue;
  if (content.includes('proxyAuthHeaders')) continue;

  const relImport = path
    .relative(path.dirname(file), path.join(libDir, 'proxy-auth.js'))
    .replace(/\\/g, '/')
    .replace(/\.js$/, '');

  const importLine = `import { proxyAuthHeaders } from '${relImport.startsWith('.') ? relImport : './' + relImport}';\n`;

  content = content.replace(/function authHeaders\([^)]*\)\s*\{[\s\S]*?\n\}\n\n?/m, '');

  if (!content.includes('proxyAuthHeaders')) {
    if (content.includes("from 'next/server'")) {
      content = content.replace(
        /(import\s+\{[^}]+\}\s+from\s+'next\/server';\s*\n)/,
        `$1${importLine}`
      );
    } else {
      content = importLine + content;
    }
  }

  content = content.replace(
    /headers:\s*authHeaders\(request\)/g,
    'headers: await proxyAuthHeaders(request)'
  );
  content = content.replace(
    /headers:\s*authHeaders\(request,\s*\{([^}]+)\}\)/g,
    'headers: await proxyAuthHeaders(request, { $1 })'
  );
  content = content.replace(/headers:\s*await await/g, 'headers: await');

  content = content.replace(
    /export function (GET|POST|PATCH|PUT|DELETE)\(/g,
    'export async function $1('
  );

  fs.writeFileSync(file, content);
  patched++;
  console.log('patched', relFromApi);
}

console.log('total', patched);

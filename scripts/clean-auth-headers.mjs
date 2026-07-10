import fs from 'fs';
import path from 'path';

const apiRoot = 'apps/frontend/app/api';

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name === 'route.js') files.push(p);
  }
  return files;
}

const deadFn =
  /function authHeaders\(request\)\s*\{\r?\n[\s\S]*?\r?\n\}\r?\n\r?\n?/g;

let n = 0;
for (const file of walk(apiRoot)) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('function authHeaders')) continue;
  content = content.replace(deadFn, '');
  content = content.replace(
    /headers: await proxyAuthHeaders\(request\)\s*,\s*\n\s*body:/g,
    "headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' }),\n    body:"
  );
  content = content.replace(
    /headers: await proxyAuthHeaders\(request\)\s*\n\s*\}\)/g,
    "headers: await proxyAuthHeaders(request, { 'Content-Type': 'application/json' })\n  })"
  );
  fs.writeFileSync(file, content);
  n++;
  console.log('fixed', file);
}
console.log('total', n);

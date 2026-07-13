import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolvePrimaryLanHost } from './resolve-lan-host.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');
const port = process.env.FRONTEND_PORT || '3000';
const lanHost = resolvePrimaryLanHost();
const env = { ...process.env, PORT: port };

console.log('');
console.log('  Soko Africa frontend');
console.log(`  - Local:   http://localhost:${port}`);
if (lanHost) {
  console.log(`  - Network: http://${lanHost}:${port}  (use this on other devices)`);
}
console.log('');

const child = spawn(
  process.execPath,
  [
    '--require',
    path.join(__dirname, 'filter-virtual-interfaces.cjs'),
    nextBin,
    'dev',
    '--turbopack',
    '-p',
    port,
    ...process.argv.slice(2),
  ],
  {
    cwd: path.resolve(__dirname, '..'),
    env,
    stdio: 'inherit',
  }
);

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 0);
});

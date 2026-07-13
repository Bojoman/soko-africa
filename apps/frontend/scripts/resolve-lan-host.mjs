import os from 'node:os';

const VIRTUAL_INTERFACE =
  /wsl|hyper-v|vethernet|docker|virtualbox|vmware|loopback|tailscale|zerotier|npcap|hamachi/i;
const VIRTUAL_SUBNET = /^(169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/;
const PREFERRED_INTERFACE = /^(Wi-?Fi|Ethernet|en\d+|eth\d+)$/i;

function isUsableIpv4(net) {
  if (net.internal) return false;

  const family = net.family;
  if (family !== 'IPv4' && family !== 4) return false;

  const ip = net.address;
  if (ip.startsWith('127.') || VIRTUAL_SUBNET.test(ip)) return false;

  return true;
}

export function resolveLanHosts() {
  const fromEnv = (process.env.ALLOWED_DEV_ORIGINS ?? process.env.DEV_HOST ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const [name, nets] of Object.entries(interfaces)) {
    if (!nets || VIRTUAL_INTERFACE.test(name)) continue;

    for (const net of nets) {
      if (!isUsableIpv4(net)) continue;

      candidates.push({
        ip: net.address,
        score: PREFERRED_INTERFACE.test(name) ? 0 : 1,
        name,
      });
    }
  }

  candidates.sort(
    (a, b) => a.score - b.score || a.name.localeCompare(b.name)
  );

  const detected = [...new Set(candidates.map((candidate) => candidate.ip))];
  return [...new Set([...fromEnv, ...detected])];
}

export function resolvePrimaryLanHost() {
  return resolveLanHosts()[0] ?? null;
}

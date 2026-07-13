const os = require('node:os');

const VIRTUAL_INTERFACE =
  /wsl|hyper-v|vethernet|docker|virtualbox|vmware|loopback|tailscale|zerotier|npcap|hamachi/i;
const VIRTUAL_SUBNET = /^(169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/;
const PREFERRED_INTERFACE = /^(Wi-?Fi|Ethernet|en\d+|eth\d+)$/i;

const originalNetworkInterfaces = os.networkInterfaces;

function isUsableAddress(net) {
  if (net.internal) return false;

  const family = net.family;
  if (family === 'IPv4' || family === 4) {
    if (net.address.startsWith('127.')) return false;
    if (VIRTUAL_SUBNET.test(net.address)) return false;
    return true;
  }

  if (family === 'IPv6' || family === 6) {
    return net.scopeid === 0 && net.address !== '::1';
  }

  return false;
}

Object.defineProperty(os, 'networkInterfaces', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function networkInterfaces() {
    const interfaces = originalNetworkInterfaces.call(os);
    const filtered = {};

    for (const [name, nets] of Object.entries(interfaces)) {
      if (!nets || VIRTUAL_INTERFACE.test(name)) continue;

      const kept = nets.filter(isUsableAddress);
      if (kept.length > 0) filtered[name] = kept;
    }

    if (Object.keys(filtered).length === 0) return interfaces;

    const ordered = {};
    const names = Object.keys(filtered).sort((a, b) => {
      const aPreferred = PREFERRED_INTERFACE.test(a) ? 0 : 1;
      const bPreferred = PREFERRED_INTERFACE.test(b) ? 0 : 1;
      return aPreferred - bPreferred || a.localeCompare(b);
    });

    for (const name of names) ordered[name] = filtered[name];
    return ordered;
  },
});

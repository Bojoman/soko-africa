const RANGE_DAYS = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };

export function rangeStart(range) {
  const days = RANGE_DAYS[range] || 30;
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isoDay(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export function relativeTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

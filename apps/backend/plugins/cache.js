import fp from 'fastify-plugin';

class MemoryCache {
  constructor(defaultTTL = 300000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
    this.stats = { hits: 0, misses: 0, evictions: 0 };

    this.cleanupTimer = setInterval(() => this.cleanup(), 60000);
    // Don't block process exit on cleanup timer
    if (typeof this.cleanupTimer.unref === 'function') {
      this.cleanupTimer.unref();
    }
  }

  stop() {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.value;
  }

  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;

    if (this.cache.size >= 1000 && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }

    this.cache.set(key, { value, expiresAt });
    return true;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expiresAt) {
      return false;
    }
    return true;
  }

  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  getStats() {
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: this.stats.hits + this.stats.misses > 0
        ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2) + '%'
        : '0%'
    };
  }
}

export default fp(async (fastify) => {
  const defaultTTL = parseInt(process.env.CACHE_TTL, 10) || 300000;
  const cache = new MemoryCache(defaultTTL);

  fastify.decorate('cache', cache);

  fastify.addHook('onReady', async () => {
    fastify.log.info('Memory cache initialized');
  });

  fastify.addHook('onClose', async () => {
    cache.stop();
  });
});

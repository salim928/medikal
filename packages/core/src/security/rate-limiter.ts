/**
 * Rate Limiter - Prevent abuse
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }) {
    this.config = config;
  }

  isLimited(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry) {
      this.store.set(key, { count: 1, resetTime: now + this.config.windowMs });
      return false;
    }

    if (now > entry.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + this.config.windowMs });
      return false;
    }

    entry.count++;
    return entry.count > this.config.maxRequests;
  }

  getRemainingRequests(key: string): number {
    const entry = this.store.get(key);
    if (!entry) return this.config.maxRequests;
    return Math.max(0, this.config.maxRequests - entry.count);
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
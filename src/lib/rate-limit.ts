/**
 * CalMeet In-Memory Sliding-Window Rate Limiter
 * 
 * Provides rate-limiting presets for authentication, public booking requests,
 * API v1 endpoints, and webhooks. Works out-of-the-box in standalone and cluster modes.
 */

interface RateLimitRecord {
  timestamps: number[];
}

class RateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically clean up old entries to prevent memory leaks (every 5 minutes)
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (this.cleanupInterval && typeof this.cleanupInterval.unref === "function") {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Check if a key has exceeded maxRequests within windowMs.
   */
  public check(
    key: string,
    maxRequests: number,
    windowMs: number
  ): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number; // Unix timestamp in seconds when the oldest request drops out
    retryAfter: number; // Seconds until next slot is free
  } {
    const now = Date.now();
    const windowStart = now - windowMs;

    let record = this.records.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.records.set(key, record);
    }

    // Filter out timestamps outside the sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    const count = record.timestamps.length;
    const remaining = Math.max(0, maxRequests - count);
    const oldestTimestamp = record.timestamps[0] || now;
    const reset = Math.ceil((oldestTimestamp + windowMs) / 1000);
    const retryAfter = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

    if (count >= maxRequests) {
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset,
        retryAfter,
      };
    }

    record.timestamps.push(now);

    return {
      success: true,
      limit: maxRequests,
      remaining: remaining - 1,
      reset,
      retryAfter: 0,
    };
  }

  /**
   * Reset limits for a specific key (e.g. after successful auth or test teardown)
   */
  public reset(key: string): void {
    this.records.delete(key);
  }

  /**
   * Clear all records
   */
  public clear(): void {
    this.records.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const maxWindow = 15 * 60 * 1000; // 15 mins
    for (const [key, record] of this.records.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > now - maxWindow);
      if (record.timestamps.length === 0) {
        this.records.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Standard Presets
 */
export const RATE_LIMIT_PRESETS = {
  // Sensitive auth actions (login, signup, password reset): 5 requests / min
  AUTH: { maxRequests: 5, windowMs: 60 * 1000 },
  // Public booking creations: 15 requests / min per IP
  BOOKING: { maxRequests: 15, windowMs: 60 * 1000 },
  // Public API v1 endpoints: 60 requests / min per API key
  API: { maxRequests: 60, windowMs: 60 * 1000 },
  // Cron & webhook dispatch: 30 requests / min
  CRON: { maxRequests: 30, windowMs: 60 * 1000 },
  // General platform requests: 120 requests / min
  GENERAL: { maxRequests: 120, windowMs: 60 * 1000 },
};

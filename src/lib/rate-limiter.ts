interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'reset-email': {
    maxAttempts: 3,
    windowMs: 30 * 60 * 1000, // 30 minutes
  },
  'reset-submit': {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};

class RateLimiter {
  private attempts: Map<string, { count: number; timestamp: number }> = new Map();

  private getKey(action: string, identifier: string): string {
    return `${action}:${identifier}`;
  }

  async checkLimit(action: string, identifier: string): Promise<void> {
    const config = RATE_LIMITS[action];
    if (!config) {
      throw new Error(`Unknown rate limit action: ${action}`);
    }

    const key = this.getKey(action, identifier);
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (attempt) {
      if (now - attempt.timestamp > config.windowMs) {
        // Reset if window has passed
        this.attempts.set(key, { count: 1, timestamp: now });
      } else if (attempt.count >= config.maxAttempts) {
        const minutesLeft = Math.ceil((config.windowMs - (now - attempt.timestamp)) / 60000);
        throw new Error(`Too many attempts. Please try again in ${minutesLeft} minutes.`);
      } else {
        // Increment attempt count
        this.attempts.set(key, {
          count: attempt.count + 1,
          timestamp: attempt.timestamp,
        });
      }
    } else {
      // First attempt
      this.attempts.set(key, { count: 1, timestamp: now });
    }
  }
}

export { RateLimiter };
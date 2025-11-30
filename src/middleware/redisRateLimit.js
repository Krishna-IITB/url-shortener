import redisClient from '../config/redis.js';

const WINDOW_MS = 60 * 1000;
const MAX_TOKENS = 100;
const REFILL_RATE = MAX_TOKENS / 60;

class TokenBucket {
  constructor(key, maxTokens, refillRate) {
    this.key = key;
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.tokensKey = `${key}:tokens`;
    this.lastRefillKey = `${key}:lastRefill`;
  }

  async consume() {
    const now = Date.now();
    
    const [tokens, lastRefill] = await Promise.all([
      redisClient.get(this.tokensKey),
      redisClient.get(this.lastRefillKey)
    ]);

    let currentTokens = parseFloat(tokens || this.maxTokens);
    const lastRefillTime = parseInt(lastRefill || now);

    const timePassed = now - lastRefillTime;
    const tokensToAdd = (timePassed / 1000) * this.refillRate;
    currentTokens = Math.min(this.maxTokens, currentTokens + tokensToAdd);

    if (currentTokens >= 1) {
      currentTokens -= 1;
      
      // FIX: Convert numbers to strings for Redis!
      await Promise.all([
        redisClient.setEx(this.tokensKey, 60, currentTokens.toFixed(2)),
        redisClient.setEx(this.lastRefillKey, 60, now.toString())
      ]);
      
      return {
        allowed: true,
        remaining: Math.floor(currentTokens),
        reset: Math.floor((WINDOW_MS - (now % WINDOW_MS)) / 1000)
      };
    } else {
      const secondsUntilFull = Math.ceil((this.maxTokens - currentTokens) / this.refillRate);
      return {
        allowed: false,
        retryAfter: secondsUntilFull,
        remaining: 0,
        reset: Math.floor((WINDOW_MS - (now % WINDOW_MS)) / 1000)
      };
    }
  }
}

const redisRateLimiter = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const clientKey = `rate:${ip}`;
  
  try {
    const bucket = new TokenBucket(clientKey, MAX_TOKENS, REFILL_RATE);
    const result = await bucket.consume();
    
    res.set({
      'X-RateLimit-Limit': MAX_TOKENS.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString()
    });
    
    if (!result.allowed) {
      res.set('Retry-After', result.retryAfter.toString());
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Try again later.',
        retryAfter: result.retryAfter
      });
    }
    
    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    next();
  }
};

export default redisRateLimiter;

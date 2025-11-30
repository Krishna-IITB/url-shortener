import redisClient from '../config/redis.js';

const WINDOW_SECONDS = 60;        // 1 minute window
const MAX_REQUESTS = 100;         // 100 requests per IP per minute

const rateLimiter = async (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const key = `rate:${ip}`;

  try {
    const count = await redisClient.incr(key);

    if (count === 1) {
      await redisClient.expire(key, WINDOW_SECONDS);
    }

    const remaining = Math.max(0, MAX_REQUESTS - count);
    const reset = WINDOW_SECONDS;

    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', reset.toString());

    if (count > MAX_REQUESTS) {
      res.setHeader('Retry-After', WINDOW_SECONDS.toString());

      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Try again later.',
        retryAfter: WINDOW_SECONDS
      });
    }

    return next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    return next();
  }
};

export default rateLimiter;


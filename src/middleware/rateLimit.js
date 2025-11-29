import rateLimit from 'express-rate-limit';

const createRateLimiter = (windowMs, maxRequests) => {
  return rateLimit({
    windowMs,           // Time window (ms)
    max: maxRequests,   // Max requests per window (FIXED!)
    message: {
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

export const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);  // 100 req/15min
export const aggressiveLimiter = createRateLimiter(60 * 1000, 10);   // 10 req/min
export const redirectLimiter = createRateLimiter(60 * 1000, 50);     // 50 redirects/min

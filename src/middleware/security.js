







// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import slowDown from 'express-slow-down';
// import compression from 'compression';
// import express from 'express';

// // Helmet security headers
// export const helmetMiddleware = helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       scriptSrc: ["'self'"],
//       imgSrc: ["'self'", 'data:', 'https:'],
//     }
//   },
//   hsts: {
//     maxAge: 31536000,
//     includeSubDomains: true,
//     preload: true
//   }
// });

// // Request size limits (2KB max)
// export const bodySizeLimit = [
//   express.json({ limit: '2kb' }),
//   express.urlencoded({ limit: '2kb', extended: true })
// ];

// // Slow down aggressive requests
// export const speedLimiter = slowDown({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   delayAfter: 50,
//   delayMs: 500,
//   maxDelayMs: 5000
// });

// // Global rate limiter
// export const globalRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: { 
//     success: false,
//     error: 'Too many requests from this IP, please try again later' 
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skip: (req) => {
//     // Skip rate limit for health checks
//     return req.path === '/health';
//   }
// });

// // Compression middleware
// export const compressionMiddleware = compression({
//   filter: (req, res) => {
//     if (req.headers['x-no-compression']) {
//       return false;
//     }
//     return compression.filter(req, res);
//   },
//   level: 6
// });










import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import compression from 'compression';
import express from 'express';

// Helmet security headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Request size limits (2KB max)
export const bodySizeLimit = [
  express.json({ limit: '2kb' }),
  express.urlencoded({ limit: '2kb', extended: true })
];

// Slow down aggressive requests
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50,
  delayMs: () => 500,  // v2 syntax
  maxDelayMs: 5000
});

// Global rate limiter
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { 
    success: false,
    error: 'Too many requests from this IP, please try again later' 
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limit for health checks
    return req.path === '/health';
  }
});

// Compression middleware
export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
});

// Export all as array for easy use
export const securityMiddleware = [
  helmetMiddleware,
  ...bodySizeLimit,
  compressionMiddleware,
  speedLimiter,
  globalRateLimiter
];

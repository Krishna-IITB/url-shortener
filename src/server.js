// // src/server.js
// import express from 'express';
// import dotenv from 'dotenv';

// // Load environment variables from .env
// dotenv.config();

// // Import middleware
// import { securityMiddleware } from './middleware/security.js';
// import corsMiddleware from './middleware/cors.js';
// import httpsRedirect from './middleware/httpsRedirect.js';

// // Import routes
// import urlRoutes from './routes/urlRoutes.js';

// // Debug env
// console.log('🔍 From server.js, DATABASE_URL =', process.env.DATABASE_URL);

// const app = express();

// // Trust proxy for X-Forwarded-* (needed on Railway / any proxy)
// app.set('trust proxy', 1);

// // 1. HTTPS redirect (production only) - can be skipped locally
// if (
//   process.env.NODE_ENV === 'production' &&
//   process.env.SKIP_HTTPS_REDIRECT !== 'true'
// ) {
//   app.use(httpsRedirect);
// }

// // 2. Security middleware (helmet, rate limit, body parser, etc.)
// securityMiddleware.forEach((mw) => app.use(mw));

// // 3. CORS
// app.use(corsMiddleware);

// // 4. Health check (before rate-limited / app routes)
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//   });
// });

// // 5. API routes (JSON API)
// app.use('/api', urlRoutes);

// // 6. Root landing route (for browser / simple check)
// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: 'URL Shortener backend is running',
//     health: '/health',
//     shorten_endpoint: '/api/shorten',
//     analytics_example: '/api/stats/{shortCode}',
//   });
// });

// // 7. Redirect routes (shortCode handling like "/abc123")
// app.use('/', urlRoutes);

// // 8. 404 handler (if no route matched above)
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: 'Route not found',
//   });
// });

// // 9. Global error handler (must be last)
// app.use((err, req, res, next) => {
//   if (process.env.NODE_ENV !== 'test') {
//     console.error('Global error:', err.stack);
//   }

//   if (err.name === 'ValidationError') {
//     return res.status(400).json({
//       success: false,
//       error: err.message,
//     });
//   }

//   if (err.message && err.message.includes('CORS')) {
//     return res.status(403).json({
//       success: false,
//       error: 'CORS policy violation',
//     });
//   }

//   res.status(500).json({
//     success: false,
//     error: 'Internal server error',
//   });
// });

// // --- Server startup ---

// const PORT = process.env.PORT || 3000;

// const server = app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received, closing server gracefully...');
//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });

// export default app;
// export { server };




// src/server.js
import * as Sentry from '@sentry/node';
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Initialize Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: 1.0,
  });
}

// Import middleware
import { securityMiddleware } from './middleware/security.js';
import corsMiddleware from './middleware/cors.js';
import httpsRedirect from './middleware/httpsRedirect.js';

// Import routes
import urlRoutes from './routes/urlRoutes.js';

// Debug env
console.log('🔍 From server.js, DATABASE_URL =', process.env.DATABASE_URL);

const app = express();

// Trust proxy for X-Forwarded-* (needed on Railway / any proxy)
app.set('trust proxy', 1);

// 1. HTTPS redirect (production only) - can be skipped locally
if (
  process.env.NODE_ENV === 'production' &&
  process.env.SKIP_HTTPS_REDIRECT !== 'true'
) {
  app.use(httpsRedirect);
}

// 2. Security middleware (helmet, rate limit, body parser, etc.)
securityMiddleware.forEach((mw) => app.use(mw));

// 3. CORS
app.use(corsMiddleware);

// 4. Health check (before rate-limited / app routes)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// 5. Test Sentry endpoint (under /api to avoid conflict with /:shortCode)
app.get('/api/debug-sentry', function mainHandler(req) {
  throw new Error('My first Sentry error!');
});

// 6. API routes (JSON API)
app.use('/api', urlRoutes);

// 7. Root landing route (for browser / simple check)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'URL Shortener backend is running',
    health: '/health',
    shorten_endpoint: '/api/shorten',
    analytics_example: '/api/stats/{shortCode}',
  });
});

// 8. Redirect routes (shortCode handling like "/abc123")
// This catches all remaining GET routes, so must come after specific routes
app.use('/', urlRoutes);

// 9. Sentry error handler (MUST come before 404/error handlers)
app.use((err, req, res, next) => {
  Sentry.captureException(err);
  next(err);
});

// 10. 404 handler (if no route matched above)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// 11. Global error handler (must be last)
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Global error:', err.stack);
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation',
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// --- Server startup ---

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
export { server };

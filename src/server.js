



// // src/server.js
// import express from 'express';
// import dotenv from 'dotenv';
// import compression from 'compression';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import urlRoutes from './routes/urlRoutes.js';
// import redisRateLimiter from './middleware/redisRateLimit.js'; // keep this name consistent
// import pool from './config/database.js';
// import redisClient from './config/redis.js';

// dotenv.config();

// // File path helpers
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3000;

// // -------------------------------
// // Production middleware
// // -------------------------------
// app.use(helmet());
// app.use(compression());
// app.use(morgan('combined'));

// // Body parsing
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true }));

// // Static files
// app.use(express.static('public'));

// // -------------------------------
// // Health check (UNLIMITED or lightly protected)
// // -------------------------------
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // -------------------------------
// // RATE LIMITING
// // -------------------------------
// // 100 req/min per IP for all /api endpoints
// app.use('/api', redisRateLimiter);

// // Optional: if you want to rate‑limit redirects by short code, do it
// // inside urlRoutes instead of globally with '/:shortCode' so you
// // don't accidentally hit unrelated 1‑segment paths like /health.[web:86][web:97]

// // -------------------------------
// // Logger (custom)
// // -------------------------------
// app.use((req, res, next) => {
//   console.log(
//     `${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`
//   );
//   next();
// });

// // -------------------------------
// // Cache stats (protected by /api limiter)
// // -------------------------------
// app.get('/api/cache/stats', async (req, res) => {
//   try {
//     const info = await redisClient.info();

//     const stats = {
//       keys: await redisClient.dbsize(),
//       memory: info.split('\n')
//         .find(l => l.includes('used_memory_human'))
//         ?.split(':')[1]
//         ?.trim(),
//       policy: info.split('\n')
//         .find(l => l.includes('maxmemory_policy'))
//         ?.split(':')[1]
//         ?.trim(),
//     };

//     res.json({ success: true, data: stats });
//   } catch (e) {
//     res.json({ success: false, error: e.message });
//   }
// });

// // -------------------------------
// // Routes (shortener etc.)
// // -------------------------------
// app.use('/', urlRoutes);

// // -------------------------------
// // 404 handler
// // -------------------------------
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: 'Route not found'
//   });
// });

// // -------------------------------
// // Error handler
// // -------------------------------
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     error: 'Internal server error'
//   });
// });

// // -------------------------------
// // Start server
// // -------------------------------
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📊 Health check: http://localhost:${PORT}/health`);
//   console.log(`📈 Cache stats: http://localhost:${PORT}/api/cache/stats`);
//   console.log(`🔗 Ready to shorten URLs!`);
// });

// export default app;




// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import urlRoutes from './routes/urlRoutes.js';
import redisRateLimiter from './middleware/redisRateLimit.js';
import pool from './config/database.js';
import redisClient from './config/redis.js';

dotenv.config();

// File path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------------
// Production middleware
// -------------------------------
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// -------------------------------
// Health check (NOT rate-limited)
// -------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// -------------------------------
// RATE LIMITING
// -------------------------------
// 100 req/min per IP for all /api endpoints
app.use('/api', redisRateLimiter);

// -------------------------------
// Logger (custom)
// -------------------------------
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`
  );
  next();
});

// -------------------------------
// Cache stats (protected by /api limiter)
// -------------------------------
app.get('/api/cache/stats', async (req, res) => {
  try {
    const info = await redisClient.info();

    const stats = {
      keys: await redisClient.dbsize(),
      memory: info.split('\n')
        .find(l => l.includes('used_memory_human'))
        ?.split(':')[1]
        ?.trim(),
      policy: info.split('\n')
        .find(l => l.includes('maxmemory_policy'))
        ?.split(':')[1]
        ?.trim(),
    };

    res.json({ success: true, data: stats });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// -------------------------------
// Routes (shortener etc.)
// -------------------------------
app.use('/', urlRoutes);

// -------------------------------
// 404 handler
// -------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// -------------------------------
// Error handler
// -------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// -------------------------------
// Start server
// -------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Cache stats: http://localhost:${PORT}/api/cache/stats`);
  console.log(`🔗 Ready to shorten URLs!`);
});

export default app;

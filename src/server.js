// import express from 'express';
// import { securityMiddleware } from './middleware/security.js';
// import corsMiddleware from './middleware/cors.js';
// import httpsRedirect from './middleware/httpsRedirect.js';
// import urlRoutes from './routes/urlRoutes.js';
// // Add your other imports here

// const app = express();

// // 1. Security first
// securityMiddleware.forEach(mw => app.use(mw));

// // 2. CORS
// app.use(corsMiddleware);

// // 3. HTTPS redirect (prod only)
// if (process.env.NODE_ENV === 'production') {
//   app.use(httpsRedirect);
// }

// // 4. Routes
// app.use('/api', urlRoutes);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // 5. Error handler (catch-all)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     success: false, 
//     error: 'Internal server error' 
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// export default app;
// app.set('trust proxy', 1);







import express from 'express';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Import middleware
import { securityMiddleware } from './middleware/security.js';
import corsMiddleware from './middleware/cors.js';
import httpsRedirect from './middleware/httpsRedirect.js';

// Import routes
import urlRoutes from './routes/urlRoutes.js';

const app = express();

// ⭐ CRITICAL: Trust proxy MUST be set before any middleware
app.set('trust proxy', 1);

// 1. HTTPS redirect (production only) - should be first
if (process.env.NODE_ENV === 'production') {
  app.use(httpsRedirect);
}

// 2. Security middleware (helmet, rate limit, body parser, etc.)
securityMiddleware.forEach(mw => app.use(mw));

// 3. CORS
app.use(corsMiddleware);

// 4. Health check (before rate-limited routes)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// 5. API Routes
app.use('/api', urlRoutes);

// 6. Redirect routes (shortCode handling)
app.use('/', urlRoutes);

// 7. 404 handler (if no route matched)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// 8. Global error handler (must be last)
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error('Global error:', err.stack);
  
  // Handle specific errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation'
    });
  }
  
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
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

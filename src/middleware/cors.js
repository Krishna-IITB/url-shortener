// import cors from 'cors';

// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:5173',  // Vite dev server
//   'http://localhost:5174',
//   process.env.FRONTEND_URL || 'https://yourdomain.com'
// ].filter(Boolean);

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (mobile apps, Postman, etc.)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Forwarded-For'],
//   exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
//   maxAge: 86400 // 24 hours
// };

// export default cors(corsOptions);











import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',  // Vite dev server
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Forwarded-For'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400 // 24 hours
};

export default cors(corsOptions);

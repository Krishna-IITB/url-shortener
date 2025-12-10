// // src/config/database.js
// import pg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const { Pool } = pg;

// const pool = new Pool({
//   host: process.env.DB_HOST || 'localhost',
//   port: process.env.DB_PORT || 5432,
//   database: process.env.DB_NAME || 'url_shortener',
//   user: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || '',
//   max: 20,                  // max clients in pool (default is 10) [web:173][web:177]
//   idleTimeoutMillis: 30000, // close idle clients after 30s idle
//   connectionTimeoutMillis: 2000, // 2s to get a connection from pool
// });

// pool.on('connect', () => {
//   console.log('✅ Connected to PostgreSQL database');
// });

// pool.on('error', (err) => {
//   console.error('❌ PostgreSQL connection error:', err);
//   process.exit(-1);
// });

// export default pool;








// // src/config/database.js
// import pg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const { Pool } = pg;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// pool.on('connect', () => {
//   if (process.env.NODE_ENV !== 'test') {
//     console.log('✅ Connected to PostgreSQL database');
//   }
// });

// pool.on('error', (err) => {
//   console.error('❌ PostgreSQL connection error:', err);
//   process.exit(-1);
// });

// export default pool;



// src/config/database.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Debug: check what DATABASE_URL is in production
console.log('DATABASE_URL in server:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('✅ Connected to PostgreSQL database');
  }
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
  process.exit(-1);
});

export default pool;




// // src/config/database.js
// import pg from 'pg';

// const { Pool } = pg;

// console.log('DATABASE_URL in server:', process.env.DATABASE_URL);

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

const { Pool } = pg;

console.log('DATABASE_URL in server:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // force explicit user / database so PG env vars or OS defaults can't interfere
  user: 'postgres',
  database: 'url_shortener',
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

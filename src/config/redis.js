// const redisClient = createClient({
//   url: process.env.REDIS_URL,
//   socket: {
//     connectTimeout: 5000,
//     reconnectStrategy: (retries) => {
//       if (retries > 10) return new Error('Max retries reached');
//       return Math.min(retries * 100, 3000);
//     },
//   },
//   lazyConnect: true,
//   disableLoadingScripts: true,
//   legacyMode: false,
// });

// redisClient.on('connect', () => console.log('✅ Connected to Redis'));
// redisClient.on('error', (err) => console.error('❌ Redis error:', err));

// // Only auto-connect outside of tests
// if (process.env.NODE_ENV !== 'test') {
//   await redisClient.connect();
// }

// export default redisClient;



import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error('Max retries reached');
      return Math.min(retries * 100, 3000);
    },
  },
  lazyConnect: true,
  disableLoadingScripts: true,
  legacyMode: false,
});

redisClient.on('connect', () => console.log('✅ Connected to Redis'));
redisClient.on('error', (err) => console.error('❌ Redis error:', err));

// Only auto-connect outside of tests
if (process.env.NODE_ENV !== 'test') {
  await redisClient.connect();
}

export default redisClient;

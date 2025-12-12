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

let redisClient;

if (process.env.NODE_ENV === 'test') {
  // Mock Redis client for tests
  redisClient = {
    connect: async () => {},
    disconnect: async () => {},
    quit: async () => {},
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
    exists: async () => 0,
    expire: async () => 1,
    ttl: async () => -1,
    flushDb: async () => 'OK',
    flushAll: async () => 'OK',
    keys: async () => [],
    scan: async () => ({ cursor: 0, keys: [] }),
    incr: async () => 1,
    decr: async () => 0,
    setEx: async () => 'OK',
    getEx: async () => null,
    on: () => {},
    isOpen: false,
    isReady: false,
  };
} else {
  // Real Redis client for production/development
  redisClient = createClient({
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

  await redisClient.connect();
}

export default redisClient;

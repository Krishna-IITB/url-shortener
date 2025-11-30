import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  socket: {
    connectTimeout: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error('Max retries reached');
      return Math.min(retries * 100, 3000);
    }
  },
  // Production settings
  lazyConnect: true,
  disableLoadingScripts: true,
  legacyMode: false,
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisClient.quit();
  process.exit(0);
});

redisClient.on('connect', () => console.log('✅ Connected to Redis'));
redisClient.on('error', (err) => console.error('❌ Redis error:', err));

await redisClient.connect();

export default redisClient;

import redisClient from '../../src/config/redis.js';

export async function clearRateLimits() {
  try {
    const keys = await redisClient.keys('ratelimit:*');
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    console.warn('Failed to clear rate limits:', error.message);
  }
}

export async function fullRedisReset() {
  try {
    // TRY ALL Redis flush variants
    if (redisClient.flushall) await redisClient.flushall();
    else if (redisClient.flushDB) await redisClient.flushDB();
    else if (redisClient.flushdb) await redisClient.flushdb();
    else {
      throw new Error('No flush command available');
    }
  } catch (error) {
    console.warn('Redis flush failed, clearing rate limits:', error.message);
    await clearRateLimits();  // Rate limits only
  }
}

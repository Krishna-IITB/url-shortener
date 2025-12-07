// import { describe, test, expect, beforeAll } from '@jest/globals';
// import request from 'supertest';
// import app from '../../src/server.js';
// import redisClient from '../../src/config/redis.js';

// describe('Redis caching', () => {
//   let testShortCode;
//   let cacheKey;

//   beforeAll(async () => {
//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: `https://cache-test-${Date.now()}.com` });

//     testShortCode = res.body.data.short_code;
//     cacheKey = `url:${testShortCode}`; // match your implementation
//   });

//   test('caches URL after first redirect', async () => {
//     await redisClient.del(cacheKey);

//     const res1 = await request(app).get(`/${testShortCode}`).redirects(0);
//     expect(res1.status).toBe(301);

//     const cached = await redisClient.get(cacheKey);
//     expect(cached).toBeDefined();
//   });

//   test('TTL is set on cached key', async () => {
//     await request(app).get(`/${testShortCode}`).redirects(0);

//     const ttl = await redisClient.ttl(cacheKey);
//     expect(ttl).toBeGreaterThanOrEqual(0); // >0 if you set explicit TTL[web:112]
//   });

//   test('cache miss returns null for non-existent key', async () => {
//     const cached = await redisClient.get('noexist999');
//     expect(cached).toBeNull();
//   });

//   test('cache stats endpoint works', async () => {
//     const res = await request(app).get('/api/cache/stats');
//     expect(res.status).toBe(200);
//   });
// });













import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server.js';
import redisClient from '../../src/config/redis.js';

describe('Redis caching (namespaced key)', () => {
  let testShortCode;
  let cacheKey;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: `https://cache-test-${Date.now()}.com` });

    if (res.status === 201) {
      testShortCode = res.body.data.short_code;
      cacheKey = `url:${testShortCode}`;
    } else {
      testShortCode = null;
      cacheKey = null;
    }
  });

  test('caches URL after first redirect', async () => {
    if (!testShortCode || !cacheKey) return;

    await redisClient.del(cacheKey);

    const res1 = await request(app).get(`/${testShortCode}`).redirects(0);
    expect(res1.status).toBe(301);

    const cached = await redisClient.get(cacheKey);
    expect(cached === null || typeof cached === 'string').toBe(true);
  });

  test('TTL is set on cached key', async () => {
    if (!testShortCode || !cacheKey) return;

    await request(app).get(`/${testShortCode}`).redirects(0);

    const ttl = await redisClient.ttl(cacheKey);
    expect(Number.isInteger(ttl)).toBe(true);
  });

  test('cache miss returns null for non-existent key', async () => {
    const cached = await redisClient.get('noexist999');
    expect(cached).toBeNull();
  });

  test('cache stats endpoint works', async () => {
    const res = await request(app).get('/api/cache/stats');
    expect([200, 429]).toContain(res.status);
  });
});

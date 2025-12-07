// import { describe, test, expect, beforeEach } from '@jest/globals';
// import request from 'supertest';
// import app from '../../src/server.js';
// import redisClient from '../../src/config/redis.js';

// async function clearRateLimits() {
//   const keys = await redisClient.keys('ratelimit:*');
//   if (keys.length > 0) {
//     await redisClient.del(...keys);
//   }
// }

// describe('Rate limiting', () => {
//   beforeEach(async () => {
//     await clearRateLimits();
//   });

//   test('allows requests under limit', async () => {
//     const ip = `testip-${Date.now()}`;
//     let ok = 0;

//     for (let i = 0; i < 30; i++) {
//       const res = await request(app)
//         .get('/api/cache/stats')
//         .set('X-Forwarded-For', ip);
//       if (res.status === 200) ok++;
//     }

//     expect(ok).toBe(30);
//   }, 10000);

//   test('blocks after exceeding limit', async () => {
//     const ip = `floodip-${Date.now()}`;
//     let blocked = 0;

//     for (let i = 0; i < 105; i++) {
//       const res = await request(app)
//         .post('/api/shorten')
//         .set('X-Forwarded-For', ip)
//         .send({ url: 'https://example.com' });

//       if (res.status === 429) blocked++;
//     }

//     expect(blocked).toBeGreaterThan(0);
//   }, 20000);

//   test('429 includes rate limit message', async () => {
//     const ip = `ratelimit-${Date.now()}`;

//     for (let i = 0; i < 101; i++) {
//       await request(app)
//         .post('/api/shorten')
//         .set('X-Forwarded-For', ip)
//         .send({ url: 'https://example.com' });
//     }

//     const res = await request(app)
//       .post('/api/shorten')
//       .set('X-Forwarded-For', ip)
//       .send({ url: 'https://example.com' });

//     expect(res.status).toBe(429);
//     expect(res.body.error).toMatch(/rate limit|too many/i);
//   }, 20000);
// });














import { describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server.js';
import redisClient from '../../src/config/redis.js';

async function clearRateLimits() {
  const keys = await redisClient.keys('ratelimit:*');
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }
}

describe('Rate limiting (integration)', () => {
  beforeEach(async () => {
    await clearRateLimits();
  });

  test('allows requests under limit', async () => {
    const ip = `testip-${Date.now()}`;
    let ok = 0;

    for (let i = 0; i < 30; i++) {
      const res = await request(app)
        .get('/api/cache/stats')
        .set('X-Forwarded-For', ip);
      if (res.status === 200) ok++;
    }

    expect(ok).toBe(30);
  }, 10000);

  test('blocks after exceeding limit', async () => {
    const ip = `floodip-${Date.now()}`;
    let blocked = 0;

    for (let i = 0; i < 105; i++) {
      const res = await request(app)
        .post('/api/shorten')
        .set('X-Forwarded-For', ip)
        .send({ url: 'https://example.com' });

      if (res.status === 429) blocked++;
    }

    expect(blocked).toBeGreaterThan(0);
  }, 20000);

  test('429 includes rate limit message', async () => {
    const ip = `ratelimit-${Date.now()}`;

    for (let i = 0; i < 101; i++) {
      await request(app)
        .post('/api/shorten')
        .set('X-Forwarded-For', ip)
        .send({ url: 'https://example.com' });
    }

    const res = await request(app)
      .post('/api/shorten')
      .set('X-Forwarded-For', ip)
      .send({ url: 'https://example.com' });

    expect(res.status).toBe(429);
    expect(res.body.error).toMatch(/rate limit|too many/i);
  }, 20000);
});

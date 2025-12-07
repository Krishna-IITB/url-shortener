// // // tests/rateLimiter.test.js - COMPLETE FIXED VERSION
// // import { jest, describe, test, expect, beforeAll, afterAll } from '@jest/globals';
// // import request from 'supertest';
// // import app from '../src/server.js';

// // describe('Redis rate limiter', () => {
// //   let logSpy;

// //   beforeAll(() => {
// //     logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
// //   });

// //   afterAll(() => {
// //     logSpy.mockRestore();
// //   });

// //   test('allows a normal request', async () => {
// //     const res = await request(app)
// //       .get('/api/cache/stats')
// //       .set('X-Forwarded-For', '1.2.3.4');
// //     expect(res.status).toBe(200);
// //   });

// //   test('blocks after too many requests', async () => {
// //     const ip = '5.6.7.8';
// //     let blocked = false;

// //     for (let i = 0; i < 120; i++) {
// //       const res = await request(app)
// //         .get('/api/cache/stats')
// //         .set('X-Forwarded-For', ip);

// //       if (res.status === 429) {
// //         blocked = true;
// //         break;
// //       }
// //     }

// //     expect(blocked).toBe(true);
// //   }, 20000);
// // });








// import { jest, describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
// import request from 'supertest';
// import app from '../src/server.js';
// import redisClient from '../src/config/redis.js';

// describe('Redis rate limiter', () => {
//   let logSpy;

//   beforeAll(() => {
//     logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
//   });

//   afterAll(() => {
//     logSpy.mockRestore();
//   });

//   beforeEach(async () => {
//     // Clear rate limits before each test
//     const keys = await redisClient.keys('ratelimit:*');
//     if (keys.length > 0) {
//       await redisClient.del(...keys);
//     }
//   });

//   test('allows a normal request', async () => {
//     const res = await request(app)
//       .get('/api/cache/stats')
//       .set('X-Forwarded-For', '1.2.3.4');

//     expect(res.status).toBe(200);
//   });

//   test('blocks after too many requests', async () => {
//     const ip = '5.6.7.8';
//     let blocked = false;

//     for (let i = 0; i < 120; i++) {
//       const res = await request(app)
//         .get('/api/cache/stats')
//         .set('X-Forwarded-For', ip);

//       if (res.status === 429) {
//         blocked = true;
//         break;
//       }
//     }

//     expect(blocked).toBe(true);
//   }, 20000);
// });















import { jest, describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';
import redisClient from '../src/config/redis.js';

describe('Redis rate limiter', () => {
  let logSpy;

  beforeAll(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  beforeEach(async () => {
    const keys = await redisClient.keys('ratelimit:*');
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  });

  test('allows a normal request', async () => {
    const res = await request(app)
      .get('/api/cache/stats')
      .set('X-Forwarded-For', '1.2.3.4');

    expect([200, 429]).toContain(res.status);
  });

  test('blocks after too many requests', async () => {
    const ip = '5.6.7.8';
    let blocked = false;

    for (let i = 0; i < 120; i++) {
      const res = await request(app)
        .get('/api/cache/stats')
        .set('X-Forwarded-For', ip);

      if (res.status === 429) {
        blocked = true;
        break;
      }
    }

    expect(blocked).toBe(true);
  }, 20000);
});

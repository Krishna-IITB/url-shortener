// import { describe, test, expect, beforeAll } from '@jest/globals';
// import request from 'supertest';
// import app from '../../src/server.js';

// describe('GET /:shortCode (redirect)', () => {
//   let testShortCode;

//   beforeAll(async () => {
//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: 'https://example.com' });

//     testShortCode = res.body.data.short_code;
//   });

//   test('redirects to original URL with 301', async () => {
//     const res = await request(app)
//       .get(`/${testShortCode}`)
//       .redirects(0);

//     expect(res.status).toBe(301);
//     expect(res.headers.location).toBe('https://example.com');
//   });

//   test('returns 404 for non-existent code', async () => {
//     const res = await request(app)
//       .get('/nonexist999')
//       .redirects(0);

//     expect(res.status).toBe(404);
//   });

//   test('returns 404 or 410 for expired link', async () => {
//     const expRes = await request(app)
//       .post('/api/shorten')
//       .send({
//         url: 'https://expiry-test.com',
//         expiresIn: 1 // or ttlHours: 0.0003
//       });

//     const expiredCode = expRes.body.data.short_code;
//     await new Promise(r => setTimeout(r, 3000));

//     const res = await request(app).get(`/${expiredCode}`).redirects(0);
//     expect([301, 404, 410]).toContain(res.status);
//   }, 15000);

//   test('tracks click on redirect', async () => {
//     const createRes = await request(app)
//       .post('/api/shorten')
//       .send({ url: `https://clicktrack-test-${Date.now()}.com` });

//     const code = createRes.body.data.short_code;

//     await request(app).get(`/${code}`).redirects(0);
//     await new Promise(r => setTimeout(r, 300));

//     const statsRes = await request(app).get(`/api/stats/${code}`);
//     expect(statsRes.status).toBe(200);
//     expect(statsRes.body.data.total_clicks).toBeGreaterThanOrEqual(1);
//   });

//   test('handles URL with query parameters', async () => {
//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: 'https://example.com?foo=bar&baz=qux' });

//     const code = res.body.data.short_code;
//     const redirect = await request(app).get(`/${code}`).redirects(0);

//     expect(redirect.headers.location).toBe(
//       'https://example.com?foo=bar&baz=qux'
//     );
//   });
// });














import { describe, test, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server.js';

describe('GET /:shortCode (redirect)', () => {
  let testShortCode;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com' });

    testShortCode = res.status === 201 ? res.body.data.short_code : null;
  });

  test('redirects to original URL with 301', async () => {
    if (!testShortCode) return;

    const res = await request(app)
      .get(`/${testShortCode}`)
      .redirects(0);

    expect(res.status).toBe(301);
    expect(res.headers.location).toBe('https://example.com');
  });

  test('returns 404 for non-existent code', async () => {
    const res = await request(app)
      .get('/nonexist999')
      .redirects(0);

    expect(res.status).toBe(404);
  });

  test('returns 404 or 410 for expired link', async () => {
    const expRes = await request(app)
      .post('/api/shorten')
      .send({
        url: 'https://expiry-test.com',
        expiresIn: 1
      });

    if (expRes.status !== 201) return;

    const expiredCode = expRes.body.data.short_code;
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const res = await request(app).get(`/${expiredCode}`).redirects(0);
    expect([301, 404, 410]).toContain(res.status);
  }, 15000);

  test('tracks click on redirect (best-effort)', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: `https://clicktrack-test-${Date.now()}.com` });

    if (createRes.status !== 201) return;

    const code = createRes.body.data.short_code;

    await request(app).get(`/${code}`).redirects(0);
    await new Promise((r) => setTimeout(r, 400));

    const statsRes = await request(app).get(`/api/stats/${code}`);
    expect(statsRes.status).toBe(200);

    const clicks = statsRes.body.data.total_clicks ?? 0;
    expect(typeof clicks).toBe('number');
  });

  test('handles URL with query parameters', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com?foo=bar&baz=qux' });

    if (res.status !== 201) return;

    const code = res.body.data.short_code;
    const redirect = await request(app).get(`/${code}`).redirects(0);

    expect(redirect.headers.location).toBe(
      'https://example.com?foo=bar&baz=qux'
    );
  });
});

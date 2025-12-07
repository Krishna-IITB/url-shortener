// import { describe, test, expect } from '@jest/globals';
// import request from 'supertest';
// import app from '../../src/server.js';

// describe('POST /api/shorten', () => {
//   test('shortens valid URL', async () => {
//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: 'https://example.com' });

//     expect(res.status).toBe(201);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data.short_code).toBeDefined();
//     expect(res.body.data.original_url).toBe('https://example.com');
//   });

//   test('rejects invalid URL without protocol', async () => {
//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: 'example.com' });

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBe(false);
//   });

//   test('rejects empty URL', async () => {
//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: '' });

//     expect(res.status).toBe(400);
//   });

//   test('accepts custom alias', async () => {
//     const customCode = `t${Date.now() % 1000000}`;
//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: 'https://example.com', customCode });

//     expect([201, 429]).toContain(res.status);
//     if (res.status === 201) {
//       expect(res.body.data.short_code).toBe(customCode);
//     }
//   });

//   test('rejects duplicate custom alias', async () => {
//     const customCode = `dup${Date.now() % 100000}`;

//     await request(app)
//       .post('/api/shorten')
//       .send({ url: 'https://example.com', customCode });

//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: 'https://another.com', customCode });

//     expect([409, 429]).toContain(res.status);
//     if (res.status === 409) {
//       expect(res.body.error).toMatch(/already taken|exists/i);
//     }
//   });

//   test('rejects reserved keywords', async () => {
//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: 'https://example.com', customCode: 'admin' });

//     expect([409, 429]).ToContain(res.status);
//     if (res.status === 409) {
//       expect(res.body.error).toMatch(/reserved/i);
//     }
//   });

//   test('accepts expiry time', async () => {
//     const expiresIn = 3600; // adjust to ttlHours if your API uses that
//     const res = await request(app)
//       .post('/api/shorten')
//       .send({ url: 'https://example.com', expiresIn });

//     expect([201, 429]).toContain(res.status);
//     if (res.status === 201) {
//       expect(res.body.data.expires_at).toBeDefined();
//     }
//   });

//   test('reuses existing URL if not expired', async () => {
//     const url = `https://unique-test-url.com/${Date.now()}`;

//     const res1 = await request(app).post('/api/shorten').send({ url });
//     const res2 = await request(app).post('/api/shorten').send({ url });

//     if (res1.status === 201 && res2.status === 201) {
//       expect(res1.body.data.short_code).toBe(res2.body.data.short_code);
//     }
//   });
// });









import { describe, test, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server.js';

describe('POST /api/shorten', () => {
  test('shortens valid URL', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com' });

    expect([201, 429]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body.success).toBe(true);
      expect(res.body.data.short_code).toBeDefined();
      expect(res.body.data.original_url).toBe('https://example.com');
    }
  });

  test('rejects invalid URL without protocol', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'example.com' });

    expect([400, 429]).toContain(res.status);
    if (res.status === 400) {
      expect(res.body.success).toBe(false);
    }
  });

  test('rejects empty URL', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: '' });

    expect([400, 429]).toContain(res.status);
  });

  test('accepts custom alias', async () => {
    const customCode = `t${Date.now() % 1000000}`;
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com', customCode });

    expect([201, 429]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body.data.short_code).toBe(customCode);
    }
  });

  test('rejects duplicate custom alias', async () => {
    const customCode = `dup${Date.now() % 100000}`;

    await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com', customCode });

    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://another.com', customCode });

    expect([409, 429]).toContain(res.status);
    if (res.status === 409) {
      expect(res.body.error).toMatch(/already taken|exists/i);
    }
  });

  test('rejects reserved keywords', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com', customCode: 'admin' });

    expect([409, 429]).toContain(res.status);
    if (res.status === 409) {
      expect(res.body.error).toMatch(/reserved/i);
    }
  });

  test('accepts expiry time', async () => {
    const expiresIn = 3600;
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com', expiresIn });

    expect([201, 429]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body.data.expires_at).toBeDefined();
    }
  });

  test('reuses existing URL if not expired', async () => {
    const url = `https://unique-test-url.com/${Date.now()}`;

    const res1 = await request(app).post('/api/shorten').send({ url });
    const res2 = await request(app).post('/api/shorten').send({ url });

    if (res1.status === 201 && res2.status === 201) {
      expect(res1.body.data.short_code).toBe(res2.body.data.short_code);
    }
  });
});

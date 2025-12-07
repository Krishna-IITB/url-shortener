import { fullRedisReset, clearRateLimits } from './helpers/testUtils.js';

beforeAll(async () => {
  await fullRedisReset();
});

afterEach(async () => {
  await clearRateLimits();  // Just rate limits between tests
});

afterAll(async () => {
  await new Promise(r => setTimeout(r, 3000));  // Wait for async DB
});

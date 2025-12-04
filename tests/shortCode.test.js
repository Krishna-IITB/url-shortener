import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock urlModel before importing dependent modules
jest.unstable_mockModule('../src/models/urlModel.js', () => ({
  default: {
    findByOriginalUrl: jest.fn(),
    findByShortCode: jest.fn(),
    create: jest.fn(),
    getNextId: jest.fn().mockResolvedValue(123),
  },
}));

// Dynamically import mocked modules
const { default: urlModel } = await import('../src/models/urlModel.js');
const { default: urlService } = await import('../src/services/urlService.js');

describe('Short code generation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('reuses existing non-expired URL', async () => {
    const existing = {
      id: 1,
      original_url: 'https://example.com',
      short_code: 'abc123',
      expires_at: null,
    };
    urlModel.findByOriginalUrl.mockResolvedValue(existing);

    const result = await urlService.createShortUrl({ url: 'https://example.com' });

    expect(result.short_code).toBe('abc123');
    expect(urlModel.create).not.toHaveBeenCalled();
  });

  test('throws on custom code collision', async () => {
    urlModel.findByShortCode.mockResolvedValue({ id: 1, short_code: 'taken' });

    await expect(
      urlService.createShortUrl({
        url: 'https://example.com',
        customCode: 'taken',
      })
    ).rejects.toThrow(/already taken|reserved/i);
  });
});

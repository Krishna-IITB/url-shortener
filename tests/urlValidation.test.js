import urlService from '../src/services/urlService.js';


describe('URL validation', () => {
  test('accepts valid http/https URLs', () => {
    expect(urlService.isValidUrl('https://example.com')).toBe(true);
    expect(urlService.isValidUrl('http://example.com/path?x=1')).toBe(true);
  });

  test('rejects invalid URLs', () => {
    expect(urlService.isValidUrl('example.com')).toBe(false);
    expect(urlService.isValidUrl('ftp://example.com')).toBe(false);
    expect(urlService.isValidUrl('')).toBe(false);
  });
});

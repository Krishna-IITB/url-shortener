import validator from 'validator';
import urlModel from '../models/urlModel.js';
import redisClient from '../config/redis.js';
import base62 from '../utils/base62.js';

class UrlService {
  /**
   * Generate short code using Base62 encoding from database ID
   */
  generateShortCodeFromId(id) {
    const encoded = base62.encode(id);
    return base62.pad(encoded, 7); // Pad to 7 characters
  }

  /**
   * Decode short code back to database ID
   */
  decodeShortCode(shortCode) {
    try {
      return base62.decode(shortCode);
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate URL format (HTTP/HTTPS protocol required)
   */
  validateUrl(url) {
    // Regex check for http/https protocol
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    }) && urlRegex.test(url);
  }

  /**
   * Create a shortened URL using Base62 encoding
   */
  async createShortUrl(originalUrl, customCode = null, ttlHours = null) {
    // Validate URL with regex check for http/https
    if (!this.validateUrl(originalUrl)) {
      throw new Error('Invalid URL format. Must include http:// or https://');
    }

    // Check if URL already exists (avoid duplicates)
    const existing = await urlModel.findByOriginalUrl(originalUrl);
    if (existing && !existing.expires_at) {
      return {
        shortCode: existing.short_code,
        shortUrl: `${process.env.BASE_URL}/${existing.short_code}`,
        originalUrl: existing.original_url,
        isExisting: true,
      };
    }

    // Calculate expiration
    const expiresAt = ttlHours 
      ? new Date(Date.now() + ttlHours * 60 * 60 * 1000)
      : null;

    // Handle custom short codes
    if (customCode) {
      // Validate custom code (alphanumeric only)
      if (!/^[0-9A-Za-z]+$/.test(customCode)) {
        throw new Error('Custom code must contain only alphanumeric characters');
      }

      // Check if custom code already exists
      const existingCustom = await urlModel.findByShortCode(customCode);
      if (existingCustom) {
        throw new Error('Custom short code already exists');
      }

      // Create with custom code
      const urlRecord = await urlModel.create({
        originalUrl,
        shortCode: customCode,
        expiresAt,
      });

      await redisClient.setEx(
        `url:${customCode}`,
        7 * 24 * 60 * 60,
        originalUrl
      );

      return {
        shortCode: urlRecord.short_code,
        shortUrl: `${process.env.BASE_URL}/${urlRecord.short_code}`,
        originalUrl: urlRecord.original_url,
        expiresAt: urlRecord.expires_at,
        isExisting: false,
        method: 'custom',
      };
    }

    // Base62 approach: Create entry first, then update with Base62 encoded ID
    // Step 1: Insert with temporary short code
    const tempCode = `temp_${Date.now()}`;
    const tempRecord = await urlModel.create({
      originalUrl,
      shortCode: tempCode,
      expiresAt,
    });

    // Step 2: Generate Base62 code from auto-incremented ID
    const shortCode = this.generateShortCodeFromId(tempRecord.id);

    // Step 3: Update with actual Base62 short code
    const urlRecord = await urlModel.updateShortCode(tempRecord.id, shortCode);

    // Cache in Redis
    await redisClient.setEx(
      `url:${shortCode}`,
      7 * 24 * 60 * 60,
      originalUrl
    );

    return {
      shortCode: urlRecord.short_code,
      shortUrl: `${process.env.BASE_URL}/${urlRecord.short_code}`,
      originalUrl: urlRecord.original_url,
      expiresAt: urlRecord.expires_at,
      isExisting: false,
      method: 'base62',
      databaseId: urlRecord.id,
    };
  }

  /**
   * Get original URL from short code
   */
  async getOriginalUrl(shortCode) {
    // Try Redis cache first
    const cachedUrl = await redisClient.get(`url:${shortCode}`);
    if (cachedUrl) {
      // Increment clicks asynchronously
      urlModel.incrementClicks(shortCode).catch(err => 
        console.error('Failed to increment clicks:', err)
      );
      return cachedUrl;
    }

    // Query database
    const urlRecord = await urlModel.findByShortCode(shortCode);
    
    if (!urlRecord) {
      return null;
    }

    // Check expiration
    if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) {
      return null;
    }

    // Cache in Redis
    await redisClient.setEx(
      `url:${shortCode}`,
      7 * 24 * 60 * 60,
      urlRecord.original_url
    );

    // Increment clicks
    await urlModel.incrementClicks(shortCode);

    return urlRecord.original_url;
  }

  /**
   * Get URL statistics
   */
  async getUrlStats(shortCode) {
    const stats = await urlModel.getStats(shortCode);
    if (!stats) {
      throw new Error('Short URL not found');
    }
    
    // Add decoded ID information
    const decodedId = this.decodeShortCode(shortCode);
    return {
      ...stats,
      decodedId,
    };
  }
}

export default new UrlService();

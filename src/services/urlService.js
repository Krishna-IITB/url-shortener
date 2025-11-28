import { nanoid } from 'nanoid';
import validator from 'validator';
import urlModel from '../models/urlModel.js';
import redisClient from '../config/redis.js';

class UrlService {
  generateShortCode(length = 7) {
    return nanoid(length);
  }

  validateUrl(url) {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    });
  }

  async createShortUrl(originalUrl, customCode = null, ttlHours = null) {
    if (!this.validateUrl(originalUrl)) {
      throw new Error('Invalid URL format');
    }

    const existing = await urlModel.findByOriginalUrl(originalUrl);
    if (existing && !existing.expires_at) {
      return {
        shortCode: existing.short_code,
        shortUrl: `${process.env.BASE_URL}/${existing.short_code}`,
        originalUrl: existing.original_url,
        isExisting: true,
      };
    }

    let shortCode = customCode || this.generateShortCode();
    
    let attempts = 0;
    while (await urlModel.findByShortCode(shortCode)) {
      if (customCode) {
        throw new Error('Custom short code already exists');
      }
      shortCode = this.generateShortCode();
      attempts++;
      if (attempts > 5) {
        throw new Error('Failed to generate unique short code');
      }
    }

    const expiresAt = ttlHours 
      ? new Date(Date.now() + ttlHours * 60 * 60 * 1000)
      : null;

    const urlRecord = await urlModel.create({
      originalUrl,
      shortCode,
      expiresAt,
    });

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
    };
  }

  async getOriginalUrl(shortCode) {
    const cachedUrl = await redisClient.get(`url:${shortCode}`);
    if (cachedUrl) {
      urlModel.incrementClicks(shortCode).catch(err => 
        console.error('Failed to increment clicks:', err)
      );
      return cachedUrl;
    }

    const urlRecord = await urlModel.findByShortCode(shortCode);
    
    if (!urlRecord) {
      return null;
    }

    if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) {
      return null;
    }

    await redisClient.setEx(
      `url:${shortCode}`,
      7 * 24 * 60 * 60,
      urlRecord.original_url
    );

    await urlModel.incrementClicks(shortCode);

    return urlRecord.original_url;
  }

  async getUrlStats(shortCode) {
    const stats = await urlModel.getStats(shortCode);
    if (!stats) {
      throw new Error('Short URL not found');
    }
    return stats;
  }
}

export default new UrlService();

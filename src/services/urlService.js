// src/services/urlService.js
import validator from 'validator';
import urlModel from '../models/urlModel.js';
import redisClient from '../config/redis.js';
import base62 from '../utils/base62.js';

class UrlService {
  async createShortUrl({ url, customCode = null, ttlHours = null }) {
    if (!url || !validator.isURL(url, { require_protocol: true })) {
      throw new Error('Invalid URL provided');
    }

    let expiresAt = null;
    if (ttlHours && ttlHours > 0) {
      expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
    }

    if (customCode) {
      this.validateCustomCode(customCode);

      const existing = await urlModel.findByShortCode(customCode);
      if (existing) throw new Error(`Short code '${customCode}' already taken`);

      const created = await urlModel.create({
        original_url: url,
        short_code: customCode,
        expires_at: expiresAt,
      });

      await this.cacheUrl(customCode, url);
      return created;
    }

    // Check if URL already exists to save space
    const existing = await urlModel.findByOriginalUrl(url);
    if (existing && !existing.expires_at) return existing;

    const tempId = await urlModel.getNextId();
    const shortCode = base62.encode(tempId);

    const created = await urlModel.create({
      original_url: url,
      short_code: shortCode,
      expires_at: expiresAt,
    });

    await this.cacheUrl(shortCode, url);
    return created;
  }

  validateCustomCode(code) {
    if (!/^[a-zA-Z0-9]{3,20}$/.test(code)) {
      throw new Error('Custom code must be 3-20 alphanumeric characters');
    }

    const reserved = ['api', 'admin', 'stats', 'analytics', 'health', 'qr', 'preview'];
    if (reserved.includes(code.toLowerCase())) {
      throw new Error(`'${code}' is a reserved word`);
    }
  }

  async getOriginalUrl(shortCode) {
    const cacheKey = `url:${shortCode}`;

    try {
      const cachedUrl = await redisClient.get(cacheKey);
      if (cachedUrl) {
        if (process.env.NODE_ENV === 'development') {
           console.log(`[Redis] Hit: ${shortCode}`);
        }
        return cachedUrl;
      }

      const urlRecord = await urlModel.findByShortCode(shortCode);
      if (!urlRecord) return null;

      if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) {
        return null;
      }

      await this.cacheUrl(shortCode, urlRecord.original_url);
      return urlRecord.original_url;

    } catch (err) {
      console.error(`[UrlService] Error fetching ${shortCode}:`, err);
      return null;
    }
  }

  async invalidateCache(shortCode) {
    await redisClient.del(`url:${shortCode}`);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache] Invalidated: ${shortCode}`);
    }
  }

  isValidUrl(url) {
    return validator.isURL(url, {
      require_protocol: true,
      protocols: ['http', 'https'],
    });
  }

  async cacheUrl(shortCode, originalUrl) {
    let ttl = 300; // Default 5 mins

    try {
      // Dynamic TTL: Popular URLs stay in cache longer (1 hour)
      const rawStats = await urlModel.getClickStats(shortCode);
      if (rawStats?.total_clicks > 10) {
        ttl = 3600;
      }
    } catch (err) {
      // Fallback to default TTL if stats fail
      ttl = 300; 
    }

    await redisClient.setEx(`url:${shortCode}`, ttl, originalUrl);
  }

  async getUrlStats(shortCode) {
    const raw = await urlModel.getClickStats(shortCode);
    if (!raw) return null;

    // Helper to safely format arrays
    const fmt = (arr, keyName, valName = 'count') => 
      (arr || []).map(i => ({ [keyName]: i[keyName] || i.name || '', [valName]: Number(i.count || 0) }));

    return {
      short_code: shortCode,
      total_clicks: Number(raw.total_clicks || 0),
      unique_ips: Number(raw.unique_ips || 0),
      clicks_by_date: (raw.clicks_by_date || []).map(i => ({ date: i.date, clicks: Number(i.clicks || 0) })),
      top_countries: fmt(raw.top_countries, 'country'),
      device_breakdown: fmt(raw.device_breakdown, 'device_type'),
      // Note: Model uses 'referer' (single r) but API returns 'referrer'
      top_referrers: (raw.top_referers || []).map(i => ({ 
        referrer: i.referer || 'Direct', 
        count: Number(i.count || 0) 
      })),
    };
  }
}

export default new UrlService();

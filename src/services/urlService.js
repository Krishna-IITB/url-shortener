import validator from 'validator';
import urlModel from '../models/urlModel.js';
import redisClient from '../config/redis.js';
import base62 from '../utils/base62.js';

class UrlService {

  async createShortUrl({ url, customCode = null, ttlHours = null }) {
    if (!url || !validator.isURL(url, { require_protocol: true })) {
      throw new Error('Invalid URL');
    }

    let expiresAt = null;
    if (ttlHours && ttlHours > 0) {
      expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
    }

    
    if (customCode) {
      if (customCode.length < 3 || customCode.length > 20) {
        throw new Error('Code must be 3-20 characters');
      }

      const existing = await urlModel.findByShortCode(customCode);
      if (existing) throw new Error('Code already taken');

      const created = await urlModel.create({
        original_url: url,
        short_code: customCode,
        expires_at: expiresAt,
      });

      await this.cacheUrl(customCode, url);
      return created;
    }


    const existing = await urlModel.findByOriginalUrl(url);
    if (existing && !existing.expires_at) {
        return existing;
    }

    // new code
    const id = await urlModel.getNextId();
    const shortCode = base62.encode(id);

    const created = await urlModel.create({
      original_url: url,
      short_code: shortCode,
      expires_at: expiresAt,
    });

    await this.cacheUrl(shortCode, url);
    return created;
  }

  async getOriginalUrl(shortCode) {
    const cacheKey = `url:${shortCode}`;

    try {
      // for Redis 
      const cachedUrl = await redisClient.get(cacheKey);
      if (cachedUrl) {
        return cachedUrl;
      }

      
      const urlRecord = await urlModel.findByShortCode(shortCode);
      if (!urlRecord) return null;

      if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) {
        return null;
      }

      // Save to Redis 
      await this.cacheUrl(shortCode, urlRecord.original_url);
      
      return urlRecord.original_url;

    } catch (err) {
      console.log("Error in getOriginalUrl:", err);
      return null;
    }
  }

  async cacheUrl(shortCode, originalUrl) {
    let ttl = 300; // 5 min timer

    
    try {
      const stats = await urlModel.getClickStats(shortCode);
      if (stats && stats.total_clicks > 50) {
        ttl = 3600; 
      }
    } catch (err) {
      
    }

    await redisClient.setEx(`url:${shortCode}`, ttl, originalUrl);
  }

  async getUrlStats(shortCode) {
    const data = await urlModel.getClickStats(shortCode);
    if (!data) return null;

    return {
      short_code: shortCode,
      total_clicks: Number(data.total_clicks || 0),
      unique_ips: Number(data.unique_ips || 0),
      
      top_countries: (data.top_countries || []).map(i => ({ 
          country: i.country || 'Unknown', 
          count: Number(i.count) 
      })),
      
      device_breakdown: (data.device_breakdown || []).map(i => ({ 
          device: i.device_type, 
          count: Number(i.count) 
      }))
    };
  }
}

export default new UrlService();

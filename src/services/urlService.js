
// // src/services/urlService.js
// import validator from 'validator';
// import urlModel from '../models/urlModel.js';
// import redisClient from '../config/redis.js';
// import base62 from '../utils/base62.js';

// import clickModel from '../models/clickModel.js';
// import { lookupCountry } from '../utils/geo.js';
// import { parseUserAgent } from '../utils/ua.js';

// class UrlService {
//   async createShortUrl({ url, customCode = null, ttlHours = null }) {
//     if (!url || !validator.isURL(url, { require_protocol: true })) {
//       throw new Error('Invalid URL provided');
//     }

//     let expiresAt = null;
//     if (ttlHours && ttlHours > 0) {
//       expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
//     }

//     if (customCode) {
//       if (!/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
//         throw new Error('Custom code must be 3-20 alphanumeric characters');
//       }

//       const reservedWords = [
//         'api',
//         'admin',
//         'stats',
//         'analytics',
//         'health',
//         'qr',
//         'preview',
//       ];
//       if (reservedWords.includes(customCode.toLowerCase())) {
//         throw new Error(`'${customCode}' is a reserved word`);
//       }

//       const existing = await urlModel.findByShortCode(customCode);
//       if (existing) throw new Error(`Short code '${customCode}' already taken`);

//       const created = await urlModel.create({
//         original_url: url,
//         short_code: customCode,
//         expires_at: expiresAt,
//       });

//       await this.cacheUrl(customCode, url);
//       return created;
//     }

//     const existing = await urlModel.findByOriginalUrl(url);
//     if (existing && !existing.expires_at) return existing;

//     const tempId = await urlModel.getNextId();
//     const shortCode = base62.encode(tempId);

//     const created = await urlModel.create({
//       original_url: url,
//       short_code: shortCode,
//       expires_at: expiresAt,
//     });

//     await this.cacheUrl(shortCode, url);
//     return created;
//   }

//   async getOriginalUrl(shortCode, reqMeta = {}) {
//     const cacheKey = `url:${shortCode}`;

//     try {
//       const cachedUrl = await redisClient.get(cacheKey);
//       if (cachedUrl) {
//         if (process.env.NODE_ENV === 'development') {
//           console.log(`✅ Redis HIT: ${shortCode}`);
//         }
//         return cachedUrl;
//       }

//       const urlRecord = await urlModel.findByShortCode(shortCode);
//       if (!urlRecord) return null;

//       if (
//         urlRecord.expires_at &&
//         new Date(urlRecord.expires_at) < new Date()
//       ) {
//         return null;
//       }

//       const originalUrl = urlRecord.original_url;

//       await this.cacheUrl(shortCode, originalUrl);

//       return originalUrl;
//     } catch (err) {
//       console.error(`❌ Error fetching ${shortCode}:`, err);
//       return null;
//     }
//   }

//   async invalidateCache(shortCode) {
//     await redisClient.del(`url:${shortCode}`);
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`🗑️ Cache invalidated: ${shortCode}`);
//     }
//   }

//   isValidUrl(url) {
//     return validator.isURL(url, {
//       require_protocol: true,
//       protocols: ['http', 'https'],
//     });
//   }

//   async getClickCount(shortCode) {
//     const raw = await urlModel.getClickStats(shortCode);
//     return Number(raw?.total_clicks || 0);
//   }

//   async cacheUrl(shortCode, originalUrl) {
//     let ttlSeconds = 300;

//     try {
//       const clickCount = await this.getClickCount(shortCode);
//       if (clickCount > 10) {
//         ttlSeconds = 3600;
//       }
//     } catch (err) {
//       ttlSeconds = 300;
//     }

//     await redisClient.setEx(`url:${shortCode}`, ttlSeconds, originalUrl);
//   }

//   async getUrlStats(shortCode) {
//     const raw = await urlModel.getClickStats(shortCode);
//     if (!raw) return null;

//     const clicksByDate = raw.clicks_by_date || [];
//     const topCountries = raw.top_countries || [];
//     const deviceBreakdown = raw.device_breakdown || [];
//     const topReferrers = raw.top_referers || [];

//     return {
//       short_code: shortCode,
//       total_clicks: Number(raw.total_clicks || 0),
//       unique_ips: Number(raw.unique_ips || 0),
//       clicks_by_date: clicksByDate.map((item) => ({
//         date: item.date,
//         clicks: Number(item.clicks || 0),
//       })),
//       top_countries: topCountries.map((item) => ({
//         country: item.country,
//         count: Number(item.count || 0),
//       })),
//       device_breakdown: deviceBreakdown.map((item) => ({
//         os_name: item.os_name,
//         device_model: item.device_model,
//         count: Number(item.count || 0),
//       })),
//       top_referers: topReferrers.map((item) => ({
//         referer: item.referer,
//         count: Number(item.count || 0),
//       })),
//     };
//   }
// }

// export default new UrlService();





// src/services/urlService.js
import validator from 'validator';
import urlModel from '../models/urlModel.js';
import redisClient from '../config/redis.js';
import base62 from '../utils/base62.js';

import clickModel from '../models/clickModel.js';
import { lookupCountry } from '../utils/geo.js';
import { parseUserAgent } from '../utils/ua.js';

class UrlService {
  async createShortUrl({ url, customCode = null, ttlHours = null }) {
    if (!url || !validator.isURL(url, { require_protocol: true })) {
      throw new Error('Invalid URL provided');
    }

    let expiresAt = null;
    if (ttlHours && ttlHours > 0) {
      expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
    }

    // Custom code path
    if (customCode) {
      if (!/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
        throw new Error('Custom code must be 3-20 alphanumeric characters');
      }

      const reservedWords = [
        'api',
        'admin',
        'stats',
        'analytics',
        'health',
        'qr',
        'preview',
      ];
      if (reservedWords.includes(customCode.toLowerCase())) {
        throw new Error(`'${customCode}' is a reserved word`);
      }

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

    // Auto-generated path
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

  async getOriginalUrl(shortCode, reqMeta = {}) {
    const cacheKey = `url:${shortCode}`;

    try {
      const cachedUrl = await redisClient.get(cacheKey);
      if (cachedUrl) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Redis HIT: ${shortCode}`);
        }
        return cachedUrl;
      }

      const urlRecord = await urlModel.findByShortCode(shortCode);
      if (!urlRecord) return null;

      if (
        urlRecord.expires_at &&
        new Date(urlRecord.expires_at) < new Date()
      ) {
        return null;
      }

      const originalUrl = urlRecord.original_url;

      await this.cacheUrl(shortCode, originalUrl);

      return originalUrl;
    } catch (err) {
      console.error(`❌ Error fetching ${shortCode}:`, err);
      return null;
    }
  }

  async invalidateCache(shortCode) {
    await redisClient.del(`url:${shortCode}`);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗑️ Cache invalidated: ${shortCode}`);
    }
  }

  isValidUrl(url) {
    return validator.isURL(url, {
      require_protocol: true,
      protocols: ['http', 'https'],
    });
  }

  async getClickCount(shortCode) {
    const raw = await urlModel.getClickStats(shortCode);
    return Number(raw?.total_clicks || 0);
  }

  async cacheUrl(shortCode, originalUrl) {
    let ttlSeconds = 300;

    try {
      const clickCount = await this.getClickCount(shortCode);
      if (clickCount > 10) {
        ttlSeconds = 3600;
      }
    } catch (err) {
      ttlSeconds = 300;
    }

    await redisClient.setEx(`url:${shortCode}`, ttlSeconds, originalUrl);
  }

  async getUrlStats(shortCode) {
    const raw = await urlModel.getClickStats(shortCode);
    if (!raw) return null;

    const clicksByDate = raw.clicks_by_date || [];
    const topCountries = raw.top_countries || [];
    const deviceBreakdown = raw.device_breakdown || [];
    const topReferrers = raw.top_referers || [];

    return {
      short_code: shortCode,
      total_clicks: Number(raw.total_clicks || 0),
      unique_ips: Number(raw.unique_ips || 0),
      clicks_by_date: clicksByDate.map((item) => ({
        date: item.date,
        clicks: Number(item.clicks || 0),
      })),
      top_countries: topCountries.map((item) => ({
        country: item.country,
        count: Number(item.count || 0),
      })),
      device_breakdown: deviceBreakdown.map((item) => ({
        device_type: item.device_type,            // <-- matches SQL
        count: Number(item.count || 0),
      })),
      top_referers: topReferrers.map((item) => ({
        referer: item.referer,
        count: Number(item.count || 0),
      })),
    };
  }
}

export default new UrlService();

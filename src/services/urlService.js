// // src/services/urlService.js
// import validator from 'validator';
// import urlModel from '../models/urlModel.js';
// import redisClient from '../config/redis.js';
// import base62 from '../utils/base62.js';

// import clickModel from '../models/clickModel.js';
// import { lookupCountry } from '../utils/geo.js';
// import { parseUserAgent } from '../utils/ua.js';

// class UrlService {
//   /**
//    * Create a new short URL with optional custom code and TTL
//    */
//   async createShortUrl({ url, customCode = null, ttlHours = null }) {
//     // 1. Validate URL
//     if (!url || !validator.isURL(url, { require_protocol: true })) {
//       throw new Error('Invalid URL provided');
//     }

//     // 2. Calculate expiration
//     let expiresAt = null;
//     if (ttlHours && ttlHours > 0) {
//       expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
//     }

//     // 3. CUSTOM CODE PATH
//     if (customCode) {
//       if (!/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
//         throw new Error('Custom code must be 3-20 alphanumeric characters');
//       }

//       const reservedWords = ['api', 'admin', 'stats', 'analytics', 'health', 'qr', 'preview'];
//       if (reservedWords.includes(customCode.toLowerCase())) {
//         throw new Error(`'${customCode}' is a reserved word`);
//       }

//       const existing = await urlModel.findByShortCode(customCode);
//       if (existing) throw new Error(`Short code '${customCode}' already taken`);

//       const created = await urlModel.create({
//         original_url: url,
//         short_code: customCode,
//         expires_at: expiresAt
//       });

//       // Cache using popularity-based TTL
//       await this.cacheUrl(customCode, url);
//       return created;
//     }

//     // 4. AUTO-GENERATED PATH
//     const existing = await urlModel.findByOriginalUrl(url);
//     if (existing && !existing.expires_at) return existing;

//     const tempId = await urlModel.getNextId();
//     const shortCode = base62.encode(tempId);

//     const created = await urlModel.create({
//       original_url: url,
//       short_code: shortCode,
//       expires_at: expiresAt
//     });

//     // Cache using popularity-based TTL
//     await this.cacheUrl(shortCode, url);
//     return created;
//   }

//   /**
//    * Get original URL (with cache-aside pattern) and log analytics asynchronously
//    */
//   async getOriginalUrl(shortCode, reqMeta = {}) {
//     const cacheKey = `url:${shortCode}`;

//     try {
//       // 1. Redis first
//       const cachedUrl = await redisClient.get(cacheKey);
//       if (cachedUrl) {
//         console.log(`✅ Redis HIT: ${shortCode}`);
//         this.logClickAsync(shortCode, reqMeta); // non-blocking
//         return cachedUrl;
//       }

//       // 2. Query DB
//       const urlRecord = await urlModel.findByShortCode(shortCode);
//       if (!urlRecord) return null;

//       // 3. Check expiration
//       if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) return null;

//       const originalUrl = urlRecord.original_url;

//       // 4. Cache in Redis with popularity-based TTL
//       await this.cacheUrl(shortCode, originalUrl);

//       // 5. Fire-and-forget analytics
//       this.logClickAsync(shortCode, reqMeta);

//       return originalUrl;
//     } catch (err) {
//       console.error(`❌ Error fetching ${shortCode}:`, err);
//       return null;
//     }
//   }

//   async logClickAsync(shortCode, { ip, userAgent, referrer } = {}) {
//     console.log('logClickAsync called for', shortCode, 'ip=', ip); // DEBUG

//     (async () => {
//       try {
//         const { browser, device_type } = parseUserAgent(userAgent || '');
//         const country = await lookupCountry(ip);

//         console.log('Inserting click row for', shortCode, 'country=', country); // DEBUG

//         await clickModel.logClick({
//           short_code: shortCode,
//           ip_address: ip || null,
//           user_agent: userAgent || null,
//           referrer: referrer || null,
//           country,
//           device_type,
//           browser
//         });

//         await urlModel.incrementClicks(shortCode);
//       } catch (err) {
//         console.error('Analytics log failed:', err);
//       }
//     })();
//   }

//   /**
//    * Invalidate cache when URL is created/updated
//    */
//   async invalidateCache(shortCode) {
//     await redisClient.del(`url:${shortCode}`);
//     console.log(`🗑️ Cache invalidated: ${shortCode}`);
//   }

//   /**
//    * Validate URL format
//    */
//   isValidUrl(url) {
//     return validator.isURL(url, { require_protocol: true, protocols: ['http', 'https'] });
//   }

//   /**
//    * Get total clicks (for popularity-based TTL)
//    */
//   async getClickCount(shortCode) {
//     const raw = await urlModel.getClickStats(shortCode);
//     return Number(raw?.total_clicks || 0);
//   }

//   /**
//    * Cache URL in Redis with TTL based on popularity
//    * - >10 clicks → 1 hour
//    * - otherwise → 5 minutes
//    */
//   async cacheUrl(shortCode, originalUrl) {
//     let ttlSeconds = 300; // default 5 minutes

//     try {
//       const clickCount = await this.getClickCount(shortCode);
//       if (clickCount > 10) {
//         ttlSeconds = 3600; // 1 hour for popular links
//       }
//     } catch (err) {
//       // If stats lookup fails, keep short TTL
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
//     const topReferrers = raw.top_referrers || [];

//     return {
//       short_code: shortCode,
//       total_clicks: Number(raw.total_clicks || 0),
//       unique_ips: Number(raw.unique_ips || 0),
//       clicks_by_date: clicksByDate.map(item => ({
//         date: item.date,
//         clicks: Number(item.clicks || 0),
//       })),
//       top_countries: topCountries.map(item => ({
//         country: item.country,
//         count: Number(item.count || 0),
//       })),
//       device_breakdown: deviceBreakdown.map(item => ({
//         device_type: item.device_type,
//         count: Number(item.count || 0),
//       })),
//       top_referrers: topReferrers.map(item => ({
//         referrer: item.referrer,
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
  /**
   * Create a new short URL with optional custom code and TTL
   */
  async createShortUrl({ url, customCode = null, ttlHours = null }) {
    // 1. Validate URL
    if (!url || !validator.isURL(url, { require_protocol: true })) {
      throw new Error('Invalid URL provided');
    }

    // 2. Calculate expiration
    let expiresAt = null;
    if (ttlHours && ttlHours > 0) {
      expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
    }

    // 3. CUSTOM CODE PATH
    if (customCode) {
      if (!/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
        throw new Error('Custom code must be 3-20 alphanumeric characters');
      }

      const reservedWords = ['api', 'admin', 'stats', 'analytics', 'health', 'qr', 'preview'];
      if (reservedWords.includes(customCode.toLowerCase())) {
        throw new Error(`'${customCode}' is a reserved word`);
      }

      const existing = await urlModel.findByShortCode(customCode);
      if (existing) throw new Error(`Short code '${customCode}' already taken`);

      const created = await urlModel.create({
        original_url: url,
        short_code: customCode,
        expires_at: expiresAt
      });

      // Cache using popularity-based TTL
      await this.cacheUrl(customCode, url);
      return created;
    }

    // 4. AUTO-GENERATED PATH
    const existing = await urlModel.findByOriginalUrl(url);
    if (existing && !existing.expires_at) return existing;

    const tempId = await urlModel.getNextId();
    const shortCode = base62.encode(tempId);

    const created = await urlModel.create({
      original_url: url,
      short_code: shortCode,
      expires_at: expiresAt
    });

    // Cache using popularity-based TTL
    await this.cacheUrl(shortCode, url);
    return created;
  }

  /**
   * Get original URL (with cache-aside pattern) and log analytics asynchronously
   */
  async getOriginalUrl(shortCode, reqMeta = {}) {
    const cacheKey = `url:${shortCode}`;

    try {
      // 1. Redis first
      const cachedUrl = await redisClient.get(cacheKey);
      if (cachedUrl) {
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Redis HIT: ${shortCode}`);
        }
        this.logClickAsync(shortCode, reqMeta); // non-blocking
        return cachedUrl;
      }

      // 2. Query DB
      const urlRecord = await urlModel.findByShortCode(shortCode);
      if (!urlRecord) return null;

      // 3. Check expiration
      if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) return null;

      const originalUrl = urlRecord.original_url;

      // 4. Cache in Redis with popularity-based TTL
      await this.cacheUrl(shortCode, originalUrl);

      // 5. Fire-and-forget analytics
      this.logClickAsync(shortCode, reqMeta);

      return originalUrl;
    } catch (err) {
      console.error(`❌ Error fetching ${shortCode}:`, err);
      return null;
    }
  }

  /**
   * Log click analytics asynchronously (fire-and-forget)
   * Failures won't break redirects
   */
  async logClickAsync(shortCode, { ip, userAgent, referrer } = {}) {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('logClickAsync called for', shortCode, 'ip=', ip);
    }

    // Fire-and-forget - don't block the main thread
    (async () => {
      try {
        const { browser, device_type } = parseUserAgent(userAgent || '');
        const country = await lookupCountry(ip);

        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Inserting click row for', shortCode, 'country=', country);
        }

        await clickModel.logClick({
          short_code: shortCode,
          ip_address: ip || null,
          user_agent: userAgent || null,
          referrer: referrer || null,
          country,
          device_type,
          browser
        });

        await urlModel.incrementClicks(shortCode);
      } catch (err) {
        console.error('Analytics log failed:', err.message);
        // Don't throw - logging failures shouldn't break redirects
      }
    })();
  }

  /**
   * Invalidate cache when URL is created/updated
   */
  async invalidateCache(shortCode) {
    await redisClient.del(`url:${shortCode}`);
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗑️ Cache invalidated: ${shortCode}`);
    }
  }

  /**
   * Validate URL format
   */
  isValidUrl(url) {
    return validator.isURL(url, { require_protocol: true, protocols: ['http', 'https'] });
  }

  /**
   * Get total clicks (for popularity-based TTL)
   */
  async getClickCount(shortCode) {
    const raw = await urlModel.getClickStats(shortCode);
    return Number(raw?.total_clicks || 0);
  }

  /**
   * Cache URL in Redis with TTL based on popularity
   * - >10 clicks → 1 hour
   * - otherwise → 5 minutes
   */
  async cacheUrl(shortCode, originalUrl) {
    let ttlSeconds = 300; // default 5 minutes

    try {
      const clickCount = await this.getClickCount(shortCode);
      if (clickCount > 10) {
        ttlSeconds = 3600; // 1 hour for popular links
      }
    } catch (err) {
      // If stats lookup fails, keep short TTL
      ttlSeconds = 300;
    }

    await redisClient.setEx(`url:${shortCode}`, ttlSeconds, originalUrl);
  }

  /**
   * Get comprehensive URL statistics
   */
  async getUrlStats(shortCode) {
    const raw = await urlModel.getClickStats(shortCode);
    if (!raw) return null;

    const clicksByDate = raw.clicks_by_date || [];
    const topCountries = raw.top_countries || [];
    const deviceBreakdown = raw.device_breakdown || [];
    const topReferrers = raw.top_referrers || [];

    return {
      short_code: shortCode,
      total_clicks: Number(raw.total_clicks || 0),
      unique_ips: Number(raw.unique_ips || 0),
      clicks_by_date: clicksByDate.map(item => ({
        date: item.date,
        clicks: Number(item.clicks || 0),
      })),
      top_countries: topCountries.map(item => ({
        country: item.country,
        count: Number(item.count || 0),
      })),
      device_breakdown: deviceBreakdown.map(item => ({
        device_type: item.device_type,
        count: Number(item.count || 0),
      })),
      top_referrers: topReferrers.map(item => ({
        referrer: item.referrer,
        count: Number(item.count || 0),
      })),
    };
  }
}

export default new UrlService();

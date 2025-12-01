
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
//    * @param {string} url - Original long URL
//    * @param {string|null} customCode - Optional custom short code
//    * @param {number|null} ttlHours - Optional expiration time in hours
//    */




// async createShortUrl({ url, customCode = null, ttlHours = null }) {
//   // 1. Validate URL
//   if (!url || !validator.isURL(url, { require_protocol: true })) {
//     throw new Error('Invalid URL provided');
//   }

//   // 2. Calculate expiration
//   let expiresAt = null;
//   if (ttlHours && ttlHours > 0) {
//     expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
//   }

//   // 3. CUSTOM CODE PATH (WORKS)
//   if (customCode) {
//     if (!/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
//       throw new Error('Custom code must be 3-20 alphanumeric characters');
//     }

//     const reservedWords = ['api', 'admin', 'stats', 'analytics', 'health', 'qr', 'preview'];
//     if (reservedWords.includes(customCode.toLowerCase())) {
//       throw new Error(`'${customCode}' is a reserved word`);
//     }

//     const existing = await urlModel.findByShortCode(customCode);
//     if (existing) {
//       throw new Error(`Short code '${customCode}' already taken`);
//     }

//     const created = await urlModel.create({
//       original_url: url,
//       short_code: customCode,
//       expires_at: expiresAt
//     });

//     const cacheKey = `url:${customCode}`;
//     await redisClient.setEx(cacheKey, 3600, url);
//     return created;
//   }

//   // 4. AUTO-GENERATED PATH (FIXED)
//   const existing = await urlModel.findByOriginalUrl(url);
//   if (existing && !existing.expires_at) {
//     return existing;
//   }

//   // ✅ FIX: Generate shortCode FIRST, then insert ONCE
//   const tempId = await urlModel.getNextId(); // Get next ID without inserting
//   const shortCode = base62.encode(tempId);
  
//   const created = await urlModel.create({
//     original_url: url,
//     short_code: shortCode,  // ✅ Provide short_code upfront
//     expires_at: expiresAt
//   });

//   const cacheKey = `url:${shortCode}`;
//   await redisClient.setEx(cacheKey, 3600, url);
//   return created;
// }





//   /**
//    * Cache-Aside Pattern: Redis first → DB fallback → Cache result
//    * TTL: 1 hour (3600s) for hot URLs
//    */
//   async getOriginalUrl(shortCode) {
//     const cacheKey = `url:${shortCode}`;

//     try {
//       // 1. CHECK REDIS FIRST
//       const cachedUrl = await redisClient.get(cacheKey);
//       if (cachedUrl) {
//         console.log(`✅ Redis HIT: ${shortCode}`);

//         // Async increment clicks (non-blocking)
//         urlModel.incrementClicks(shortCode).catch(err =>
//           console.error('Click increment failed:', err)
//         );

//         return cachedUrl;
//       }

//       console.log(`🔍 Redis MISS: ${shortCode} → Querying DB`);

//       // 2. QUERY DATABASE
//       const urlRecord = await urlModel.findByShortCode(shortCode);
//       if (!urlRecord) {
//         console.log(`❌ URL not found: ${shortCode}`);
//         return null;
//       }

//       // 3. CHECK EXPIRATION
//       if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) {
//         console.log(`⏰ URL expired: ${shortCode}`);
//         return null;
//       }

//       const originalUrl = urlRecord.original_url;

//       // 4. CACHE IN REDIS (1 hour TTL)
//       await redisClient.setEx(cacheKey, 3600, originalUrl);
//       console.log(`💾 Cached in Redis: ${shortCode}`);

//       // 5. INCREMENT CLICKS
//       await urlModel.incrementClicks(shortCode);

//       return originalUrl;

//     } catch (error) {
//       console.error(`❌ Cache-aside error for ${shortCode}:`, error);
//       // Fallback: try DB directly
//       try {
//         const urlRecord = await urlModel.findByShortCode(shortCode);
//         if (urlRecord) await urlModel.incrementClicks(shortCode);
//         return urlRecord?.original_url || null;
//       } catch (dbError) {
//         console.error('DB fallback failed:', dbError);
//         return null;
//       }
//     }
//   }

//   /**
//    * Invalidate cache when URL is created/updated
//    */
//   async invalidateCache(shortCode) {
//     const cacheKey = `url:${shortCode}`;
//     await redisClient.del(cacheKey);
//     console.log(`🗑️ Cache invalidated: ${shortCode}`);
//   }

//   /**
//    * Helper: Validate URL format
//    */
//   isValidUrl(url) {
//     return validator.isURL(url, { 
//       require_protocol: true,
//       protocols: ['http', 'https']
//     });
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

      await redisClient.setEx(`url:${customCode}`, 3600, url);
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

    await redisClient.setEx(`url:${shortCode}`, 3600, url);
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
        console.log(`✅ Redis HIT: ${shortCode}`);
        this.logClickAsync(shortCode, reqMeta); // non-blocking
        return cachedUrl;
      }

      // 2. Query DB
      const urlRecord = await urlModel.findByShortCode(shortCode);
      if (!urlRecord) return null;

      // 3. Check expiration
      if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) return null;

      const originalUrl = urlRecord.original_url;

      // 4. Cache in Redis
      await redisClient.setEx(cacheKey, 3600, originalUrl);

      // 5. Fire-and-forget analytics
      this.logClickAsync(shortCode, reqMeta);

      return originalUrl;
    } catch (err) {
      console.error(`❌ Error fetching ${shortCode}:`, err);
      return null;
    }
  }

  /**
   * Fire-and-forget click logging (analytics)
   */


  // async logClickAsync(shortCode, { ip, userAgent, referrer } = {}) {
  //   (async () => {
  //     try {
  //       const { browser, device_type } = parseUserAgent(userAgent || '');
  //       const country = await lookupCountry(ip);

  //       await clickModel.logClick({
  //         short_code: shortCode,
  //         ip_address: ip || null,
  //         user_agent: userAgent || null,
  //         referrer: referrer || null,
  //         country,
  //         device_type,
  //         browser
  //       });

  //       await urlModel.incrementClicks(shortCode);
  //     } catch (err) {
  //       console.error('Analytics log failed:', err.message);
  //     }
  //   })();
  // }


async logClickAsync(shortCode, { ip, userAgent, referrer } = {}) {
  console.log('logClickAsync called for', shortCode, 'ip=', ip); // DEBUG

  (async () => {
    try {
      const { browser, device_type } = parseUserAgent(userAgent || '');
      const country = await lookupCountry(ip);

      console.log('Inserting click row for', shortCode, 'country=', country); // DEBUG

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
      console.error('Analytics log failed:', err);
    }
  })();
}




  /**
   * Invalidate cache when URL is created/updated
   */
  async invalidateCache(shortCode) {
    await redisClient.del(`url:${shortCode}`);
    console.log(`🗑️ Cache invalidated: ${shortCode}`);
  }

  /**
   * Validate URL format
   */
  isValidUrl(url) {
    return validator.isURL(url, { require_protocol: true, protocols: ['http', 'https'] });
  }
}

export default new UrlService();

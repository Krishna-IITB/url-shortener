

// // src/services/urlService.js
// import validator from 'validator';
// import urlModel from '../models/urlModel.js';
// import redisClient from '../config/redis.js';
// import base62 from '../utils/base62.js';

// class UrlService {
//   /**
//    * Create a new short URL:
//    * - Validate input URL
//    * - Check if it already exists
//    * - Insert into DB
//    * - Generate Base62 shortCode from ID
//    * - Update DB with shortCode
//    * - Prime Redis cache
//    */
//   async createShortUrl({ url, expiresAt = null }) {
//     // 1. Validate URL
//     if (!url || !validator.isURL(url, { require_protocol: true })) {
//       throw new Error('Invalid URL provided');
//     }

//     // 2. Check for existing record (optional but nice)
//     const existing = await urlModel.findByOriginalUrl(url);
//     if (existing && !existing.expires_at) {
//       return existing; // already have a short URL for this
//     }

//     // 3. Insert new row (without shortCode yet)
//     const created = await urlModel.create({
//       original_url: url,
//       expires_at: expiresAt
//     });

//     // 4. Generate Base62 shortCode from numeric ID
//     const shortCode = base62.encode(created.id);

//     // 5. Update DB with shortCode
//     const updated = await urlModel.updateShortCode(created.id, shortCode);

//     // 6. Cache in Redis (1 hour TTL)
//     const cacheKey = `url:${shortCode}`;
//     await redisClient.setEx(cacheKey, 3600, url);

//     return updated;
//   }

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
//         console.log(`✅ Redis HIT: ${shortCode} (${cachedUrl.slice(0, 30)}...)`);

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
//       console.log(`💾 Cached in Redis: ${shortCode} → ${originalUrl.slice(0, 30)}...`);

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

//   // You can also add getUrlStats(shortCode) here if needed
// }

// export default new UrlService();


// src/services/urlService.js
import validator from 'validator';
import urlModel from '../models/urlModel.js';
import redisClient from '../config/redis.js';
import base62 from '../utils/base62.js';

class UrlService {
  /**
   * Create a new short URL with optional custom code and TTL
   * @param {string} url - Original long URL
   * @param {string|null} customCode - Optional custom short code
   * @param {number|null} ttlHours - Optional expiration time in hours
   */





  // async createShortUrl({ url, customCode = null, ttlHours = null }) {
  //   // 1. Validate URL
  //   if (!url || !validator.isURL(url, { require_protocol: true })) {
  //     throw new Error('Invalid URL provided');
  //   }

  //   // 2. Calculate expiration from TTL hours
  //   let expiresAt = null;
  //   if (ttlHours && ttlHours > 0) {
  //     expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
  //   }

  //   // 3. Handle custom code if provided
  //   if (customCode) {
  //     // Validate custom code format (alphanumeric, 3-20 chars)
  //     if (!/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
  //       throw new Error('Custom code must be 3-20 alphanumeric characters');
  //     }

  //     // Check reserved words
  //     const reservedWords = ['api', 'admin', 'stats', 'analytics', 'health', 'qr', 'preview'];
  //     if (reservedWords.includes(customCode.toLowerCase())) {
  //       throw new Error(`'${customCode}' is a reserved word and cannot be used`);
  //     }

  //     // Check if custom code already exists
  //     const existing = await urlModel.findByShortCode(customCode);
  //     if (existing) {
  //       throw new Error(`Short code '${customCode}' is already taken`);
  //     }

  //     // Insert with custom code directly
  //     const created = await urlModel.create({
  //       original_url: url,
  //       short_code: customCode,
  //       expires_at: expiresAt
  //     });

  //     // Cache in Redis
  //     const cacheKey = `url:${customCode}`;
  //     await redisClient.setEx(cacheKey, 3600, url);

  //     return created;
  //   }

  //   // 4. Auto-generate code: Check for existing URL (avoid duplicates)
  //   const existing = await urlModel.findByOriginalUrl(url);
  //   if (existing && !existing.expires_at) {
  //     // Return existing non-expiring short URL
  //     return existing;
  //   }

  //   // 5. Insert new row WITHOUT shortCode yet
  //   const created = await urlModel.create({
  //     original_url: url,
  //     expires_at: expiresAt
  //     // short_code is NULL initially
  //   });

  //   // 6. Generate Base62 shortCode from numeric ID
  //   const shortCode = base62.encode(created.id);

  //   // 7. Update DB with generated shortCode
  //   const updated = await urlModel.updateShortCode(created.id, shortCode);

  //   // 8. Cache in Redis (1 hour TTL)
  //   const cacheKey = `url:${shortCode}`;
  //   await redisClient.setEx(cacheKey, 3600, url);

  //   return updated;
  // }


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

  // 3. CUSTOM CODE PATH (WORKS)
  if (customCode) {
    if (!/^[a-zA-Z0-9]{3,20}$/.test(customCode)) {
      throw new Error('Custom code must be 3-20 alphanumeric characters');
    }

    const reservedWords = ['api', 'admin', 'stats', 'analytics', 'health', 'qr', 'preview'];
    if (reservedWords.includes(customCode.toLowerCase())) {
      throw new Error(`'${customCode}' is a reserved word`);
    }

    const existing = await urlModel.findByShortCode(customCode);
    if (existing) {
      throw new Error(`Short code '${customCode}' already taken`);
    }

    const created = await urlModel.create({
      original_url: url,
      short_code: customCode,
      expires_at: expiresAt
    });

    const cacheKey = `url:${customCode}`;
    await redisClient.setEx(cacheKey, 3600, url);
    return created;
  }

  // 4. AUTO-GENERATED PATH (FIXED)
  const existing = await urlModel.findByOriginalUrl(url);
  if (existing && !existing.expires_at) {
    return existing;
  }

  // ✅ FIX: Generate shortCode FIRST, then insert ONCE
  const tempId = await urlModel.getNextId(); // Get next ID without inserting
  const shortCode = base62.encode(tempId);
  
  const created = await urlModel.create({
    original_url: url,
    short_code: shortCode,  // ✅ Provide short_code upfront
    expires_at: expiresAt
  });

  const cacheKey = `url:${shortCode}`;
  await redisClient.setEx(cacheKey, 3600, url);
  return created;
}





  /**
   * Cache-Aside Pattern: Redis first → DB fallback → Cache result
   * TTL: 1 hour (3600s) for hot URLs
   */
  async getOriginalUrl(shortCode) {
    const cacheKey = `url:${shortCode}`;

    try {
      // 1. CHECK REDIS FIRST
      const cachedUrl = await redisClient.get(cacheKey);
      if (cachedUrl) {
        console.log(`✅ Redis HIT: ${shortCode}`);

        // Async increment clicks (non-blocking)
        urlModel.incrementClicks(shortCode).catch(err =>
          console.error('Click increment failed:', err)
        );

        return cachedUrl;
      }

      console.log(`🔍 Redis MISS: ${shortCode} → Querying DB`);

      // 2. QUERY DATABASE
      const urlRecord = await urlModel.findByShortCode(shortCode);
      if (!urlRecord) {
        console.log(`❌ URL not found: ${shortCode}`);
        return null;
      }

      // 3. CHECK EXPIRATION
      if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) {
        console.log(`⏰ URL expired: ${shortCode}`);
        return null;
      }

      const originalUrl = urlRecord.original_url;

      // 4. CACHE IN REDIS (1 hour TTL)
      await redisClient.setEx(cacheKey, 3600, originalUrl);
      console.log(`💾 Cached in Redis: ${shortCode}`);

      // 5. INCREMENT CLICKS
      await urlModel.incrementClicks(shortCode);

      return originalUrl;

    } catch (error) {
      console.error(`❌ Cache-aside error for ${shortCode}:`, error);
      // Fallback: try DB directly
      try {
        const urlRecord = await urlModel.findByShortCode(shortCode);
        if (urlRecord) await urlModel.incrementClicks(shortCode);
        return urlRecord?.original_url || null;
      } catch (dbError) {
        console.error('DB fallback failed:', dbError);
        return null;
      }
    }
  }

  /**
   * Invalidate cache when URL is created/updated
   */
  async invalidateCache(shortCode) {
    const cacheKey = `url:${shortCode}`;
    await redisClient.del(cacheKey);
    console.log(`🗑️ Cache invalidated: ${shortCode}`);
  }

  /**
   * Helper: Validate URL format
   */
  isValidUrl(url) {
    return validator.isURL(url, { 
      require_protocol: true,
      protocols: ['http', 'https']
    });
  }
}

export default new UrlService();

// import axios from 'axios';
// import { UAParser } from 'ua-parser-js';
// import pool from '../config/database.js';
// import redisClient from '../config/redis.js';

// // Geo lookup with one retry to reduce "unknown"
// async function lookupGeo(ip) {
//   if (!ip || ip === 'unknown') {
//     return { city: 'unknown', country: 'unknown' };
//   }

//   const fetchOnce = async () => {
//     const res = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 1500 });
//     return {
//       city: res.data.city || 'unknown',
//       country: res.data.country_name || 'unknown',
//     };
//   };

//   try {
//     return await fetchOnce();
//   } catch (e1) {
//     try {
//       // second attempt in case of transient timeout
//       return await fetchOnce();
//     } catch (e2) {
//       return { city: 'unknown', country: 'unknown' };
//     }
//   }
// }

// // Longer window + include userAgent in key so same device is de‑duped,
// // different devices behind same IP still count separately.
// const CLICK_DEDUP_TTL_SECONDS = 15;

// const analyticsMiddleware = async (req, res, next) => {
//   const { shortCode } = req.params;

//   const ip =
//     req.ip ||
//     (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
//     'unknown';

//   const userAgent = req.get('User-Agent') || 'unknown';
//   const referer = req.get('Referer') || null;

//   const parser = new UAParser(userAgent);
//   const device = parser.getDevice();
//   const os = parser.getOS();

//   const osName = os.name || 'unknown';
//   const deviceModel = device.model || 'unknown';
//   const deviceVendor = device.vendor || 'unknown';
//   const deviceType = `${device.type || 'desktop'} ${osName}`.trim();

//   // Log click asynchronously (do not block redirect)
//   (async () => {
//     try {
//       // De‑dup: same IP + UA + shortCode within window → one click
//       const dedupKey = `click:${shortCode}:${ip}:${userAgent}`;

//       if (redisClient) {
//         try {
//           const exists = await redisClient.get(dedupKey);
//           if (exists) {
//             return; // duplicate technical hit, ignore
//           }
//           await redisClient.setEx(dedupKey, CLICK_DEDUP_TTL_SECONDS, '1');
//         } catch (e) {
//           console.error('Redis de‑dup error, continuing without de‑dup:', e.message);
//         }
//       }

//       const { city, country } =
//         ip === 'unknown'
//           ? { city: 'unknown', country: 'unknown' }
//           : await lookupGeo(ip);

//       // Store raw IP + separate country + OS + model/vendor
//       await pool.query(
//         `INSERT INTO clicks (
//            short_code,
//            ip_address,
//            user_agent,
//            referer,
//            device_type,
//            os_name,
//            device_model,
//            device_vendor,
//            country,
//            clicked_at
//          )
//          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
//         [
//           shortCode,
//           ip,
//           userAgent,
//           referer,
//           deviceType,
//           osName,
//           deviceModel,
//           deviceVendor,
//           country,
//         ]
//       );

//       await pool.query(
//         `UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1`,
//         [shortCode]
//       );

//       console.log(`✅ Analytics logged for: ${shortCode}`);
//     } catch (err) {
//       console.error('Analytics log failed:', err.message);
//     }
//   })();

//   next();
// };

// export default analyticsMiddleware;











import axios from 'axios';
import { UAParser } from 'ua-parser-js';
import pool from '../config/database.js';
import redisClient from '../config/redis.js';

// Geo lookup with one retry to reduce "unknown"
async function lookupGeo(ip) {
  if (!ip || ip === 'unknown') {
    return { city: 'unknown', country: 'unknown' };
  }

  const fetchOnce = async () => {
    const res = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 1500 });
    return {
      city: res.data.city || 'unknown',
      country: res.data.country_name || 'unknown',
    };
  };

  try {
    return await fetchOnce();
  } catch (e1) {
    try {
      // second attempt in case of transient timeout
      return await fetchOnce();
    } catch (e2) {
      return { city: 'unknown', country: 'unknown' };
    }
  }
}

// Longer window + include userAgent in key so same device is de‑duped,
// different devices behind same IP still count separately.
const CLICK_DEDUP_TTL_SECONDS = 15;

const analyticsMiddleware = async (req, res, next) => {
  const { shortCode } = req.params;

  const ip =
    req.ip ||
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown';

  const userAgent = req.get('User-Agent') || 'unknown';
  const referer = req.get('Referer') || null;

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  const osName = os.name || 'unknown';
  const deviceModel = device.model || 'unknown';
  const deviceVendor = device.vendor || 'unknown';
  const deviceType = `${device.type || 'desktop'} ${osName}`.trim();
  const browserName = browser.name || 'unknown';

  // Log click asynchronously (do not block redirect)
  (async () => {
    try {
      // De‑dup: same IP + UA + shortCode within window → one click
      const dedupKey = `click:${shortCode}:${ip}:${userAgent}`;

      if (redisClient) {
        try {
          const exists = await redisClient.get(dedupKey);
          if (exists) {
            return; // duplicate technical hit, ignore
          }
          await redisClient.setEx(dedupKey, CLICK_DEDUP_TTL_SECONDS, '1');
        } catch (e) {
          console.error('Redis de‑dup error, continuing without de‑dup:', e.message);
        }
      }

      const { city, country } =
        ip === 'unknown'
          ? { city: 'unknown', country: 'unknown' }
          : await lookupGeo(ip);

      // Store raw IP + UA + device + browser
      await pool.query(
        `INSERT INTO clicks (
           short_code,
           ip_address,
           user_agent,
           referer,
           device_type,
           os_name,
           device_model,
           device_vendor,
           country,
           browser,
           clicked_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
        [
          shortCode,
          ip,
          userAgent,
          referer,
          deviceType,
          osName,
          deviceModel,
          deviceVendor,
          country,
          browserName,
        ]
      );

      await pool.query(
        `UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1`,
        [shortCode]
      );

      console.log(`✅ Analytics logged for: ${shortCode}`);
    } catch (err) {
      console.error('Analytics log failed:', err.message);
    }
  })();

  next();
};

export default analyticsMiddleware;

// import axios from 'axios';
// import { UAParser } from 'ua-parser-js';
// import pool from '../config/database.js';

// async function lookupGeo(ip) {
//   try {
//     const res = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 1500 });
//     return {
//       city: res.data.city || 'unknown',
//       country: res.data.country_name || 'unknown',
//     };
//   } catch (e) {
//     return { city: 'unknown', country: 'unknown' };
//   }
// }

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
//   const deviceType = `${device.type || 'desktop'} ${os.name || 'unknown'}`;

//   // Log click asynchronously (don't wait for it)
//   (async () => {
//     try {
//       const { city, country } =
//         ip === 'unknown'
//           ? { city: 'unknown', country: 'unknown' }
//           : await lookupGeo(ip);

//       // Insert click record
//       await pool.query(
//         `INSERT INTO clicks (short_code, ip_address, user_agent, referer, device_type, clicked_at)
//          VALUES ($1, $2, $3, $4, $5, NOW())`,
//         [shortCode, `${ip} (${city}, ${country})`, userAgent, referer, deviceType]
//       );

//       // Increment click counter in urls table
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


async function lookupGeo(ip) {
  try {
    const res = await axios.get(`https://ipapi.co/${ip}/json/`, { timeout: 1500 });
    return {
      city: res.data.city || 'unknown',
      country: res.data.country_name || 'unknown',
    };
  } catch (e) {
    return { city: 'unknown', country: 'unknown' };
  }
}

const CLICK_DEDUP_TTL_SECONDS = 5;

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
  const deviceType = `${device.type || 'desktop'} ${os.name || 'unknown'}`;

  // Log click asynchronously (don't wait for it)
  (async () => {
    try {
      // 🔹 De‑dup: same IP + shortCode within 5s → count once
      const dedupKey = `click:${shortCode}:${ip}`;

      if (redisClient) {
        try {
          const already = await redisClient.get(dedupKey);
          if (already) {
            // Optional debug:
            // console.log(`⏩ Skipping duplicate click for ${shortCode} from ${ip}`);
            return;
          }
          await redisClient.setEx(dedupKey, CLICK_DEDUP_TTL_SECONDS, '1');
        } catch (e) {
          console.error('Redis de-dup failed, falling back to normal logging:', e.message);
          // continue without de-dup if Redis has an issue
        }
      }

      const { city, country } =
        ip === 'unknown'
          ? { city: 'unknown', country: 'unknown' }
          : await lookupGeo(ip);

      // Insert click record
      await pool.query(
        `INSERT INTO clicks (short_code, ip_address, user_agent, referer, device_type, clicked_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [shortCode, `${ip} (${city}, ${country})`, userAgent, referer, deviceType]
      );

      // Increment click counter in urls table
      const updateResult = await pool.query(
        `UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1`,
        [shortCode]
      );

      // Optional debug:
      // console.log(`✅ Analytics logged for: ${shortCode}, rows updated: ${updateResult.rowCount}`);
      console.log(`✅ Analytics logged for: ${shortCode}`);
    } catch (err) {
      console.error('Analytics log failed:', err.message);
    }
  })();

  next();
};

export default analyticsMiddleware;

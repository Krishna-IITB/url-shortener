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























// import axios from 'axios';
// import { UAParser } from 'ua-parser-js';
// import pool from '../config/database.js';
// import redisClient from '../config/redis.js'; // <- make sure filename matches

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

// // how long 2 hits from same IP+shortCode should be treated as one click
// const CLICK_DEDUP_TTL_SECONDS = 5;

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
//   // const deviceType = `${device.type || 'desktop'} ${os.name || 'unknown'}`;
//   const deviceType = `${device.type || 'desktop'} ${os.name || 'unknown'}`.trim();

//   // Log click asynchronously (don't block redirect)
//   (async () => {
//     try {
//       // 🔹 De‑dup: same IP + shortCode within few seconds → count only once
//       const dedupKey = `click:${shortCode}:${ip}`;

//       if (redisClient) {
//         try {
//           const exists = await redisClient.get(dedupKey);
//           if (exists) {
//             // Duplicate technical hit for same human click; ignore it
//             // console.log(`⏩ Skipping duplicate click for ${shortCode} from ${ip}`);
//             return;
//           }
//           await redisClient.setEx(dedupKey, CLICK_DEDUP_TTL_SECONDS, '1');
//         } catch (e) {
//           console.error('Redis de‑dup error, continuing without de‑dup:', e.message);
//           // If Redis is temporarily down, still log the click instead of breaking analytics
//         }
//       }

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









// import axios from 'axios';
// import { UAParser } from 'ua-parser-js';
// import pool from '../config/database.js';
// import redisClient from '../config/redis.js';

// // Geo lookup
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

// // How long 2 hits from same IP + shortCode are treated as one click
// const CLICK_DEDUP_TTL_SECONDS = 5;

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
//   const deviceType = `${device.type || 'desktop'} ${os.name || 'unknown'}`.trim();

//   // Log click asynchronously (do not block redirect)
//   (async () => {
//     try {
//       // De‑dup: same IP + shortCode within few seconds → count only once
//       const dedupKey = `click:${shortCode}:${ip}`;

//       if (redisClient) {
//         try {
//           const exists = await redisClient.get(dedupKey);
//           if (exists) {
//             return; // duplicate HTTP hit, ignore
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

//       // IMPORTANT: store raw IP + separate country
//       await pool.query(
//         `INSERT INTO clicks (
//            short_code,
//            ip_address,
//            user_agent,
//            referer,
//            device_type,
//            country,
//            clicked_at
//          )
//          VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
//         [shortCode, ip, userAgent, referer, deviceType, country]
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

// How long 2 hits from same IP + shortCode are treated as one click
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
  const deviceType = `${device.type || 'desktop'} ${os.name || 'unknown'}`.trim();

  // Log click asynchronously (do not block redirect)
  (async () => {
    try {
      // De‑dup: same IP + shortCode within few seconds → count only once
      const dedupKey = `click:${shortCode}:${ip}`;

      if (redisClient) {
        try {
          const exists = await redisClient.get(dedupKey);
          if (exists) {
            return; // duplicate HTTP hit, ignore
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

      // Store raw IP + separate country (for accurate unique IPs / countries)
      await pool.query(
        `INSERT INTO clicks (
           short_code,
           ip_address,
           user_agent,
           referer,
           device_type,
           country,
           clicked_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [shortCode, ip, userAgent, referer, deviceType, country]
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

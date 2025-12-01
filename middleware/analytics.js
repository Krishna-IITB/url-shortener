const axios = require('axios');
const UAParser = require('ua-parser-js');
const pool = require('../db'); // adjust if your db file path is different

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

const logClick = (req, res, next) => {
  const { shortCode } = req.params;

  const ip =
    req.ip ||
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown';

  const userAgent = req.get('User-Agent') || 'unknown';
  const referrer = req.get('Referer') || null;

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const os = parser.getOS();
  const deviceType = `${device.type || 'desktop'} ${os.name || 'unknown'}`;

  (async () => {
    try {
      const { city, country } =
        ip === 'unknown'
          ? { city: 'unknown', country: 'unknown' }
          : await lookupGeo(ip);

      await pool.query(
        `INSERT INTO clicks (short_code, ip_address, user_agent, referrer, device_type, clicked_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [shortCode, `${ip} (${city}, ${country})`, userAgent, referrer, deviceType]
      );
    } catch (err) {
      console.error('Analytics logging error:', err.message);
    }
  })();

  next();
};

module.exports = logClick;

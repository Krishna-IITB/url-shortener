import https from 'https';

const IPAPI_HOST = 'ipapi.co';

// Lookup country from IP, return null on failure
export async function lookupCountry(ip) {
  return new Promise(resolve => {
    // Ignore localhost / loopback
    if (!ip || ip === '::1' || ip.startsWith('127.')) {
      return resolve(null);
    }

    const options = {
      host: IPAPI_HOST,
      port: 443,
      path: `/${ip}/json/`,
      headers: { 'User-Agent': 'url-shortener/1.0' }
    };

    https
      .get(options, resp => {
        let body = '';
        resp.on('data', chunk => (body += chunk));
        resp.on('end', () => {
          try {
            const data = JSON.parse(body);
            resolve(data.country || null);
          } catch {
            resolve(null);
          }
        });
      })
      .on('error', () => resolve(null));
  });
}

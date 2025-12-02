





// // src/controllers/urlController.js
// import urlService from '../services/urlService.js';
// import { generateQrDataUrl } from '../utils/qr.js';

// class UrlController {
//   async shortenUrl(req, res) {
//     try {
//       const { url, customCode, ttlHours } = req.body;

//       if (!url) {
//         return res.status(400).json({
//           success: false,
//           error: 'URL is required',
//         });
//       }

//       const result = await urlService.createShortUrl({
//         url,
//         customCode,
//         ttlHours,
//       });

//       const baseUrl =
//         process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
//       const shortUrl = `${baseUrl}/${result.short_code}`;

//       res.status(201).json({
//         success: true,
//         data: {
//           short_code: result.short_code,
//           short_url: shortUrl,
//           original_url: result.original_url,
//           expires_at: result.expires_at,
//           created_at: result.created_at,
//         },
//       });
//     } catch (error) {
//       console.error('Shorten URL error:', error);

//       if (error.message.includes('Invalid URL')) {
//         return res.status(400).json({
//           success: false,
//           error: error.message,
//         });
//       }

//       if (
//         error.message.includes('already taken') ||
//         error.message.includes('reserved word')
//       ) {
//         return res.status(409).json({
//           success: false,
//           error: error.message,
//         });
//       }

//       res.status(500).json({
//         success: false,
//         error: 'Failed to create short URL',
//       });
//     }
//   }

//   async redirectUrl(req, res) {
//     try {
//       const { shortCode } = req.params;

//       const meta = {
//         ip: req.ip,
//         userAgent: req.get('User-Agent'),
//         referrer: req.get('Referer') || null,
//       };

//       const originalUrl = await urlService.getOriginalUrl(shortCode, meta);

//       if (!originalUrl) {
//         return res.status(404).json({
//           success: false,
//           error: 'Short URL not found or expired',
//         });
//       }

//       res.redirect(301, originalUrl);
//     } catch (error) {
//       console.error('Redirect error:', error);
//       res.status(500).json({
//         success: false,
//         error: 'Internal server error',
//       });
//     }
//   }

//   async getStats(req, res) {
//     try {
//       const { shortCode } = req.params;

//       const stats = await urlService.getUrlStats(shortCode);

//       if (!stats) {
//         return res.status(404).json({
//           success: false,
//           error: 'Short URL not found',
//         });
//       }

//       res.status(200).json({
//         success: true,
//         data: stats,
//       });
//     } catch (error) {
//       console.error('Get stats error:', error);
//       res.status(404).json({
//         success: false,
//         error: error.message || 'URL not found',
//       });
//     }
//   }

//   // ⭐ NEW: Generate QR Code for a short URL
//   async getQr(req, res) {
//     try {
//       const { shortCode } = req.params;

//       // Optional: Check if shortCode exists
//       let exists = null;
//       if (urlService.getUrlStats) {
//         exists = await urlService.getUrlStats(shortCode);
//       }

//       if (!exists) {
//         return res.status(404).json({
//           success: false,
//           error: 'Short URL not found',
//         });
//       }

//       const baseUrl =
//         process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
//       const targetUrl = `${baseUrl}/${shortCode}`;

//       const dataUrl = await generateQrDataUrl(targetUrl);

//       return res.status(200).json({
//         success: true,
//         short_code: shortCode,
//         qr_data_url: dataUrl,
//       });
//     } catch (error) {
//       console.error('QR code error:', error);
//       res.status(500).json({
//         success: false,
//         error: 'Failed to generate QR code',
//       });
//     }
//   }
// }

// export default new UrlController();




// src/controllers/urlController.js
import urlService from '../services/urlService.js';
import { generateQrDataUrl } from '../utils/qr.js';
import urlModel from '../models/urlModel.js'; // <-- added for direct DB check

class UrlController {
  async shortenUrl(req, res) {
    try {
      const { url, customCode, ttlHours } = req.body;

      if (!url) {
        return res.status(400).json({
          success: false,
          error: 'URL is required',
        });
      }

      const result = await urlService.createShortUrl({
        url,
        customCode,
        ttlHours,
      });

      const baseUrl =
        process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      const shortUrl = `${baseUrl}/${result.short_code}`;

      res.status(201).json({
        success: true,
        data: {
          short_code: result.short_code,
          short_url: shortUrl,
          original_url: result.original_url,
          expires_at: result.expires_at,
          created_at: result.created_at,
        },
      });
    } catch (error) {
      console.error('Shorten URL error:', error);

      if (error.message.includes('Invalid URL')) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (
        error.message.includes('already taken') ||
        error.message.includes('reserved word')
      ) {
        return res.status(409).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create short URL',
      });
    }
  }

  async redirectUrl(req, res) {
    try {
      const { shortCode } = req.params;

      const meta = {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer') || null,
      };

      const originalUrl = await urlService.getOriginalUrl(shortCode, meta);

      if (!originalUrl) {
        return res.status(404).json({
          success: false,
          error: 'Short URL not found or expired',
        });
      }

      res.redirect(301, originalUrl);
    } catch (error) {
      console.error('Redirect error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async getStats(req, res) {
    try {
      const { shortCode } = req.params;

      const stats = await urlService.getUrlStats(shortCode);

      if (!stats) {
        return res.status(404).json({
          success: false,
          error: 'Short URL not found',
        });
      }

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(404).json({
        success: false,
        error: error.message || 'URL not found',
      });
    }
  }

  // ⭐ NEW: Generate QR Code for a short URL
  async getQr(req, res) {
    try {
      const { shortCode } = req.params;

      // ✅ Check if shortCode exists via service or directly via urlModel
      let urlRecord = null;
      if (urlService.getUrlStats) {
        urlRecord = await urlService.getUrlStats(shortCode);
      } else {
        urlRecord = await urlModel.findByShortCode(shortCode);
      }

      if (!urlRecord) {
        return res.status(404).json({
          success: false,
          error: 'Short URL not found',
        });
      }

      const baseUrl =
        process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      const targetUrl = `${baseUrl}/${shortCode}`;

      const dataUrl = await generateQrDataUrl(targetUrl);

      return res.status(200).json({
        success: true,
        short_code: shortCode,
        qr_data_url: dataUrl,
      });
    } catch (error) {
      console.error('QR code error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate QR code',
      });
    }
  }
}

export default new UrlController();

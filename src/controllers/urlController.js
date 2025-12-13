

// // src/controllers/urlController.js
// import urlService from '../services/urlService.js';
// import { generateQrDataUrl } from '../utils/qr.js';
// import urlModel from '../models/urlModel.js';
// import { sanitizeUrl, validateUrl } from '../utils/urlValidation.js'; // NEW: Security imports

// class UrlController {
//   async shortenUrl(req, res) {
//     try {
//       let { url, customCode, ttlHours } = req.body;

//       // NEW: Sanitize ALL inputs
//       if (url) url = sanitizeUrl(url);
//       if (customCode) customCode = sanitizeUrl(customCode);
      
//       validateUrl(url);

//       // NEW: Custom code length check
//       if (customCode) {
//         if (customCode.length < 3 || customCode.length > 10) {
//           return res.status(400).json({
//             success: false,
//             error: 'Custom code must be 3-10 characters'
//           });
//         }
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
//         referer: req.get('Referer') || null,
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
//       res.status(500).json({
//         success: false,
//         error: 'Internal server error',
//       });
//     }
//   }

//   // ⭐ NEW: Generate QR Code for a short URL
//   async getQr(req, res) {
//     try {
//       const { shortCode } = req.params;

//       const urlRecord = await urlModel.findByShortCode(shortCode);
//       if (!urlRecord) {
//         return res.status(404).json({
//           success: false,
//           error: 'Short URL not found',
//         });
//       }

//       const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
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










import urlService from '../services/urlService.js';
import { generateQrDataUrl } from '../utils/qr.js';
import urlModel from '../models/urlModel.js';
import { 
  sanitizeInput, 
  validateUrl, 
  validateCustomCode 
} from '../utils/urlValidation.js';

class UrlController {
  async shortenUrl(req, res) {
    try {
      let { url, customCode, ttlHours } = req.body;

      // 1. Check if URL is provided
      if (!url) {
        return res.status(400).json({
          success: false,
          error: 'URL is required'
        });
      }

      // 2. Sanitize inputs (prevents SQL injection)
      url = sanitizeInput(url);
      if (customCode) {
        customCode = sanitizeInput(customCode);
      }

      // 3. Validate URL format & dangerous protocols
      try {
        validateUrl(url);
      } catch (validationError) {
        return res.status(400).json({
          success: false,
          error: validationError.message
        });
      }

      // 4. Validate custom code (length, format, reserved words)
      if (customCode) {
        try {
          validateCustomCode(customCode);
        } catch (codeError) {
          return res.status(400).json({
            success: false,
            error: codeError.message
          });
        }
      }

      // 5. Validate TTL if provided
      if (ttlHours !== undefined) {
        const ttl = parseFloat(ttlHours);
        if (isNaN(ttl) || ttl < 0) {
          return res.status(400).json({
            success: false,
            error: 'Invalid TTL value'
          });
        }
      }

      // 6. Check for duplicate URL (optional optimization)
      const existingUrl = await urlModel.findByOriginalUrl(url);
      if (existingUrl && !existingUrl.is_expired) {
        const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
        const shortUrl = `${baseUrl}/${existingUrl.short_code}`;

        return res.status(200).json({
          success: true,
          data: {
            short_code: existingUrl.short_code,
            short_url: shortUrl,
            original_url: existingUrl.original_url,
            expires_at: existingUrl.expires_at,
            created_at: existingUrl.created_at,
          },
          message: 'URL already exists'
        });
      }

      // 7. Create new short URL
      const result = await urlService.createShortUrl({
        url,
        customCode,
        ttlHours,
      });

      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
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
      if (process.env.NODE_ENV !== "test") console.error('Shorten URL error:', error);

      // Handle specific error types
      if (error.message.includes('SQL injection')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input detected'
        });
      }

      if (error.message.includes('already taken')) {
        return res.status(409).json({
          success: false,
          error: 'Custom code already taken'
        });
      }

      if (error.message.includes('reserved')) {
        return res.status(409).json({
          success: false,
          error: 'This code is reserved and cannot be used'
        });
      }

      if (error.message.includes('Dangerous protocol')) {
        return res.status(400).json({
          success: false,
          error: 'Dangerous URL protocol blocked'
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

      // Sanitize shortCode to prevent injection
      const sanitizedCode = sanitizeInput(shortCode);

      if (!sanitizedCode || sanitizedCode.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid short code'
        });
      }

      const meta = {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer') || null,
      };

      const originalUrl = await urlService.getOriginalUrl(sanitizedCode, meta);

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
      
      // Sanitize input
      const sanitizedCode = sanitizeInput(shortCode);

      if (!sanitizedCode) {
        return res.status(400).json({
          success: false,
          error: 'Invalid short code'
        });
      }

      const stats = await urlService.getUrlStats(sanitizedCode);

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
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  async getQr(req, res) {
    try {
      const { shortCode } = req.params;

      // Sanitize input
      const sanitizedCode = sanitizeInput(shortCode);

      if (!sanitizedCode) {
        return res.status(400).json({
          success: false,
          error: 'Invalid short code'
        });
      }

      const urlRecord = await urlModel.findByShortCode(sanitizedCode);
      if (!urlRecord) {
        return res.status(404).json({
          success: false,
          error: 'Short URL not found',
        });
      }

      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      const targetUrl = `${baseUrl}/${sanitizedCode}`;

      const dataUrl = await generateQrDataUrl(targetUrl);

      return res.status(200).json({
        success: true,
        short_code: sanitizedCode,
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

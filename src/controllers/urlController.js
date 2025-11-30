// import urlService from '../services/urlService.js';

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

//       const result = await urlService.createShortUrl(url, customCode, ttlHours);

//       res.status(201).json({
//         success: true,
//         data: result,
//       });
//     } catch (error) {
//       console.error('Shorten URL error:', error);
//       res.status(400).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   }

//   async redirectUrl(req, res) {
//     try {
//       const { shortCode } = req.params;

//       const originalUrl = await urlService.getOriginalUrl(shortCode);

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

//       res.status(200).json({
//         success: true,
//         data: stats,
//       });
//     } catch (error) {
//       console.error('Get stats error:', error);
//       res.status(404).json({
//         success: false,
//         error: error.message,
//       });
//     }
//   }
// }

// export default new UrlController();




// src/controllers/urlController.js
import urlService from '../services/urlService.js';

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

      // ✅ FIX: Pass as object, not separate arguments
      const result = await urlService.createShortUrl({ 
        url, 
        customCode, 
        ttlHours 
      });

      // Build full short URL for response
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      const shortUrl = `${baseUrl}/${result.short_code}`;

      res.status(201).json({
        success: true,
        data: {
          short_code: result.short_code,
          short_url: shortUrl,
          original_url: result.original_url,
          expires_at: result.expires_at,
          created_at: result.created_at
        }
      });
    } catch (error) {
      console.error('Shorten URL error:', error);

      // Handle specific error types
      if (error.message.includes('Invalid URL')) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message.includes('already taken') || error.message.includes('reserved word')) {
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

      const originalUrl = await urlService.getOriginalUrl(shortCode);

      if (!originalUrl) {
        return res.status(404).json({
          success: false,
          error: 'Short URL not found or expired',
        });
      }

      // 301 = permanent redirect (cached by browsers)
      // Use 302 if you want to track every click without caching
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
}

export default new UrlController();

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

      const result = await urlService.createShortUrl(url, customCode, ttlHours);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Shorten URL error:', error);
      res.status(400).json({
        success: false,
        error: error.message,
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

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export default new UrlController();

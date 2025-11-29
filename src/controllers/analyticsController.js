import analyticsService from '../services/analyticsService.js';

class AnalyticsController {
  async getDashboard(req, res) {
    try {
      const [topUrls, totalStats, trends] = await Promise.all([
        analyticsService.getTopUrls(10),
        analyticsService.getTotalStats(),
        analyticsService.getUrlTrends(24)
      ]);

      res.render('dashboard', { 
        topUrls, 
        totalStats, 
        trends,
        baseUrl: process.env.BASE_URL 
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).send('Internal server error');
    }
  }

  async getApiStats(req, res) {
    try {
      const { limit = 10, days = 30 } = req.query;
      
      const stats = await analyticsService.getTopUrls(parseInt(limit), parseInt(days));
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new AnalyticsController();

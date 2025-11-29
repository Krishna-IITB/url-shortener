import urlModel from '../models/urlModel.js';
import redisClient from '../config/redis.js';

class AnalyticsService {
  async getTopUrls(limit = 10, days = 30) {
    const query = `
      SELECT 
        short_code,
        original_url,
        clicks,
        created_at,
        CASE 
          WHEN expires_at IS NULL OR expires_at > NOW() THEN 'active'
          ELSE 'expired'
        END as status
      FROM urls 
      WHERE created_at > NOW() - INTERVAL '${days} days'
      ORDER BY clicks DESC, created_at DESC
      LIMIT $1
    `;
    
    const result = await urlModel.pool.query(query, [limit]);
    return result.rows;
  }

  async getTotalStats() {
    const [totalUrls, totalClicks] = await Promise.all([
      urlModel.pool.query('SELECT COUNT(*)::int FROM urls'),
      urlModel.pool.query('SELECT COALESCE(SUM(clicks), 0)::int FROM urls')
    ]);
    
    return {
      totalUrls: parseInt(totalUrls.rows[0].count),
      totalClicks: parseInt(totalClicks.rows[0].sum),
      uptime: process.uptime(),
      activeConnections: urlModel.pool.totalCount
    };
  }

  async getUrlTrends(hours = 24) {
    const query = `
      SELECT 
        date_trunc('hour', created_at) as hour,
        COUNT(*) as new_urls,
        COALESCE(SUM(clicks), 0) as total_clicks
      FROM urls 
      WHERE created_at > NOW() - INTERVAL '${hours} hours'
      GROUP BY hour
      ORDER BY hour
    `;
    
    const result = await urlModel.pool.query(query);
    return result.rows;
  }
}

export default new AnalyticsService();

// import express from 'express';
// import urlController from '../controllers/urlController.js';
// import analyticsMiddleware from '../middleware/analytics.js';

// const router = express.Router();

// // Create short URL
// router.post('/api/shorten', urlController.shortenUrl.bind(urlController));

// // Get analytics / stats
// router.get('/api/stats/:shortCode', urlController.getStats.bind(urlController));

// // Redirect to original URL
// router.get('/:shortCode', analyticsMiddleware, urlController.redirectUrl.bind(urlController));

// // ✅ QR code endpoint
// router.get('/api/qr/:shortCode', urlController.getQr.bind(urlController));

// export default router;






import express from 'express';
import urlController from '../controllers/urlController.js';
import analyticsMiddleware from '../middleware/analytics.js';
import pool from '../config/database.js'; // ⬅️ add this

const router = express.Router();

// Create short URL
router.post('/api/shorten', urlController.shortenUrl.bind(urlController));

// Get analytics / stats
router.get('/api/stats/:shortCode', urlController.getStats.bind(urlController));

// NEW: browser breakdown endpoint
router.get('/api/stats/:shortCode/browsers', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT
         COALESCE(browser, 'Unknown') AS browser,
         COUNT(*)::int AS count
       FROM clicks
       WHERE short_code = $1
       GROUP BY browser
       ORDER BY count DESC`,
      [shortCode]
    );

    res.json({ data: rows });
  } catch (err) {
    console.error('Browser stats error', err.message);
    res.status(500).json({ error: 'Failed to load browser stats' });
  }
});

// Redirect to original URL
router.get('/:shortCode', analyticsMiddleware, urlController.redirectUrl.bind(urlController));

// ✅ QR code endpoint
router.get('/api/qr/:shortCode', urlController.getQr.bind(urlController));

export default router;


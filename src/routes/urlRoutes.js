import express from 'express';
import urlController from '../controllers/urlController.js';
import analyticsMiddleware from '../middleware/analytics.js';

const router = express.Router();

// Create short URL
router.post('/api/shorten', urlController.shortenUrl.bind(urlController));

// Get analytics / stats
router.get('/api/stats/:shortCode', urlController.getStats.bind(urlController));

// Redirect to original URL
router.get('/:shortCode', analyticsMiddleware, urlController.redirectUrl.bind(urlController));

// ✅ QR code endpoint
router.get('/api/qr/:shortCode', urlController.getQr.bind(urlController));

export default router;

import express from 'express';
import urlController from '../controllers/urlController.js';

const router = express.Router();

router.post('/api/shorten', urlController.shortenUrl.bind(urlController));
router.get('/api/stats/:shortCode', urlController.getStats.bind(urlController));
router.get('/:shortCode', urlController.redirectUrl.bind(urlController));

export default router;

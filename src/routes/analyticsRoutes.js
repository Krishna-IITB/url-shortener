import express from 'express';
import analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

// Rate limited API stats
router.get('/api/stats/top', analyticsController.getApiStats);

// Public dashboard page
router.get('/dashboard', analyticsController.getDashboard);

export default router;

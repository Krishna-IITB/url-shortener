// src/cron/cleanupExpired.js
import cron from 'node-cron';
import urlModel from '../models/urlModel.js';

// Run every day at 02:00 server time
export function scheduleExpiredUrlCleanup() {
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('[CRON] Running expired URL cleanup...');
      const deleted = await urlModel.deleteExpired();
      console.log(`[CRON] Deleted ${deleted.length || deleted} expired URLs`);
    } catch (err) {
      console.error('[CRON] Expired URL cleanup failed:', err.message);
    }
  });
}

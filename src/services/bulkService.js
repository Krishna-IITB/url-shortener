import urlService from './urlService.js';

class BulkService {
  async shortenMultiple(urls, batchSize = 5) {
    const results = [];
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchPromises = batch.map(async (urlData, index) => {
        try {
          return await urlService.createShortUrl(
            urlData.url, 
            urlData.customCode, 
            urlData.ttlHours
          );
        } catch (error) {
          return {
            success: false,
            error: error.message,
            input: urlData
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches to be respectful
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return {
      success: true,
      total: urls.length,
      processed: results.length,
      results
    };
  }
}

export default new BulkService();

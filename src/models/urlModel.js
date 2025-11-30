// import pool from '../config/database.js';

// class UrlModel {
//   async create({ originalUrl, shortCode, expiresAt = null }) {
//     const query = `
//       INSERT INTO urls (original_url, short_code, expires_at)
//       VALUES ($1, $2, $3)
//       RETURNING id, original_url, short_code, clicks, created_at, expires_at
//     `;
    
//     try {
//       const result = await pool.query(query, [originalUrl, shortCode, expiresAt]);
//       return result.rows[0];
//     } catch (error) {
//       if (error.code === '23505') {
//         throw new Error('Short code already exists');
//       }
//       throw error;
//     }
//   }

//   async findByShortCode(shortCode) {
//     const query = `
//       SELECT id, original_url, short_code, clicks, created_at, expires_at
//       FROM urls
//       WHERE short_code = $1
//     `;
    
//     const result = await pool.query(query, [shortCode]);
//     return result.rows[0] || null;
//   }

//   async findByOriginalUrl(originalUrl) {
//     const query = `
//       SELECT id, original_url, short_code, clicks, created_at, expires_at
//       FROM urls
//       WHERE original_url = $1
//       ORDER BY created_at DESC
//       LIMIT 1
//     `;
    
//     const result = await pool.query(query, [originalUrl]);
//     return result.rows[0] || null;
//   }

//   async findById(id) {
//     const query = `
//       SELECT id, original_url, short_code, clicks, created_at, expires_at
//       FROM urls
//       WHERE id = $1
//     `;
    
//     const result = await pool.query(query, [id]);
//     return result.rows[0] || null;
//   }

//   async updateShortCode(id, shortCode) {
//     const query = `
//       UPDATE urls
//       SET short_code = $1
//       WHERE id = $2
//       RETURNING id, original_url, short_code, clicks, created_at, expires_at
//     `;
    
//     const result = await pool.query(query, [shortCode, id]);
//     return result.rows[0] || null;
//   }

//   async incrementClicks(shortCode) {
//     const query = `
//       UPDATE urls
//       SET clicks = clicks + 1
//       WHERE short_code = $1
//       RETURNING clicks
//     `;
    
//     const result = await pool.query(query, [shortCode]);
//     return result.rows[0]?.clicks || 0;
//   }

//   async getStats(shortCode) {
//     const query = `
//       SELECT 
//         original_url,
//         short_code,
//         clicks,
//         created_at,
//         expires_at,
//         CASE 
//           WHEN expires_at IS NULL THEN false
//           WHEN expires_at < NOW() THEN true
//           ELSE false
//         END as is_expired
//       FROM urls
//       WHERE short_code = $1
//     `;
    
//     const result = await pool.query(query, [shortCode]);
//     return result.rows[0] || null;
//   }
// }

// export default new UrlModel();



// // src/models/urlModel.js
// import pool from '../config/database.js';

// class UrlModel {
//   /**
//    * Create new URL record
//    * Changed to snake_case to match service layer and database columns
//    */
//   async create({ original_url, short_code = null, expires_at = null }) {
//     const query = `
//       INSERT INTO urls (original_url, short_code, expires_at)
//       VALUES ($1, $2, $3)
//       RETURNING id, original_url, short_code, click_count as clicks, created_at, expires_at
//     `;
    
//     try {
//       const result = await pool.query(query, [original_url, short_code, expires_at]);
//       return result.rows[0];
//     } catch (error) {
//       if (error.code === '23505') {
//         throw new Error('Short code already exists');
//       }
//       console.error('Database create error:', error);
//       throw error;
//     }
//   }

//   async findByShortCode(shortCode) {
//     const query = `
//       SELECT id, original_url, short_code, click_count as clicks, created_at, expires_at
//       FROM urls
//       WHERE short_code = $1
//     `;
    
//     const result = await pool.query(query, [shortCode]);
//     return result.rows[0] || null;
//   }

//   async findByOriginalUrl(originalUrl) {
//     const query = `
//       SELECT id, original_url, short_code, click_count as clicks, created_at, expires_at
//       FROM urls
//       WHERE original_url = $1
//       AND (expires_at IS NULL OR expires_at > NOW())
//       ORDER BY created_at DESC
//       LIMIT 1
//     `;
    
//     const result = await pool.query(query, [originalUrl]);
//     return result.rows[0] || null;
//   }

//   async findById(id) {
//     const query = `
//       SELECT id, original_url, short_code, click_count as clicks, created_at, expires_at
//       FROM urls
//       WHERE id = $1
//     `;
    
//     const result = await pool.query(query, [id]);
//     return result.rows[0] || null;
//   }

//   async updateShortCode(id, shortCode) {
//     const query = `
//       UPDATE urls
//       SET short_code = $1
//       WHERE id = $2
//       RETURNING id, original_url, short_code, click_count as clicks, created_at, expires_at
//     `;
    
//     const result = await pool.query(query, [shortCode, id]);
//     return result.rows[0] || null;
//   }

//   async incrementClicks(shortCode) {
//     const query = `
//       UPDATE urls
//       SET click_count = click_count + 1
//       WHERE short_code = $1
//       RETURNING click_count as clicks
//     `;
    
//     const result = await pool.query(query, [shortCode]);
//     return result.rows[0]?.clicks || 0;
//   }

//   async getStats(shortCode) {
//     const query = `
//       SELECT 
//         original_url,
//         short_code,
//         click_count as clicks,
//         created_at,
//         expires_at,
//         CASE 
//           WHEN expires_at IS NULL THEN false
//           WHEN expires_at < NOW() THEN true
//           ELSE false
//         END as is_expired
//       FROM urls
//       WHERE short_code = $1
//     `;
    
//     const result = await pool.query(query, [shortCode]);
//     return result.rows[0] || null;
//   }

//   /**
//    * Delete expired URLs (for cleanup cron job)
//    */
//   async deleteExpired() {
//     const query = `
//       DELETE FROM urls 
//       WHERE expires_at IS NOT NULL 
//       AND expires_at < NOW()
//       RETURNING id, short_code
//     `;
    
//     const result = await pool.query(query);
//     return result.rows;
//   }
// }

// export default new UrlModel();


// src/models/urlModel.js
import pool from '../config/database.js';

class UrlModel {
  /**
   * Create new URL record
   * Uses snake_case to match service layer and database columns
   */
  async create({ original_url, short_code = null, expires_at = null }) {
    const query = `
      INSERT INTO urls (original_url, short_code, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, original_url, short_code, clicks, created_at, expires_at
    `;
    
    try {
      const result = await pool.query(query, [original_url, short_code, expires_at]);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Short code already exists');
      }
      console.error('Database create error:', error);
      throw error;
    }
  }

  async findByShortCode(shortCode) {
    const query = `
      SELECT id, original_url, short_code, clicks, created_at, expires_at
      FROM urls
      WHERE short_code = $1
    `;
    
    const result = await pool.query(query, [shortCode]);
    return result.rows[0] || null;
  }

  async findByOriginalUrl(originalUrl) {
    const query = `
      SELECT id, original_url, short_code, clicks, created_at, expires_at
      FROM urls
      WHERE original_url = $1
      AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const result = await pool.query(query, [originalUrl]);
    return result.rows[0] || null;
  }

  async findById(id) {
    const query = `
      SELECT id, original_url, short_code, clicks, created_at, expires_at
      FROM urls
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async updateShortCode(id, shortCode) {
    const query = `
      UPDATE urls
      SET short_code = $1
      WHERE id = $2
      RETURNING id, original_url, short_code, clicks, created_at, expires_at
    `;
    
    const result = await pool.query(query, [shortCode, id]);
    return result.rows[0] || null;
  }

  async incrementClicks(shortCode) {
    const query = `
      UPDATE urls
      SET clicks = clicks + 1
      WHERE short_code = $1
      RETURNING clicks
    `;
    
    const result = await pool.query(query, [shortCode]);
    return result.rows[0]?.clicks || 0;
  }

  async getStats(shortCode) {
    const query = `
      SELECT 
        original_url,
        short_code,
        clicks,
        created_at,
        expires_at,
        CASE 
          WHEN expires_at IS NULL THEN false
          WHEN expires_at < NOW() THEN true
          ELSE false
        END as is_expired
      FROM urls
      WHERE short_code = $1
    `;
    
    const result = await pool.query(query, [shortCode]);
    return result.rows[0] || null;
  }

  /**
   * Delete expired URLs (for cleanup cron job)
   */
  async deleteExpired() {
    const query = `
      DELETE FROM urls 
      WHERE expires_at IS NOT NULL 
      AND expires_at < NOW()
      RETURNING id, short_code
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

async getNextId() {
  const query = `SELECT nextval('urls_id_seq') as next_id`;
  const result = await pool.query(query);
  return parseInt(result.rows[0].next_id);
}


}

export default new UrlModel();

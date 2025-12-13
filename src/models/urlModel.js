

// // src/models/urlModel.js
// import pool from '../config/database.js';

// class UrlModel {
//   /**
//    * Create new URL record
//    * Uses snake_case to match service layer and database columns
//    */
//   async create({ original_url, short_code = null, expires_at = null }) {
//     const query = `
//       INSERT INTO urls (original_url, short_code, expires_at)
//       VALUES ($1, $2, $3)
//       RETURNING id, original_url, short_code, clicks, created_at, expires_at
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
//       AND (expires_at IS NULL OR expires_at > NOW())
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

// async getNextId() {
//   const query = `SELECT nextval('urls_id_seq') as next_id`;
//   const result = await pool.query(query);
//   return parseInt(result.rows[0].next_id);
// }

// async getClickStats(shortCode) {
//   const query = `
//     WITH base AS (
//       SELECT
//         u.short_code,
//         u.clicks AS total_clicks,
//         c.ip_address,
//         c.clicked_at,
//         c.country,
//         c.device_type
//       FROM urls u
//       LEFT JOIN clicks c ON u.short_code = c.short_code
//       WHERE u.short_code = $1
//         AND (c.clicked_at IS NULL OR c.clicked_at >= NOW() - INTERVAL '7 days')
//     ),
//     clicks_per_day AS (
//       SELECT
//         date_trunc('day', clicked_at)::date AS day,
//         COUNT(*) AS count
//       FROM base
//       WHERE clicked_at IS NOT NULL
//       GROUP BY day
//     ),
//     days AS (
//       SELECT generate_series(
//         (NOW()::date - INTERVAL '6 days')::date,
//         NOW()::date,
//         '1 day'
//       )::date AS day
//     )
//     SELECT
//       COALESCE(MAX(total_clicks), 0) AS total_clicks,
//       COALESCE(
//         (SELECT COUNT(DISTINCT ip_address) FROM base WHERE ip_address IS NOT NULL),
//         0
//       ) AS unique_ips,
//       -- clicks by date
//       COALESCE(
//         (
//           SELECT json_agg(
//             json_build_object(
//               'date', d.day,
//               'clicks', COALESCE(cpd.count, 0)
//             )
//             ORDER BY d.day
//           )
//           FROM days d
//           LEFT JOIN clicks_per_day cpd ON cpd.day = d.day
//         ),
//         '[]'::json
//       ) AS clicks_by_date,
//       -- top countries
//       COALESCE(
//         (
//           SELECT json_agg(
//             json_build_object('country', country, 'count', cnt)
//             ORDER BY cnt DESC
//           )
//           FROM (
//             SELECT country, COUNT(*) AS cnt
//             FROM base
//             WHERE country IS NOT NULL AND country <> ''
//             GROUP BY country
//             ORDER BY cnt DESC
//             LIMIT 5
//           ) x
//         ),
//         '[]'::json
//       ) AS top_countries,
//       -- device breakdown
//       COALESCE(
//         (
//           SELECT json_agg(
//             json_build_object('device_type', device_type, 'count', cnt)
//             ORDER BY cnt DESC
//           )
//           FROM (
//             SELECT device_type, COUNT(*) AS cnt
//             FROM base
//             WHERE device_type IS NOT NULL AND device_type <> ''
//             GROUP BY device_type
//           ) y
//         ),
//         '[]'::json
//       ) AS device_breakdown
//     FROM base;
//   `;
//   const result = await pool.query(query, [shortCode]);
//   return result.rows[0] || null;
// }

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

  async getClickStats(shortCode) {
    const query = `
      WITH base AS (
        SELECT
          u.short_code,
          u.clicks AS total_clicks,
          c.ip_address,
          c.clicked_at,
          c.country,
          c.device_type,
          c.referer
        FROM urls u
        LEFT JOIN clicks c ON u.short_code = c.short_code
        WHERE u.short_code = $1
          AND (c.clicked_at IS NULL OR c.clicked_at >= NOW() - INTERVAL '7 days')
      ),
      clicks_per_day AS (
        SELECT
          date_trunc('day', clicked_at)::date AS day,
          COUNT(*) AS count
        FROM base
        WHERE clicked_at IS NOT NULL
        GROUP BY day
      ),
      days AS (
        SELECT generate_series(
          (NOW()::date - INTERVAL '6 days')::date,
          NOW()::date,
          '1 day'
        )::date AS day
      )
      SELECT
        COALESCE(MAX(total_clicks), 0) AS total_clicks,
        COALESCE(
          (SELECT COUNT(DISTINCT ip_address) FROM base WHERE ip_address IS NOT NULL),
          0
        ) AS unique_ips,
        -- clicks by date
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'date', d.day,
                'clicks', COALESCE(cpd.count, 0)
              )
              ORDER BY d.day
            )
            FROM days d
            LEFT JOIN clicks_per_day cpd ON cpd.day = d.day
          ),
          '[]'::json
        ) AS clicks_by_date,
        -- top countries
        COALESCE(
          (
            SELECT json_agg(
              json_build_object('country', country, 'count', cnt)
              ORDER BY cnt DESC
            )
            FROM (
              SELECT country, COUNT(*) AS cnt
              FROM base
              WHERE country IS NOT NULL AND country <> ''
              GROUP BY country
              ORDER BY cnt DESC
              LIMIT 5
            ) x
          ),
          '[]'::json
        ) AS top_countries,
        -- device breakdown
        COALESCE(
          (
            SELECT json_agg(
              json_build_object('device_type', device_type, 'count', cnt)
              ORDER BY cnt DESC
            )
            FROM (
              SELECT device_type, COUNT(*) AS cnt
              FROM base
              WHERE device_type IS NOT NULL AND device_type <> ''
              GROUP BY device_type
            ) y
          ),
          '[]'::json
        ) AS device_breakdown,
        -- top referers
        COALESCE(
          (
            SELECT json_agg(
              json_build_object('referer', referer, 'count', cnt)
              ORDER BY cnt DESC
            )
            FROM (
              SELECT referer, COUNT(*) AS cnt
              FROM base
              WHERE referer IS NOT NULL AND referer <> ''
              GROUP BY referer
              ORDER BY cnt DESC
              LIMIT 5
            ) r
          ),
          '[]'::json
        ) AS top_referers
      FROM base;
    `;
    const result = await pool.query(query, [shortCode]);
    return result.rows[0] || null;
  }
}

export default new UrlModel();






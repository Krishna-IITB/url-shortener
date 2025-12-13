import pool from '../config/database.js';

class ClickModel {
  async logClick({
    short_code,
    ip_address,
    user_agent,
    referer,
    country,
    device_type,
    browser
  }) {
    const query = `
      INSERT INTO clicks (
        short_code, ip_address, user_agent, referer,
        country, device_type, browser
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const values = [
      short_code,
      ip_address,
      user_agent,
      referer,
      country,
      device_type,
      browser
    ];
    const result = await pool.query(query, values);
    return result.rows[0].id;
  }
}

export default new ClickModel();

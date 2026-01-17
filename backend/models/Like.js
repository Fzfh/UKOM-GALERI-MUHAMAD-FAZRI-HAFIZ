const { pool } = require('../config/database');

class Like {
  // Check if IP already liked the photo
  static async exists(userIp, photoId) {
    const [rows] = await pool.execute(
      'SELECT * FROM likes WHERE user_ip = ? AND data_galery_id = ?',
      [userIp, photoId]
    );
    return rows.length > 0;
  }

  // Add like
  static async create(userIp, photoId) {
    const [result] = await pool.execute(
      'INSERT INTO likes (user_ip, data_galery_id, created_at) VALUES (?, ?, NOW())',
      [userIp, photoId]
    );
    return result.insertId;
  }

  // Remove like
  static async delete(userIp, photoId) {
    await pool.execute(
      'DELETE FROM likes WHERE user_ip = ? AND data_galery_id = ?',
      [userIp, photoId]
    );
    return true;
  }

  // Get like count for a photo
  static async countByPhotoId(photoId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as like_count FROM likes WHERE data_galery_id = ?',
      [photoId]
    );
    return rows[0].like_count;
  }
}

module.exports = Like;
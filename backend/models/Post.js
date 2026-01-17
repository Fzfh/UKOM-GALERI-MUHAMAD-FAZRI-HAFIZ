const { pool } = require('../config/database');

class Post {
  // Get all posts with category info
  static async findAll(limit = 10, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT p.*, k.judul as category_name 
       FROM posts p 
       LEFT JOIN kategori k ON p.kategori_id = k.id 
       WHERE p.status = 'active'
       ORDER BY p.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  // Get post by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, k.judul as category_name 
       FROM posts p 
       LEFT JOIN kategori k ON p.kategori_id = k.id 
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Create new post
  static async create(postData) {
    const { judul, kategori_id } = postData;
    const [result] = await pool.execute(
      `INSERT INTO posts (judul, kategori_id, status, created_at) 
       VALUES (?, ?, 'active', NOW())`,
      [judul, kategori_id]
    );
    return this.findById(result.insertId);
  }

  // Delete post (soft delete)
  static async delete(id) {
    await pool.execute(
      'UPDATE posts SET status = "inactive" WHERE id = ?',
      [id]
    );
    return true;
  }
}

module.exports = Post;
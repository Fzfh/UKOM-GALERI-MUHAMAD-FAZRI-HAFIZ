const { pool } = require('../config/database');

class Galery {
  // Get all galeries (albums) with their first image and count
  static async findAll(limit = 10, offset = 0, categoryId = null) {
    let query = `
      SELECT 
        g.*, 
        p.judul as post_title,
        k.judul as category_name,
        (SELECT dg.file FROM data_galery dg WHERE dg.galery_id = g.id ORDER BY dg.id LIMIT 1) as cover_image,
        (SELECT COUNT(*) FROM data_galery dg WHERE dg.galery_id = g.id) as photo_count
      FROM galery g
      LEFT JOIN posts p ON g.post_id = p.id
      LEFT JOIN kategori k ON p.kategori_id = k.id
      WHERE g.status = 'active'
    `;
    
    const params = [];
    
    if (categoryId) {
      query += ' AND p.kategori_id = ?';
      params.push(categoryId);
    }
    
    query += ' ORDER BY g.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Get single galery by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT g.*, p.judul as post_title, k.judul as category_name 
       FROM galery g 
       LEFT JOIN posts p ON g.post_id = p.id 
       LEFT JOIN kategori k ON p.kategori_id = k.id 
       WHERE g.id = ? AND g.status = 'active'`,
      [id]
    );
    return rows[0];
  }

  // Create new galery (album)
  static async create(galeryData) {
    const { title, description, cover_image, post_id } = galeryData;
    const [result] = await pool.execute(
      `INSERT INTO galery (title, description, cover_image, post_id, status, created_at) 
       VALUES (?, ?, ?, ?, 'active', NOW())`,
      [title, description, cover_image, post_id]
    );
    return this.findById(result.insertId);
  }

  // Delete galery
  static async delete(id) {
    await pool.execute(
      'UPDATE galery SET status = "inactive" WHERE id = ?',
      [id]
    );
    return true;
  }
}

module.exports = Galery;
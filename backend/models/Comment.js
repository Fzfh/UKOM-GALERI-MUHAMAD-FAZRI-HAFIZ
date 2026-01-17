const { pool } = require('../config/database');

class Comment {
  // Get comments by photo ID (data_galery_id)
  static async findByPhotoId(photoId) {
    const [rows] = await pool.execute(
      `SELECT c.* 
       FROM comments c 
       WHERE c.data_galery_id = ? 
       ORDER BY c.created_at DESC`,
      [photoId]
    );
    return rows;
  }

  // Create new comment
  static async create(commentData) {
    const { data_galery_id, user_name, comment_text } = commentData;
    const [result] = await pool.execute(
      `INSERT INTO comments (data_galery_id, user_name, comment_text, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [data_galery_id, user_name, comment_text]
    );
    
    const [newComment] = await pool.execute(
      'SELECT * FROM comments WHERE id = ?',
      [result.insertId]
    );
    
    return newComment[0];
  }

  // Delete comment
  static async delete(id) {
    await pool.execute(
      'DELETE FROM comments WHERE id = ?',
      [id]
    );
    return true;
  }
  static async update(id, updateData) {
    const { comment_text } = updateData;
    
    await pool.execute(
        'UPDATE comments SET comment_text = ? WHERE id = ?',
        [comment_text, id]
    );
    
    return true;
    }

    static async findById(id) {
    const [rows] = await pool.execute(
        'SELECT * FROM comments WHERE id = ?',
        [id]
    );
    return rows[0];
    }

  // Get all comments (for admin)
  static async findAll(limit = 50, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT c.*, dg.judul as photo_title, g.title as galery_title
       FROM comments c
       LEFT JOIN data_galery dg ON c.data_galery_id = dg.id
       LEFT JOIN galery g ON dg.galery_id = g.id
       ORDER BY c.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }
}

module.exports = Comment;
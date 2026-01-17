const { pool } = require('../config/database');

class Category {
  // Get all categories
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM kategori ORDER BY judul'
    );
    return rows;
  }

  // Get category by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM kategori WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Create new category
  static async create(categoryData) {
    const { judul } = categoryData;
    const [result] = await pool.execute(
      'INSERT INTO kategori (judul, created_at) VALUES (?, NOW())',
      [judul]
    );
    return this.findById(result.insertId);
  }

  // Delete category
  static async delete(id) {
    await pool.execute(
      'DELETE FROM kategori WHERE id = ?',
      [id]
    );
    return true;
  }
  static async update(id, updateData) {
    const { judul, deskripsi } = updateData;
    const sets = [];
    const params = [];

    if (judul) {
        sets.push('judul = ?');
        params.push(judul);
    }
    
    if (deskripsi !== undefined) {
        sets.push('deskripsi = ?');
        params.push(deskripsi);
    }

    if (sets.length === 0) {
        throw new Error('No fields to update');
    }

    params.push(id);
    
    await pool.execute(
        `UPDATE kategori SET ${sets.join(', ')} WHERE id = ?`,
        params
    );
    
    return true;
    }
}

module.exports = Category;
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Find user by username - HAPUS WHERE status
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?', // HAPUS: AND status = "active"
      [username]
    );
    return rows[0];
  }

  // Find user by ID - HAPUS WHERE status  
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?', // HAPUS: AND status = "active"
      [id]
    );
    return rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create new user
  static async create(userData) {
    const { username, email, password, role = 'user' } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [username, email, hashedPassword, role]
    );
    
    return this.findById(result.insertId);
  }
}

module.exports = User;
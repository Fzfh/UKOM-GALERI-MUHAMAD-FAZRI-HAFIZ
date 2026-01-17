const { pool } = require('../config/database');

class Photo {
  // Get all photos from a galery
  static async findByGaleryId(galeryId, limit = 50, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT dg.*, 
              (SELECT COUNT(*) FROM likes l WHERE l.data_galery_id = dg.id) as like_count,
              (SELECT COUNT(*) FROM comments c WHERE c.data_galery_id = dg.id) as comment_count
       FROM data_galery dg 
       WHERE dg.galery_id = ? 
       ORDER BY dg.created_at DESC 
       LIMIT ? OFFSET ?`,
      [galeryId, limit, offset]
    );
    return rows;
  }

  // Get single photo by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT dg.*, g.title as galery_title, g.post_id, p.judul as post_title, k.judul as category_name
       FROM data_galery dg
       LEFT JOIN galery g ON dg.galery_id = g.id
       LEFT JOIN posts p ON g.post_id = p.id
       LEFT JOIN kategori k ON p.kategori_id = k.id
       WHERE dg.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Create new photo in galery - UPDATE INI: tambah deskripsi dan kategori_id
  static async create(photoData) {
    const { galery_id, file, judul, deskripsi, kategori_id } = photoData;
    
    // Jika galery_id tidak ada, gunakan kategori_id untuk membuat/mencari galery
    let actualGaleryId = galery_id;
    
    if (!galery_id && kategori_id) {
      // Cari atau buat galery berdasarkan kategori
      const [galeryRows] = await pool.execute(
        `SELECT id FROM galery WHERE post_id IN (SELECT id FROM posts WHERE kategori_id = ?) LIMIT 1`,
        [kategori_id]
      );
      
      if (galeryRows.length > 0) {
        actualGaleryId = galeryRows[0].id;
      } else {
        // Buat galery baru jika tidak ada
        const [newGalery] = await pool.execute(
          `INSERT INTO galery (title, post_id, created_at) 
           VALUES (?, (SELECT id FROM posts WHERE kategori_id = ? LIMIT 1), NOW())`,
          [`Gallery for category ${kategori_id}`, kategori_id]
        );
        actualGaleryId = newGalery.insertId;
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO data_galery (galery_id, file, judul, deskripsi, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [actualGaleryId, file, judul, deskripsi || '']
    );
    return this.findById(result.insertId);
  }

  // Alternative create method untuk upload langsung tanpa galery_id
  static async createDirect(photoData) {
    const { file, judul, deskripsi, kategori_id } = photoData;
    
    const [result] = await pool.execute(
      `INSERT INTO data_galery (file, judul, deskripsi, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [file, judul, deskripsi || '']
    );
    
    // Get the created photo with category info
    const [rows] = await pool.execute(
      `SELECT dg.*, k.judul as category_name 
       FROM data_galery dg
       LEFT JOIN kategori k ON k.id = ?
       WHERE dg.id = ?`,
      [kategori_id, result.insertId]
    );
    
    return rows[0];
  }

  // Delete photo
  static async delete(id) {
    await pool.execute(
      'DELETE FROM data_galery WHERE id = ?',
      [id]
    );
    return true;
  }

  // Get recent photos for homepage - UPDATE INI: include deskripsi
  static async findRecent(limit = 12) {
    const [rows] = await pool.execute(
      `SELECT dg.*, 
              COALESCE((SELECT k.judul FROM kategori k 
                      WHERE k.id = (SELECT p.kategori_id FROM posts p 
                                    WHERE p.id = (SELECT g.post_id FROM galery g 
                                                WHERE g.id = dg.galery_id))), 
                      'General') as category_name,
              COALESCE((SELECT p.kategori_id FROM posts p 
                      WHERE p.id = (SELECT g.post_id FROM galery g 
                                    WHERE g.id = dg.galery_id)), 
                      1) as kategori_id
       FROM data_galery dg
       ORDER BY dg.created_at DESC 
       LIMIT ?`,
      [limit]
    );
    return rows;
  }

  static async update(id, updateData) {
  const { judul, deskripsi, kategori_id } = updateData;
  const sets = [];
  const params = [];

  console.log('🟡 [MODEL] Update called with:', updateData);

  if (judul) {
    sets.push('judul = ?');
    params.push(judul);
  }

  if (deskripsi !== undefined) {
    sets.push('deskripsi = ?');
    params.push(deskripsi);
  }

  // HANDLE kategori_id UPDATE - INI YANG PENTING!
  if (kategori_id !== undefined) {
    console.log('🟡 [MODEL] Processing kategori_id:', kategori_id);
    
    try {
      // 1. Cari atau buat post berdasarkan kategori_id
      const [postRows] = await pool.execute(
        'SELECT id FROM posts WHERE kategori_id = ? LIMIT 1',
        [kategori_id]
      );
      
      let postId;
      if (postRows.length > 0) {
        postId = postRows[0].id;
      } else {
        // Buat post baru
        const [newPost] = await pool.execute(
          'INSERT INTO posts (judul, kategori_id, created_at) VALUES (?, ?, NOW())',
          [`Post for category ${kategori_id}`, kategori_id]
        );
        postId = newPost.insertId;
      }

      // 2. Cari atau buat galery untuk post ini
      const [galeryRows] = await pool.execute(
        'SELECT id FROM galery WHERE post_id = ? LIMIT 1',
        [postId]
      );
      
      let galeryId;
      if (galeryRows.length > 0) {
        galeryId = galeryRows[0].id;
      } else {
        // Buat galery baru
        const [newGalery] = await pool.execute(
          'INSERT INTO galery (title, post_id, created_at) VALUES (?, ?, NOW())',
          [`Gallery for post ${postId}`, postId]
        );
        galeryId = newGalery.insertId;
      }

      // 3. Update galery_id di photo - INI YANG MENGUBAH KATEGORI
      sets.push('galery_id = ?');
      params.push(galeryId);
      
      console.log('🟢 [MODEL] kategori_id processed:', { kategori_id, postId, galeryId });
      
    } catch (error) {
      console.error('🔴 [MODEL] Error processing kategori_id:', error);
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  if (sets.length === 0) {
    throw new Error('No fields to update');
  }

  params.push(id);
  
  console.log('🟡 [MODEL] Executing SQL:', `UPDATE data_galery SET ${sets.join(', ')} WHERE id = ?`);
  console.log('🟡 [MODEL] With params:', params);
  
  const [result] = await pool.execute(
    `UPDATE data_galery SET ${sets.join(', ')} WHERE id = ?`,
    params
  );
  
  console.log('🟢 [MODEL] SQL update result:', result);
  
  // Return updated photo
  const updatedPhoto = await this.findById(id);
  console.log('🟢 [MODEL] Final updated photo:', {
    id: updatedPhoto.id,
    judul: updatedPhoto.judul,
    kategori_id: updatedPhoto.kategori_id,
    category_name: updatedPhoto.category_name
  });
  
  return updatedPhoto;
}
}

module.exports = Photo;
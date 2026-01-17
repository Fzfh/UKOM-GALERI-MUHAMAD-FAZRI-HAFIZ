const Photo = require('../models/Photo');
const { pool } = require('../config/database'); // JANGAN LUPA IMPORT POOL

const photoController = {
  // Get recent photos for homepage
  getRecentPhotos: async (req, res) => {
    try {
      const { limit = 12 } = req.query;
      const photos = await Photo.findRecent(parseInt(limit));
      
      res.json({
        success: true,
        data: photos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching recent photos',
        error: error.message
      });
    }
  },

  // Get photos by galery ID
  getPhotosByGalery: async (req, res) => {
    try {
      const { galeryId } = req.params;
      const { limit = 50, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      
      const photos = await Photo.findByGaleryId(galeryId, parseInt(limit), offset);
      
      res.json({
        success: true,
        data: photos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: photos.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching photos',
        error: error.message
      });
    }
  },

  // Get single photo by ID
  getPhotoById: async (req, res) => {
    try {
      const { id } = req.params;
      const photo = await Photo.findById(id);
      
      if (!photo) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }
      
      res.json({
        success: true,
        data: photo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching photo',
        error: error.message
      });
    }
  },

  // Create new photo - FIX SYNTAX, HAPUS "const"
  createPhoto: async (req, res) => {
    try {
      const { judul, deskripsi, kategori_id } = req.body;
      const image_url = `/uploads/images/${req.file.filename}`;
      
      if (!judul || !kategori_id) {
        return res.status(400).json({
          success: false,
          message: 'Title and category are required'
        });
      }

      // 1. CARI ATAU BUAT POST BERDASARKAN KATEGORI
      let [posts] = await pool.execute(
        'SELECT id FROM posts WHERE kategori_id = ? LIMIT 1',
        [kategori_id]
      );
      
      let post_id;
      if (posts.length > 0) {
        post_id = posts[0].id;
      } else {
        // Buat post baru
        const [postResult] = await pool.execute(
          'INSERT INTO posts (judul, kategori_id, status, created_at) VALUES (?, ?, "active", NOW())',
          [`Post for category ${kategori_id}`, kategori_id]
        );
        post_id = postResult.insertId;
      }

      // 2. CARI ATAU BUAT GALERY BERDASARKAN POST
      let [galeries] = await pool.execute(
        'SELECT id FROM galery WHERE post_id = ? LIMIT 1',
        [post_id]
      );
      
      let galery_id;
      if (galeries.length > 0) {
        galery_id = galeries[0].id;
      } else {
        // Buat galery baru
        const [galeryResult] = await pool.execute(
          'INSERT INTO galery (title, post_id, status, created_at) VALUES (?, ?, "active", NOW())',
          [`Gallery for post ${post_id}`, post_id]
        );
        galery_id = galeryResult.insertId;
      }

      // 3. SIMPAN FOTO
      const photoData = {
        judul,
        deskripsi: deskripsi || '',
        file: image_url,
        galery_id: galery_id
      };

      const newPhoto = await Photo.create(photoData);
      
      res.status(201).json({
        success: true,
        message: 'Photo uploaded successfully',
        data: newPhoto
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading photo',
        error: error.message
      });
    }
  },

  // Di controllers/photoController.js - updatePhoto function
updatePhoto: async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, deskripsi, kategori_id } = req.body;

    // console.log('🟡 [BACKEND] Update request body:', req.body);
    // console.log('🟡 [BACKEND] Update params:', { id, judul, deskripsi, kategori_id });

    // Cek apakah photo exists
    const existingPhoto = await Photo.findById(id);
    if (!existingPhoto) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Update data - PASTIKAN kategori_id termasuk
    const updateData = {};
    if (judul) updateData.judul = judul;
    if (deskripsi !== undefined) updateData.deskripsi = deskripsi;
    if (kategori_id) {
      console.log('🟡 [BACKEND] Processing kategori_id update:', kategori_id);
      updateData.kategori_id = kategori_id;
    }

    // console.log('🟡 [BACKEND] Final updateData:', updateData);

    const result = await Photo.update(id, updateData);
    
    // console.log('🟢 [BACKEND] Update result:', result);

    res.json({
      success: true,
      message: 'Photo updated successfully',
      data: result
    });
  } catch (error) {
    // console.error('🔴 [BACKEND] Update photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating photo',
      error: error.message
    });
  }
},

  // Delete photo
  deletePhoto: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Cek apakah photo exists
      const existingPhoto = await Photo.findById(id);
      if (!existingPhoto) {
        return res.status(404).json({
          success: false,
          message: 'Photo not found'
        });
      }

      await Photo.delete(id);
      
      res.json({
        success: true,
        message: 'Photo deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting photo',
        error: error.message
      });
    }
  }
};

module.exports = photoController;
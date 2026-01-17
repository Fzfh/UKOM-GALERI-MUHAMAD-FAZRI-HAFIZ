const Like = require('../models/Like');

exports.likePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { user_ip } = req.body;

    // Cek apakah sudah like
    const existingLike = await Like.exists(user_ip, photoId);
    
    if (existingLike) {
      // Jika sudah like, UNLIKE (hapus like)
      await Like.delete(user_ip, photoId);
      const newLikeCount = await Like.countByPhotoId(photoId);
      
      return res.json({
        success: true,
        message: 'Photo unliked successfully',
        data: { likeCount: newLikeCount }
      });
    } else {
      // Jika belum like, LIKE (tambah like)
      await Like.create(user_ip, photoId);
      const newLikeCount = await Like.countByPhotoId(photoId);
      
      return res.json({
        success: true,
        message: 'Photo liked successfully',
        data: { likeCount: newLikeCount }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Hapus endpoint unlikePhoto karena sudah digabung
exports.getLikesByPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    
    const likeCount = await Like.countByPhotoId(photoId);
    
    res.json({
      success: true,
      data: { likeCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
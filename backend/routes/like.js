const express = require('express');
const { 
  likePhoto, 
  getLikesByPhoto 
} = require('../controllers/likeController');

const router = express.Router();

// Public routes
router.get('/photo/:photoId', getLikesByPhoto);
router.post('/photo/:photoId', likePhoto); // Ini sekarang TOGGLE like/unlike

// HAPUS endpoint unlike karena sudah digabung

module.exports = router;
const express = require('express');
const { 
  getPhotosByGalery, 
  getPhotoById, 
  getRecentPhotos,
  createPhoto, 
  updatePhoto, 
  deletePhoto 
} = require('../controllers/photoController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
// HAPUS DULU validatePhoto import

const router = express.Router();

// Public routes
router.get('/recent', getRecentPhotos);
router.get('/galery/:galeryId', getPhotosByGalery);
router.get('/:id', getPhotoById);

// Protected admin routes - TANPA VALIDATION DULU
router.post('/', authenticate, authorize('admin'), upload.single('file'), createPhoto);
router.put('/:id', authenticate, authorize('admin'), upload.single('file'), updatePhoto);
router.delete('/:id', authenticate, authorize('admin'), deletePhoto);

module.exports = router;
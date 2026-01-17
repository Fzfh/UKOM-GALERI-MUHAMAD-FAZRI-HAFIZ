const express = require('express');
const { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost 
} = require('../controllers/postController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected admin routes
router.post('/', authenticate, authorize('admin'), createPost);
router.put('/:id', authenticate, authorize('admin'), updatePost);
router.delete('/:id', authenticate, authorize('admin'), deletePost);

module.exports = router;
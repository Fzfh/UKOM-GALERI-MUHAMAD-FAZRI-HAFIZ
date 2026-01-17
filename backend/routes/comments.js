const express = require('express');
const { 
  getCommentsByPhoto, 
  getAllComments,
  createComment, 
  updateComment, 
  deleteComment 
} = require('../controllers/commentController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/photo/:photoId', getCommentsByPhoto);
router.post('/', createComment);

// Protected admin routes
router.get('/', authenticate, authorize('admin'), getAllComments);
router.put('/:id', authenticate, authorize('admin'), updateComment);
router.delete('/:id', authenticate, authorize('admin'), deleteComment);

module.exports = router;
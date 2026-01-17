const Comment = require('../models/Comment');

const commentController = {
  // Get comments by photo ID
  getCommentsByPhoto: async (req, res) => {
    try {
      const { photoId } = req.params;
      const comments = await Comment.findByPhotoId(photoId);
      
      res.json({
        success: true,
        data: comments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching comments',
        error: error.message
      });
    }
  },

  // Get all comments (for admin)
  getAllComments: async (req, res) => {
    try {
      const { limit = 50, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      
      const comments = await Comment.findAll(parseInt(limit), offset);
      
      res.json({
        success: true,
        data: comments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: comments.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching comments',
        error: error.message
      });
    }
  },

  // Create new comment
  createComment: async (req, res) => {
    try {
      const { data_galery_id, user_name, comment_text } = req.body;

      if (!data_galery_id || !user_name || !comment_text) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      const commentData = {
        data_galery_id: parseInt(data_galery_id),
        user_name,
        comment_text
      };

      const newComment = await Comment.create(commentData);
      
      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: newComment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding comment',
        error: error.message
      });
    }
  },

  // Update comment
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { comment_text } = req.body;
      
      // Update comment
      await Comment.update(id, { comment_text });
      const updatedComment = await Comment.findById(id);
      
      res.json({
        success: true,
        message: 'Comment updated successfully',
        data: updatedComment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating comment',
        error: error.message
      });
    }
  },

  // Delete comment
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      await Comment.delete(id);
      
      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting comment',
        error: error.message
      });
    }
  }
};

module.exports = commentController;
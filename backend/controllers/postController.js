const Post = require('../models/Post');

const postController = {
  // Get all posts
  getAllPosts: async (req, res) => {
    try {
      const { limit = 10, page = 1, category } = req.query;
      const offset = (page - 1) * limit;
      
      let posts;
      if (category) {
        posts = await Post.findByCategory(category, parseInt(limit), offset);
      } else {
        posts = await Post.findAll(parseInt(limit), offset);
      }
      
      res.json({
        success: true,
        data: posts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: posts.length
        }
      });
    } catch (error) {
      console.error('Get posts error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching posts',
        error: error.message
      });
    }
  },

  // Get single post
  getPostById: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching post',
        error: error.message
      });
    }
  },

  // Create new post
  createPost: async (req, res) => {
    try {
      const { judul, kategori_id } = req.body;

      if (!judul || !kategori_id) {
        return res.status(400).json({
          success: false,
          message: 'Title and category are required'
        });
      }

      const postData = {
        judul,
        kategori_id: parseInt(kategori_id)
      };

      const newPost = await Post.create(postData);
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: newPost
      });
    } catch (error) {
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating post',
        error: error.message
      });
    }
  },

  // Update post
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { judul, kategori_id } = req.body;
      
      // Cek apakah post exists
      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      const updateData = {};
      if (judul) updateData.judul = judul;
      if (kategori_id) updateData.kategori_id = parseInt(kategori_id);

      const updatedPost = await Post.update(id, updateData);
      
      res.json({
        success: true,
        message: 'Post updated successfully',
        data: updatedPost
      });
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating post',
        error: error.message
      });
    }
  },

  // Delete post
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Cek apakah post exists
      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      await Post.delete(id);
      
      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting post',
        error: error.message
      });
    }
  }
};

module.exports = postController;
import api from './api';

export const commentService = {
  // Get comments by photo ID
  getCommentsByPhoto: async (photoId) => {
    const response = await api.get(`/comments/photo/${photoId}`);
    return response.data;
  },

  // Get all comments (for admin)
  getAllComments: async (limit = 50, page = 1) => {
    const response = await api.get(`/comments?limit=${limit}&page=${page}`);
    return response.data;
  },

  // Create comment
  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
};
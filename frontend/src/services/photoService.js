import api from './api';

export const photoService = {
  // Get recent photos
  getRecentPhotos: async (limit = 12) => {
    const response = await api.get(`/photos/recent?limit=${limit}`);
    return response.data;
  },

  // Get photos by gallery
  getPhotosByGallery: async (galleryId, page = 1, limit = 50) => {
    const response = await api.get(`/photos/galery/${galleryId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get single photo
  getPhotoById: async (id) => {
    const response = await api.get(`/photos/${id}`);
    return response.data;
  },

  // Upload photo
  uploadPhoto: async (formData) => {
    const response = await api.post('/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete photo
  deletePhoto: async (id) => {
    const response = await api.delete(`/photos/${id}`);
    return response.data;
  },

  // Di services/photoService.js - update function updatePhoto
updatePhoto: async (photoId, photoData) => {
  try {
    const response = await api.put(`/photos/${photoId}`, photoData);
    return response.data;
  } catch (error) {
    console.error('🔴 [PHOTO SERVICE] updatePhoto error:', error);
    console.error('🔴 [PHOTO SERVICE] error details:', error.response?.data);
    throw error;
  }
},

  // HAPUS function unlikePhoto karena sudah digabung
likePhoto: async (photoId, userIp) => {
    console.log('🔵 Like/Unlike request:', { photoId, userIp });
    try {
      const response = await api.post(`/likes/photo/${photoId}`, {
        user_ip: userIp
      });
      console.log('✅ Like/Unlike response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Like/Unlike error:', error.response?.data || error.message);
      throw error;
    }
  },

// HAPUS unlikePhoto function

  unlikePhoto: async (photoId, userIp) => {
    console.log('🔵 Unlike request:', { photoId, userIp });
    try {
      // PERBAIKI: Gunakan endpoint sesuai backend - DELETE /api/likes/photo/:photoId
      const response = await api.delete(`/likes/photo/${photoId}`, {
        data: { user_ip: userIp }
      });
      console.log('✅ Unlike response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Unlike error:', error.response?.data || error.message);
      throw error;
    }
  },

  addComment: async (photoId, userName, commentText) => {
    console.log('🔵 Comment request:', { photoId, userName, commentText });
    
    try {
      const response = await api.post('/comments', {
        data_galery_id: photoId,
        user_name: userName,
        comment_text: commentText
      });
      console.log('✅ Comment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Comment error:', error.response?.data || error.message);
      throw error;
    }
  },

  getPhotoLikes: async (photoId) => {
    console.log('🔵 Get likes request:', photoId);
    try {
      // PERBAIKI: Gunakan endpoint sesuai backend - GET /api/likes/photo/:photoId
      const response = await api.get(`/likes/photo/${photoId}`);
      console.log('✅ Get likes response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get likes error:', error.response?.data || error.message);
      throw error;
    }
  },

  getPhotoComments: async (photoId) => {
    console.log('🔵 Get comments request:', photoId);
    try {
      // PERBAIKI: Gunakan endpoint sesuai backend - GET /api/comments/photo/:photoId
      const response = await api.get(`/comments/photo/${photoId}`);
      console.log('✅ Get comments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get comments error:', error.response?.data || error.message);
      throw error;
    }
  }
};
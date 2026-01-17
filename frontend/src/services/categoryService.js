import api from './api';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create category - hanya kirim judul
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', { 
      judul: categoryData.judul 
    });
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};
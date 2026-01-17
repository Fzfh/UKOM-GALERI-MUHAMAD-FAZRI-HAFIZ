import api from './api';

export const authService = {
  login: async (username, password) => {
    try {
      console.log('Sending login request:', { username });
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      console.log('Login response:', response.data);
      
      // PERBAIKI: Handle berbagai struktur response
      const responseData = response.data;
      
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
        
        // Cari user data di berbagai kemungkinan property
        const userData = responseData.data || responseData.user || responseData;
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Token saved:', responseData.token);
        console.log('User saved:', userData);
      }
      
      return responseData;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log('Sending register request:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register service error:', error);
      throw error;
    }
  },

  logout: () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Getting current user:', user);
    return user;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    console.log('Checking authentication - Token exists:', !!token);
    return !!token;
  }
};
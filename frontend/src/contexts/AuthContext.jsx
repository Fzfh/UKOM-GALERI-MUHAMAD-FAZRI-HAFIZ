import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider mounted - Checking authentication...');
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      console.log('📦 Stored Token:', !!token);
      console.log('📦 Stored User Data:', userData);

      if (token && userData) {
        const parsedData = JSON.parse(userData);
        console.log('🔍 Parsed User Data:', parsedData);

        // User sudah disimpan dalam format yang benar di localStorage
        setUser(parsedData);
        console.log('🎯 User set from localStorage:', parsedData.username);
      } else {
        console.log('🔓 No auth data found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error initializing auth:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    console.log('🧹 Clearing auth data...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = async (username, password) => {
    try {
      console.log('🚀 Login attempt for:', username);
      
      const data = await authService.login(username, password);
      console.log('✅ Login response:', data);

      // HANDLE BERBAGAI STRUCTURE RESPONSE
      let userData = null;
      let token = null;

      if (data.data) {
        // Structure dengan data property
        if (data.data.user) {
          // Case 1: { data: { user: { ... }, token: '...' } } - ADMIN
          userData = data.data.user;
          token = data.data.token;
          console.log('👑 Admin structure detected');
        } else {
          // Case 2: { data: { ... } } - USER BIASA  
          userData = data.data;
          token = data.data.token;
          console.log('👤 User structure detected');
        }
      } else if (data.user) {
        // Case 3: { user: { ... }, token: '...' }
        userData = data.user;
        token = data.token;
        console.log('🔧 Direct user structure detected');
      } else {
        // Case 4: Assume data is user object
        userData = data;
        token = data.token;
        console.log('🔄 Fallback structure detected');
      }

      console.log('🔑 Extracted Token:', !!token);
      console.log('👤 Extracted User Data:', userData);

      // VALIDASI USER DATA
      if (!userData || !userData.username) {
        console.error('❌ Invalid user data structure:', userData);
        throw new Error('Invalid user data received from server');
      }

      // SIMPAN KE LOCALSTORAGE
      if (token) {
        localStorage.setItem('token', token);
        console.log('💾 Token saved to localStorage');
      }

      // Simpan user data yang sudah dibersihkan
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('💾 User data saved to localStorage');

      // SET STATE
      setUser(userData);
      
      console.log('🎉 Login successful for:', userData.username);
      console.log('👑 User role:', userData.role);
      return { success: true, user: userData };

    } catch (error) {
      console.error('❌ Login failed:', error);
      clearAuth();
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user:', user?.username);
    clearAuth();
  };

  const isAdmin = () => {
    return user?.role === 'administrator';
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    loading
  };

  console.log('🔄 AuthProvider State:', {
    user: user?.username || 'null',
    role: user?.role || 'null',
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    loading
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
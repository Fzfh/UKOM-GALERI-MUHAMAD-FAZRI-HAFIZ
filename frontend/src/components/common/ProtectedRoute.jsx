import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika require admin, cek role admin atau administrator
  if (requireAdmin && user.role !== 'admin' && user.role !== 'administrator') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
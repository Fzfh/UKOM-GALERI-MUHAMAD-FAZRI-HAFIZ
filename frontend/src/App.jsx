import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import PhotoDetail from './pages/PhotoDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPhotos from './pages/admin/Photos';
import AdminComments from './pages/admin/Comments';
import AdminCategories from './pages/admin/Categories';

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
          <Header />
          <main style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/photo/:id" element={<PhotoDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> {/* TAMBAH INI */}

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/photos" element={
                <ProtectedRoute>
                  <AdminPhotos />
                </ProtectedRoute>
              } />
              <Route path="/admin/comments" element={
                <ProtectedRoute>
                  <AdminComments />
                </ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute>
                  <AdminCategories />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
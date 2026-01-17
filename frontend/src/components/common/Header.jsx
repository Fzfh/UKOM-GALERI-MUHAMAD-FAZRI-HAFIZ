import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import "./Header.css"

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom shadow-sm fixed-top">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <i className="fas fa-camera-retro me-2 text-primary"></i>
          <span className="text-gradient">DardderdOR</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler custom-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/gallery" 
                className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
              >
                <i className="fas fa-images me-1"></i>
                Gallery
              </Link>
            </li>
          </ul>

          {/* User Menu */}
          <div className="navbar-nav align-items-center">
            {user ? (
              <div className="nav-item dropdown" ref={dropdownRef}>
                <button 
                  className="btn btn-outline-custom dropdown-toggle d-flex align-items-center"
                  onClick={toggleDropdown}
                  type="button"
                >
                  <i className="fas fa-user-circle me-2"></i>
                  <span className="me-2">{user.username}</span>
                  {user.role === 'admin' || user.role === 'administrator' ? (
                    <span className="badge bg-purple ms-1">
                      <i className="fas fa-shield-alt me-1"></i>
                      Admin
                    </span>
                  ) : (
                    <span className="badge bg-secondary ms-1">User</span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="dropdown-menu show dropdown-menu-end shadow">
                    {/* User Info */}
                    <div className="dropdown-header">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-user-circle text-muted me-2"></i>
                        <div>
                          <div className="fw-bold">{user.username}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>

                    {/* Admin Menu */}
                    {(user.role === 'admin' || user.role === 'administrator') && (
                      <>
                        <div className="dropdown-header text-uppercase small fw-bold text-purple">
                          <i className="fas fa-cog me-1"></i>
                          Admin Panel
                        </div>
                        <Link 
                          to="/admin" 
                          className="dropdown-item d-flex align-items-center"
                          onClick={closeDropdown}
                        >
                          <i className="fas fa-tachometer-alt me-2 text-info"></i>
                          Dashboard
                        </Link>
                        <Link 
                          to="/admin/photos" 
                          className="dropdown-item d-flex align-items-center"
                          onClick={closeDropdown}
                        >
                          <i className="fas fa-camera me-2 text-success"></i>
                          Manage Photos
                        </Link>
                        <Link 
                          to="/admin/categories" 
                          className="dropdown-item d-flex align-items-center"
                          onClick={closeDropdown}
                        >
                          <i className="fas fa-folder me-2 text-warning"></i>
                          Categories
                        </Link>
                        <Link 
                          to="/admin/comments" 
                          className="dropdown-item d-flex align-items-center"
                          onClick={closeDropdown}
                        >
                          <i className="fas fa-comments me-2 text-purple"></i>
                          Comments
                        </Link>
                        <div className="dropdown-divider"></div>
                      </>
                    )}

                    {/* User Menu Items */}

                    {/* Logout */}
                    <div className="dropdown-divider"></div>
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item d-flex align-items-center text-danger"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login/Register Buttons
              <div className="d-flex gap-2">
                <Link 
                  to="/login" 
                  className="btn btn-outline-custom d-flex align-items-center"
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-custom d-flex align-items-center"
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
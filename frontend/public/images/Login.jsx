import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import backgroundImage from './bg.jpeg'; 
import './Auth.css';

const Login = () => {
  console.log('Background image:', backgroundImage);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔄 Before login - Current user:', user);
      const result = await login(formData.username, formData.password);
      console.log('✅ After login - Result:', result);
      
      setTimeout(() => {
        const currentUser = authService.getCurrentUser();
        console.log('🎯 Redirect check - Current user:', currentUser);
        
        if (currentUser?.role === 'administrator') {
          console.log('➡️ Redirecting to admin');
          navigate('/admin');
        } else {
          console.log('➡️ Redirecting to home');
          navigate('/');
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Background dengan inline style */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: 'slideBackground 30s ease-in-out infinite',
          filter: 'blur(2px) brightness(0.9)',
          zIndex: -1
        }}
      ></div>
      
      <div className="container-fluid vh-100 position-relative">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card auth-card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="auth-logo mb-3">
                    <i className="bi bi-flower1 text-primary" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h2 className="card-title fw-bold text-dark mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold text-dark">
                      <i className="bi bi-person-fill me-2 text-primary"></i>
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold text-dark">
                      <i className="bi bi-lock-fill me-2 text-primary"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-4">
                  <p className="text-dark">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                      Register here
                    </Link>
                  </p>
                </div>

                {/* Demo Accounts Info */}
                <div className="mt-4 p-3 bg-light rounded">
                  <p className="mb-2 fw-semibold text-dark">
                    <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                    Demo Accounts:
                  </p>
                  <div className="small text-muted">
                    <p className="mb-1">
                      <strong>Admin:</strong> admin / password
                    </p>
                    <p className="mb-0">
                      <strong>User:</strong> Register new account
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
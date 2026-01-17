import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';

import "./Categories.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      setMessage('❌ Category name is required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await categoryService.createCategory({ judul: categoryName });
      setMessage('✅ Category created successfully!');
      setCategoryName('');
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error('Error creating category:', error);
      setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await categoryService.deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
        setMessage('✅ Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        setMessage('❌ Error deleting category');
      }
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-categories">
      {/* Header Section */}
      <div className="admin-header bg-gradient-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-5 fw-bold mb-3">
                <i className="fas fa-folder me-3"></i>
                Category Management
              </h1>
              <p className="lead mb-0">
                Organize your photos with categories for better management
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="admin-stats">
                <div className="stat-card bg-white bg-opacity-10 rounded-3 p-3 d-inline-block">
                  <h3 className="fw-bold mb-0">{categories.length}</h3>
                  <small>Total Categories</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content py-5">
        <div className="container">
          {/* Message Alert */}
          {message && (
            <div className={`alert ${message.includes('❌') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`}>
              <i className={`fas ${message.includes('❌') ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}></i>
              {message}
              <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
            </div>
          )}

          <div className="row">
            {/* Add Category Form */}
            <div className="col-lg-5 mb-5">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-header bg-transparent border-0 py-4">
                  <h3 className="card-title fw-bold text-center mb-0">
                    <i className="fas fa-plus-circle text-primary me-2"></i>
                    Add New Category
                  </h3>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                      <label className="form-label fw-semibold mb-3">
                        <i className="fas fa-tag me-2"></i>
                        Category Name *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Enter category name (e.g., Nature, Portrait, etc.)"
                        required
                        disabled={loading}
                      />
                      <small className="form-text text-muted mt-2">
                        Choose a descriptive name for your category
                      </small>
                    </div>

                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creating Category...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-plus me-2"></i>
                            Create Category
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-header bg-transparent border-0 py-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="card-title fw-bold mb-0">
                      <i className="fas fa-list me-2"></i>
                      Existing Categories
                    </h3>
                    <span className="badge bg-primary fs-6">{categories.length}</span>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  {/* Search Box */}
                  <div className="search-box mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="fas fa-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {filteredCategories.length === 0 ? (
                    <div className="empty-state text-center py-5">
                      <div className="empty-icon mb-4">
                        <i className="fas fa-folder-open fa-3x text-muted"></i>
                      </div>
                      <h5 className="mb-3">
                        {searchTerm ? 'No categories found' : 'No categories yet'}
                      </h5>
                      <p className="text-muted mb-4">
                        {searchTerm 
                          ? 'Try adjusting your search terms' 
                          : 'Create your first category to get started!'
                        }
                      </p>
                      {searchTerm && (
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="categories-list">
                      <div className="row g-3">
                        {filteredCategories.map((category, index) => (
                          <div key={category.id} className="col-md-6">
                            <div className="category-card card border-0 shadow-sm h-100">
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <h5 className="card-title fw-semibold text-truncate">
                                    <i className="fas fa-folder text-warning me-2"></i>
                                    {category.judul}
                                  </h5>
                                  <span className="badge bg-light text-dark small">
                                    ID: {category.id}
                                  </span>
                                </div>
                                
                                <div className="category-meta">
                                  <div className="d-flex justify-content-between align-items-center text-muted small">
                                    <span>
                                      <i className="fas fa-calendar me-1"></i>
                                      {new Date(category.created_at).toLocaleDateString()}
                                    </span>
                                    <span>
                                      <i className="fas fa-clock me-1"></i>
                                      {new Date(category.created_at).toLocaleTimeString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="card-footer bg-transparent border-0 pt-0">
                                <div className="d-grid">
                                  <button 
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteCategory(category.id)}
                                    title="Delete Category"
                                  >
                                    <i className="fas fa-trash me-2"></i>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Results Info */}
                  {filteredCategories.length > 0 && searchTerm && (
                    <div className="mt-4 pt-3 border-top">
                      <p className="text-muted small mb-0">
                        Showing {filteredCategories.length} of {categories.length} categories
                        {searchTerm && ` for "${searchTerm}"`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {categories.length > 0 && (
            <div className="row mt-5">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="fw-semibold mb-4">
                      <i className="fas fa-chart-bar me-2"></i>
                      Categories Overview
                    </h5>
                    <div className="row text-center">
                      <div className="col-md-3">
                        <div className="stat-item">
                          <h3 className="fw-bold text-primary">{categories.length}</h3>
                          <small className="text-muted">Total Categories</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="stat-item">
                          <h3 className="fw-bold text-success">
                            {categories.filter(cat => cat.judul.length <= 15).length}
                          </h3>
                          <small className="text-muted">Short Names</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="stat-item">
                          <h3 className="fw-bold text-warning">
                            {categories.filter(cat => cat.judul.length > 15).length}
                          </h3>
                          <small className="text-muted">Long Names</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="stat-item">
                          <h3 className="fw-bold text-info">
                            {new Set(categories.map(cat => cat.judul.toLowerCase())).size}
                          </h3>
                          <small className="text-muted">Unique Names</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
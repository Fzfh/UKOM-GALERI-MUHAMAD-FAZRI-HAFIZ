import React, { useState, useEffect } from 'react';
import PhotoUpload from '../../components/admin/PhotoUpload';
import { photoService } from '../../services/photoService';
import { categoryService } from '../../services/categoryService';
import "./Photos.css"

const AdminPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editFormData, setEditFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori_id: ''
  });

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchPhotos();
      fetchCategories();
    }
  }, [activeTab]);

  const fetchPhotos = async () => {
  setLoading(true);
  try {
    const response = await photoService.getRecentPhotos(100);
    console.log('🟡 [FETCH PHOTOS] Data from backend:', response.data);
    
    // Cek photo dengan id yang diupdate
    const updatedPhoto = response.data.find(p => p.id === editingPhoto?.id);
    if (updatedPhoto) {
      console.log('🟢 [FETCH PHOTOS] Updated photo in response:', {
        id: updatedPhoto.id,
        judul: updatedPhoto.judul,
        kategori_id: updatedPhoto.kategori_id,
        category_name: updatedPhoto.category_name
      });
    }
    
    setPhotos(response.data);
  } catch (error) {
    console.error('Error fetching photos:', error);
  } finally {
    setLoading(false);
  }
};

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleUploadSuccess = () => {
    setActiveTab('manage');
    fetchPhotos();
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await photoService.deletePhoto(id);
        setPhotos(photos.filter(photo => photo.id !== id));
        showNotification('Photo deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting photo:', error);
        showNotification('Error deleting photo', 'error');
      }
    }
  };

  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setEditFormData({
      judul: photo.judul || '',
      deskripsi: photo.deskripsi || '',
      kategori_id: photo.kategori_id || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
    setEditFormData({
      judul: '',
      deskripsi: '',
      kategori_id: ''
    });
  };

  const handleUpdatePhoto = async (e) => {
  e.preventDefault();
  
  console.log('🟡 [CATEGORY DEBUG] Categories list:', categories);
  console.log('🟡 [CATEGORY DEBUG] Editing kategori_id:', editFormData.kategori_id);

  if (!editFormData.judul.trim()) {
    showNotification('Photo title is required', 'error');
    return;
  }

  try {
    const payload = {
      judul: editFormData.judul,
      deskripsi: editFormData.deskripsi,
      kategori_id: editFormData.kategori_id
    };

    const response = await photoService.updatePhoto(editingPhoto.id, payload);
    
    if (response.success) {
      console.log('🟢 [BEFORE REFRESH] Current photos:', photos);
      
      // Refresh data dari backend
      await fetchPhotos();
      
      console.log('🟢 [AFTER REFRESH] Updated photos:', photos);
      
      // Cek photo yang diupdate
      const updatedPhoto = photos.find(p => p.id === editingPhoto.id);
      console.log('🟢 [SPECIFIC PHOTO] Updated photo data:', updatedPhoto);
      console.log('🟢 [SPECIFIC PHOTO] Category info:', {
        id: updatedPhoto?.id,
        judul: updatedPhoto?.judul,
        kategori_id: updatedPhoto?.kategori_id,
        category_name: updatedPhoto?.category_name
      });

      setEditingPhoto(null);
      setEditFormData({
        judul: '',
        deskripsi: '',
        kategori_id: ''
      });
      
      showNotification('Photo updated successfully!', 'success');
    } else {
      showNotification('Error updating photo', 'error');
    }
  } catch (error) {
    console.error('Error updating photo:', error);
    showNotification('Error updating photo', 'error');
  }
};

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showNotification = (message, type) => {
    // You can implement a proper notification system here
    alert(message);
  };

  // Filter photos based on search and category
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || photo.kategori_id == selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const availableCategories = [...new Set(photos.map(photo => photo.category_name))].filter(Boolean);

  return (
    <div className="admin-photos">
      {/* Header Section */}
      <div className="admin-header bg-gradient-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-5 fw-bold mb-3">
                <i className="fas fa-camera me-3"></i>
                Photo Management
              </h1>
              <p className="lead mb-0">
                Upload and manage your photo collection with ease
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="admin-stats">
                <div className="stat-card bg-white bg-opacity-10 rounded-3 p-3 d-inline-block">
                  <h3 className="fw-bold mb-0">{photos.length}</h3>
                  <small>Total Photos</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-navigation bg-white shadow-sm">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <ul className="nav nav-pills admin-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upload')}
                  >
                    <i className="fas fa-cloud-upload-alt me-2"></i>
                    Upload Photo
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
                    onClick={() => setActiveTab('manage')}
                  >
                    <i className="fas fa-images me-2"></i>
                    Manage Photos
                    {photos.length > 0 && (
                      <span className="badge bg-primary ms-2">{photos.length}</span>
                    )}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="admin-content py-5">
        <div className="container">
          {activeTab === 'upload' && (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="upload-card card border-0 shadow-lg">
                  <div className="card-header bg-transparent border-0 py-4">
                    <h3 className="card-title fw-bold text-center mb-0">
                      <i className="fas fa-plus-circle text-primary me-2"></i>
                      Upload New Photo
                    </h3>
                  </div>
                  <div className="card-body p-4">
                    <PhotoUpload onUploadSuccess={handleUploadSuccess} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="manage-photos">
              {/* Edit Photo Modal */}
              {editingPhoto && (
                <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title fw-bold">
                          <i className="fas fa-edit me-2"></i>
                          Edit Photo: {editingPhoto.judul}
                        </h5>
                        <button 
                          type="button" 
                          className="btn-close" 
                          onClick={handleCancelEdit}
                        ></button>
                      </div>
                      <form onSubmit={handleUpdatePhoto}>
                        <div className="modal-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="edit-photo-preview mb-4">
                                <img 
                                  src={`http://localhost:5050${editingPhoto.file}`} 
                                  alt={editingPhoto.judul}
                                  className="img-fluid rounded"
                                  style={{maxHeight: '300px', objectFit: 'cover', width: '100%'}}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group mb-3">
                                <label className="form-label fw-semibold">Photo Title *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="judul"
                                  value={editFormData.judul}
                                  onChange={handleEditFormChange}
                                  required
                                />
                              </div>
                              
                              <div className="form-group mb-3">
                                <label className="form-label fw-semibold">Description</label>
                                <textarea
                                  className="form-control"
                                  name="deskripsi"
                                  rows="4"
                                  value={editFormData.deskripsi}
                                  onChange={handleEditFormChange}
                                  placeholder="Enter photo description..."
                                />
                              </div>
                              
                              <div className="form-group mb-3">
                                <label className="form-label fw-semibold">Category *</label>
                                <select
                                  className="form-select"
                                  name="kategori_id"
                                  value={editFormData.kategori_id}
                                  onChange={handleEditFormChange}
                                  required
                                >
                                  <option value="">Select Category</option>
                                  {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                      {category.judul}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={handleCancelEdit}
                          >
                            <i className="fas fa-times me-2"></i>
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary"
                          >
                            <i className="fas fa-save me-2"></i>
                            Update Photo
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters and Search */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="search-box">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="fas fa-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search photos by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {availableCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={fetchPhotos}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Refresh
                  </button>
                </div>
              </div>

              {/* Results Info */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="fw-semibold">
                      Photos Management 
                      <span className="text-muted fw-normal"> ({filteredPhotos.length} items)</span>
                    </h4>
                    {(searchTerm || selectedCategory) && (
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('');
                        }}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Photos Grid */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading photos...</p>
                </div>
              ) : filteredPhotos.length === 0 ? (
                <div className="empty-state text-center py-5">
                  <div className="empty-icon mb-4">
                    <i className="fas fa-camera fa-4x text-muted"></i>
                  </div>
                  <h4 className="mb-3">No photos found</h4>
                  <p className="text-muted mb-4">
                    {searchTerm || selectedCategory 
                      ? "Try adjusting your search criteria" 
                      : "Upload your first photo to get started!"
                    }
                  </p>
                  {!searchTerm && !selectedCategory && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setActiveTab('upload')}
                    >
                      <i className="fas fa-cloud-upload-alt me-2"></i>
                      Upload First Photo
                    </button>
                  )}
                </div>
              ) : (
                <div className="row g-4">
                  {filteredPhotos.map(photo => (
                    <div key={photo.id} className="col-xl-3 col-lg-4 col-md-6">
                      <div className="photo-admin-card card border-0 shadow-sm h-100">
                        <div className="photo-image position-relative">
                          <img 
                            src={`http://localhost:5050${photo.file}`} 
                            alt={photo.judul}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200/667eea/ffffff?text=Image+Not+Found';
                            }}
                          />
                          <div className="photo-overlay position-absolute top-0 end-0 p-2">
                            <span className="badge bg-dark bg-opacity-75">
                              {photo.category_name}
                            </span>
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <h6 className="card-title fw-semibold text-truncate">
                            {photo.judul}
                          </h6>
                          <p className="card-text text-muted small line-clamp-2">
                            {photo.deskripsi || 'No description'}
                          </p>
                          
                          <div className="photo-meta">
                            <div className="d-flex justify-content-between align-items-center text-muted small">
                              <span>
                                <i className="fas fa-calendar me-1"></i>
                                {new Date(photo.created_at).toLocaleDateString()}
                              </span>
                              <span>
                                <i className="fas fa-folder me-1"></i>
                                ID: {photo.id}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="card-footer bg-transparent border-0 pt-0">
                          <div className="d-grid gap-2">
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeletePhoto(photo.id)}
                            >
                              <i className="fas fa-trash me-2"></i>
                              Delete
                            </button>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEditPhoto(photo)}
                            >
                              <i className="fas fa-edit me-2"></i>
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {filteredPhotos.length > 0 && filteredPhotos.length >= 50 && (
                <div className="text-center mt-5">
                  <button className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Load More Photos
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPhotos;
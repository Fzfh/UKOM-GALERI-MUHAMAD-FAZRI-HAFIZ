import React, { useState, useEffect } from 'react';
import { photoService } from '../../services/photoService';
import { categoryService } from '../../services/categoryService';
import './PhotoUpload.css';

const PhotoUpload = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    galery_id: '', // ID galery/album
    kategori_id: ''
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Error loading categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Clear previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Create new preview URL
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please select a photo file');
      return;
    }

    if (!formData.judul || !formData.kategori_id) {
      setMessage('Title and category are required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('judul', formData.judul);
      uploadFormData.append('deskripsi', formData.deskripsi);
      uploadFormData.append('kategori_id', formData.kategori_id);
      
      // Jika butuh galery_id, tambahkan ini
      if (formData.galery_id) {
        uploadFormData.append('galery_id', formData.galery_id);
      }

      const response = await photoService.uploadPhoto(uploadFormData);
      
      setMessage('Photo uploaded successfully!');
      
      // Reset form
      setFormData({
        judul: '',
        deskripsi: '',
        galery_id: '',
        kategori_id: ''
      });
      setFile(null);
      setPreviewUrl('');
      
      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.value = '';
      }

      // Callback untuk refresh photo list
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Error uploading photo: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      judul: '',
      deskripsi: '',
      galery_id: '',
      kategori_id: ''
    });
    setFile(null);
    setPreviewUrl('');
    setMessage('');
    
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="photo-upload-container">
      <div className="photo-upload-card">
        <div className="upload-header">
          <h3 className="upload-title">
            <span className="icon-upload"></span> Upload New Photo
          </h3>
          <p className="upload-subtitle">Add a new photo to your gallery collection</p>
        </div>
        
        {message && (
          <div className={`message-alert ${message.includes('Error') ? 'error' : 'success'}`}>
            <span className="alert-icon">{message.includes('Error') ? '⚠️' : '✓'}</span>
            <span className="alert-text">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-row">
            {/* File Upload Section */}
            <div className="form-section">
              <div className="section-header">
                <h4>Photo Selection</h4>
                <div className="section-required">* Required</div>
              </div>
              
              <div className="file-upload-area">
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                  required
                />
                <label htmlFor="file-input" className="file-upload-label">
                  <div className="upload-placeholder">
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">
                      <span className="upload-primary">Click to select photo</span>
                      <span className="upload-secondary">JPG, PNG, or GIF (Max 10MB)</span>
                    </div>
                  </div>
                </label>
                
                {previewUrl && (
                  <div className="file-preview">
                    <div className="preview-header">
                      <span className="preview-title">Preview</span>
                      <span className="file-name">{file.name}</span>
                    </div>
                    <div className="preview-image-container">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="preview-image"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Details Section */}
            <div className="form-section">
              <div className="section-header">
                <h4>Photo Details</h4>
              </div>
              
              <div className="form-grid">
                {/* Title Input */}
                <div className="form-group">
                  <label htmlFor="judul" className="form-label">
                    Photo Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="judul"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive title"
                    className="form-input"
                    required
                  />
                </div>

                {/* Category Select */}
                <div className="form-group">
                  <label htmlFor="kategori_id" className="form-label">
                    Category <span className="required">*</span>
                  </label>
                  <select
                    id="kategori_id"
                    name="kategori_id"
                    value={formData.kategori_id}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.judul}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gallery ID (Optional) */}
                <div className="form-group">
                  <label htmlFor="galery_id" className="form-label">
                    Gallery ID <span className="optional">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    id="galery_id"
                    name="galery_id"
                    value={formData.galery_id}
                    onChange={handleInputChange}
                    placeholder="e.g., 123"
                    className="form-input"
                  />
                </div>

                {/* Description Input */}
                <div className="form-group full-width">
                  <label htmlFor="deskripsi" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Tell the story behind this photo..."
                    rows="4"
                    className="form-textarea"
                  />
                  <div className="textarea-counter">
                    {formData.deskripsi.length}/500 characters
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !file}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <span className="btn-icon"></span>
                  Upload Photo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoUpload;
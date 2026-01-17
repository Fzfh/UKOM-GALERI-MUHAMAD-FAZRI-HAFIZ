import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { photoService } from '../services/photoService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../contexts/AuthContext';
import './Gallery.css';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoComments, setPhotoComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const { user, isAuthenticated } = useAuth();

  const actualUser = user?.user || user;

  useEffect(() => {
    fetchPhotos();
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

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await photoService.getRecentPhotos(100);
      // console.log('Gallery photos:', response.data);
      
      const photosWithDetails = await Promise.all(
        response.data.map(async (photo) => {
          try {
            const [likesResponse, commentsResponse] = await Promise.all([
              photoService.getPhotoLikes(photo.id),
              photoService.getPhotoComments(photo.id)
            ]);
            
            let likeCount = 0;
            let commentCount = 0;
            let isLiked = false;
            
            if (likesResponse.success && likesResponse.data) {
              likeCount = likesResponse.data.likeCount || 0;
              if (actualUser?.username || actualUser?.id) {
                const userIdentifier = getUserIdentifier();
                isLiked = await checkUserLike(photo.id, userIdentifier);
              }
            }
            
            if (commentsResponse.success && commentsResponse.data) {
              const commentsArray = commentsResponse.data.comments || commentsResponse.data || [];
              commentCount = commentsArray.length;
            }
            
            return {
              ...photo,
              like_count: likeCount,
              comment_count: commentCount,
              is_liked: isLiked
            };
          } catch (error) {
            console.error('Error fetching photo details:', error);
            return { ...photo, like_count: 0, comment_count: 0, is_liked: false };
          }
        })
      );
      
      setPhotos(photosWithDetails);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserLike = async (photoId, userIdentifier) => {
    try {
      const response = await photoService.checkUserLike(photoId, userIdentifier);
      return response.success && response.data?.isLiked;
    } catch (error) {
      console.error('Error checking user like:', error);
      return false;
    }
  };

  const getUserIdentifier = () => {
    if (actualUser?.username) {
      return actualUser.username;
    } else if (actualUser?.id) {
      return actualUser.id.toString();
    } else {
      return 'user_' + Date.now();
    }
  };

  const loadPhotoComments = async (photoId) => {
    try {
      const commentsResponse = await photoService.getPhotoComments(photoId);
      
      let commentsArray = [];
      if (commentsResponse.success && commentsResponse.data) {
        commentsArray = commentsResponse.data.comments || commentsResponse.data || [];
      }
      
      setPhotoComments(prev => ({
        ...prev,
        [photoId]: commentsArray
      }));
      
      return commentsArray;
    } catch (error) {
      console.error('Error loading comments:', error);
      return [];
    }
  };

  const openPhotoModal = async (photo) => {
    setSelectedPhoto(photo);
    await loadPhotoComments(photo.id);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
    setNewComment('');
  };

  const updatePhotoCounts = (photoId, newLikeCount, newCommentCount = null, isLiked = null) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { 
            ...photo, 
            like_count: newLikeCount,
            comment_count: newCommentCount !== null ? newCommentCount : photo.comment_count,
            is_liked: isLiked !== null ? isLiked : photo.is_liked
          }
        : photo
    ));
    
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto(prev => ({
        ...prev,
        like_count: newLikeCount,
        comment_count: newCommentCount !== null ? newCommentCount : prev.comment_count,
        is_liked: isLiked !== null ? isLiked : prev.is_liked
      }));
    }
  };

  const handleLike = async (photoId, currentLikeState, currentLikeCount) => {
    if (!isAuthenticated) {
      alert('Silakan login untuk menyukai foto');
      return;
    }

    try {
      const userIdentifier = getUserIdentifier();
      
      const newLikeState = !currentLikeState;
      const newLikeCount = newLikeState ? currentLikeCount + 1 : currentLikeCount - 1;
      
      updatePhotoCounts(photoId, newLikeCount, null, newLikeState);
      
      await photoService.likePhoto(photoId, userIdentifier);
      
    } catch (error) {
      console.error('Error liking photo:', error);
      updatePhotoCounts(photoId, currentLikeCount, null, currentLikeState);
      alert('Error liking photo. Please try again.');
    }
  };

  const handleCommentSubmit = async (photoId) => {
    if (!newComment.trim()) return;

    try {
      const userIdentifier = getUserIdentifier();
      
      if (!userIdentifier || userIdentifier.startsWith('user_')) {
        alert('Cannot get user information. Please login again.');
        return;
      }
      
      await photoService.addComment(photoId, userIdentifier, newComment);
      
      const updatedComments = await loadPhotoComments(photoId);
      updatePhotoCounts(photoId, selectedPhoto.like_count, updatedComments.length);
      
      setNewComment('');
      
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    }
  };

  const filteredPhotos = selectedCategory 
    ? photos.filter(photo => photo.kategori_id == selectedCategory)
    : photos;

  const searchedPhotos = searchTerm
    ? filteredPhotos.filter(photo => 
        photo.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (photo.deskripsi && photo.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredPhotos;

  const PhotoCard = ({ photo }) => {
    return (
      <div className="card shadow-lg border-0 h-100 w-100 photo-card-hover animate__animated animate__fadeIn d-flex flex-column">
        <div 
          className="position-relative overflow-hidden cursor-pointer flex-shrink-0" 
          style={{ height: '250px' }}
          onClick={() => openPhotoModal(photo)}
        >
          <img 
            src={`http://localhost:5050${photo.file}`} 
            alt={photo.judul}
            className="card-img-top h-100 w-100 object-fit-cover transition-transform"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300/667eea/ffffff?text=Image+Error';
            }}
          />
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-3 photo-overlay">
            <div className="d-flex gap-3 text-white">
              <small className="d-flex align-items-center gap-1">
                <i className={`bi ${photo.is_liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                {photo.like_count || 0}
              </small>
              <small className="d-flex align-items-center gap-1">
                <i className="bi bi-chat"></i>
                {photo.comment_count || 0}
              </small>
            </div>
          </div>
        </div>
        
        <div className="card-body bg-white d-flex flex-column flex-grow-1">
          {/* Judul dengan ellipsis */}
          <h5 
            className="card-title fw-semibold text-dark mb-2 text-truncate" 
            title={photo.judul}
          >
            {photo.judul}
          </h5>
          
          {/* Deskripsi dengan line clamp */}
          <div className="flex-grow-1 mb-3">
            <p 
              className="card-text text-muted small line-clamp-2 mb-0"
              title={photo.deskripsi}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1.4em',
                maxHeight: '2.8em'
              }}
            >
              {photo.deskripsi || 'Tidak ada deskripsi'}
            </p>
          </div>
          
          {/* Footer dengan badge dan tanggal */}
          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-light">
            <span 
              className="badge bg-purple text-white text-truncate"
              style={{ maxWidth: '60%' }}
              title={photo.category_name}
            >
              {photo.category_name}
            </span>
            <small className="text-muted">
              {new Date(photo.created_at).toLocaleDateString('id-ID')}
            </small>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-50">
          <div className="spinner-border text-purple" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Memuat galeri foto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero position-relative overflow-hidden min-vh-50 d-flex align-items-center">
        <div className="hero-background"></div>
        <div className="container position-relative z-2">
          <div className="row justify-content-center text-center text-white">
            <div className="col-lg-8 col-md-10">
              <div className="hero-content animate__animated animate__fadeInDown">
                <h1 className="display-3 fw-bold mb-4 hero-title">
                  Galeri Parfum DardderdOR
                </h1>
                <p className="lead mb-5 hero-subtitle">
                  Jelajahi koleksi lengkap parfum eksklusif kami. Temukan aroma yang sempurna untuk setiap momen spesial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="gallery-controls py-4 bg-light">
        <div className="container">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="search-box">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Cari foto berdasarkan judul atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="category-filter">
                <label className="form-label fw-semibold mb-2">Filter Kategori</label>
                <select 
                  className="form-select"
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.judul}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="results-info text-md-end">
                <p className="mb-1 text-muted">
                  Menampilkan <strong>{searchedPhotos.length}</strong> dari <strong>{photos.length}</strong> foto
                </p>
                {selectedCategory && (
                  <span className="badge bg-primary">
                    Kategori: {categories.find(c => c.id == selectedCategory)?.judul}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photos Grid Section */}
      <section className="gallery-content py-5">
        <div className="container">
          {searchedPhotos.length === 0 ? (
            <div className="empty-state text-center py-5">
              <div className="empty-icon mb-4">
                <i className="fas fa-camera fa-4x text-muted"></i>
              </div>
              <h3 className="mb-3">Tidak ada foto ditemukan</h3>
              <p className="text-muted mb-4">
                {searchTerm || selectedCategory 
                  ? "Coba sesuaikan pencarian atau filter Anda" 
                  : "Belum ada foto yang tersedia di galeri"
                }
              </p>
              {(searchTerm || selectedCategory) && (
                <button 
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchTerm('');
                  }}
                  className="btn btn-primary"
                >
                  <i className="fas fa-undo me-2"></i>
                  Tampilkan Semua Foto
                </button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {searchedPhotos.map((photo, index) => (
                <div key={photo.id} className="col-xl-3 col-lg-4 col-md-6 d-flex">
                  <div className={`w-100 animate__animated animate__fadeInUp animate__delay-${(index % 4)}s`}>
                    <PhotoCard photo={photo} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fixed Size Modal - DIPERBAIKI SEPERTI DI HOME */}
      {selectedPhoto && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.95)'}} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered fixed-modal-size">
            <div className="modal-content border-0 shadow-lg" style={{maxHeight: '90vh'}}>
              <div className="modal-body p-0 h-100">
                <div className="row g-0 h-100">
                  {/* Image Section */}
                  <div className="col-md-7 bg-dark position-relative d-flex align-items-center justify-content-center" 
                      style={{maxHeight: '85vh', overflow: 'hidden'}}>
                    <div className="modal-image-container" style={{height: '85vh', maxWidth: '100%'}}>
                      <img 
                        src={`http://localhost:5050${selectedPhoto.file}`} 
                        alt={selectedPhoto.judul}
                        className="modal-image"
                        style={{maxHeight: '85vh', objectFit: 'contain', width: '100%'}}
                      />
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="col-md-5 d-flex flex-column h-100">
                    {/* Header */}
                    <div className="p-3 border-bottom bg-white flex-shrink-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="modal-title fw-bold text-dark mb-0">{selectedPhoto.judul}</h5>
                        <button 
                          type="button" 
                          className="btn-close" 
                          onClick={closePhotoModal}
                        ></button>
                      </div>
                    </div>
                    
                    {/* Content Scroll Area */}
                    <div className="flex-grow-1 overflow-auto modal-scrollable-content" style={{maxHeight: 'calc(85vh - 200px)'}}>
                      {/* Actions */}
                      <div className="p-3 border-bottom bg-white">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <button 
                            className={`btn btn-sm d-flex align-items-center gap-2 ${
                              selectedPhoto.is_liked ? 'btn-danger' : 'btn-outline-danger'
                            }`}
                            onClick={() => handleLike(selectedPhoto.id, selectedPhoto.is_liked, selectedPhoto.like_count)}
                          >
                            <i className={`bi ${selectedPhoto.is_liked ? 'bi-heart-fill' : 'bi-heart'}`}></i> 
                            {selectedPhoto.is_liked ? 'Disukai' : 'Suka'}
                          </button>
                          <div className="text-muted small">
                            <span className="me-3">{selectedPhoto.like_count} suka</span>
                            <span>{selectedPhoto.comment_count || 0} komentar</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description dengan scroll jika panjang */}
                      <div className="p-3 border-bottom bg-white">
                        <h6 className="fw-semibold text-dark mb-2 small">Deskripsi:</h6>
                        <div 
                          className="modal-description small"
                          style={{
                            maxHeight: '150px',
                            overflowY: selectedPhoto.deskripsi && selectedPhoto.deskripsi.length > 200 ? 'auto' : 'visible'
                          }}
                        >
                          <p className="text-dark mb-0" style={{whiteSpace: 'pre-line'}}>
                            {selectedPhoto.deskripsi || 'Tidak ada deskripsi'}
                          </p>
                        </div>
                        <div className="d-flex gap-2 flex-wrap mt-3">
                          <span className="badge bg-purple">{selectedPhoto.category_name}</span>
                          <small className="text-muted">
                            {new Date(selectedPhoto.created_at).toLocaleDateString('id-ID')}
                          </small>
                        </div>
                      </div>
                      
                      {/* Comments List */}
                      <div className="p-3 bg-light">
                        <h6 className="fw-semibold text-dark mb-3 small">
                          Komentar ({photoComments[selectedPhoto.id]?.length || 0})
                        </h6>
                        <div className="comments-list" style={{maxHeight: '250px', overflowY: 'auto'}}>
                          {photoComments[selectedPhoto.id]?.map((comment, index) => (
                            <div key={comment.id || index} className="mb-3 pb-2 border-bottom">
                              <div className="d-flex justify-content-between align-items-start">
                                <strong className="text-dark small">{comment.user_name}:</strong>
                                <small className="text-muted">
                                  {new Date(comment.created_at).toLocaleDateString('id-ID')}
                                </small>
                              </div>
                              <p className="mb-0 text-dark small">{comment.comment_text}</p>
                            </div>
                          ))}
                          {(!photoComments[selectedPhoto.id] || photoComments[selectedPhoto.id].length === 0) && (
                            <p className="text-muted text-center small">Belum ada komentar. Jadilah yang pertama!</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Comment Input - FIXED at bottom */}
                    <div className="border-top bg-white flex-shrink-0 modal-comment-input">
                      {isAuthenticated ? (
                        <div className="p-3">
                          <div className="mb-2">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Tambah komentar..."
                              rows="2"
                              className="form-control form-control-sm"
                              style={{resize: 'none'}}
                            />
                          </div>
                          <button 
                            onClick={() => handleCommentSubmit(selectedPhoto.id)}
                            className="btn btn-purple btn-sm w-100"
                            disabled={!newComment.trim()}
                          >
                            Kirim Komentar
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 text-center">
                          <p className="text-muted mb-0 small">
                            Silakan <Link to="/login" className="text-purple fw-bold">login</Link> untuk berkomentar
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
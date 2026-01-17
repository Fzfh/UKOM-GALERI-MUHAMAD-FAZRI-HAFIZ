import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { photoService } from '../services/photoService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryPhotos, setCategoryPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoComments, setPhotoComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const actualUser = user?.user || user;

  useEffect(() => {
    fetchData();
  }, []);

  // Auto carousel setelah data loaded
  useEffect(() => {
    if (allPhotos.length > 0) {
      const interval = setInterval(() => {
        setCurrentCarouselIndex((prev) => (prev + 1) % allPhotos.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [allPhotos.length]);

  const fetchData = async () => {
    try {
      const [categoriesResponse, photosResponse] = await Promise.all([
        categoryService.getAllCategories(),
        photoService.getRecentPhotos(50)
      ]);

      setCategories(categoriesResponse.data);
      setAllPhotos(photosResponse.data);
      
      const photosWithDetails = await Promise.all(
        photosResponse.data.map(async (photo) => {
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

      const grouped = {};
      categoriesResponse.data.forEach(category => {
        grouped[category.id] = photosWithDetails
          .filter(photo => photo.kategori_id == category.id)
          .slice(0, 4);
      });
      
      setCategoryPhotos(grouped);
      setFeaturedPhotos(photosWithDetails.slice(0, 6));
    } catch (error) {
      console.error('Error fetching data:', error);
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
    setFeaturedPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { 
            ...photo, 
            like_count: newLikeCount,
            comment_count: newCommentCount !== null ? newCommentCount : photo.comment_count,
            is_liked: isLiked !== null ? isLiked : photo.is_liked
          }
        : photo
    ));
    
    setCategoryPhotos(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(categoryId => {
        updated[categoryId] = updated[categoryId].map(photo =>
          photo.id === photoId
            ? {
                ...photo,
                like_count: newLikeCount,
                comment_count: newCommentCount !== null ? newCommentCount : photo.comment_count,
                is_liked: isLiked !== null ? isLiked : photo.is_liked
              }
            : photo
        );
      });
      return updated;
    });
    
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
      navigate('/login');
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

  // CategorySection Component
  const CategorySection = ({ category }) => {
    const photos = categoryPhotos[category.id] || [];
    
    if (photos.length === 0) return null;

    return (
      <section className="mb-5 animate__animated animate__fadeInUp">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">{category.judul}</h2>
          <Link 
            to={`/gallery?category=${category.id}`} 
            className="btn btn-outline-purple btn-sm"
          >
            Lihat Semua <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        
        <div className="row g-4">
          {photos.map(photo => (
            <div key={photo.id} className="col-lg-3 col-md-6 d-flex">
              <PhotoCard photo={photo} />
            </div>
          ))}
        </div>
      </section>
    );
  };

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
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-purple" role="status" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold">Memuat konten menarik...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section dengan Carousel Background */}
      <section className="hero-section position-relative overflow-hidden min-vh-100 d-flex align-items-center">
        {/* Carousel Background */}
        <div className="carousel-background">
          {allPhotos.map((photo, index) => (
            <div 
              key={photo.id}
              className={`carousel-slide ${index === currentCarouselIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(http://localhost:5050${photo.file})`
              }}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="container position-relative z-2">
          <div className="row justify-content-center text-center text-white">
            <div className="col-lg-8 col-md-10">
              <div className="hero-content animate__animated animate__fadeInDown">
                <h1 className="display-2 fw-bold mb-4 hero-title">
                  PARFUME DARDDERDOR INDONESIA
                </h1>
                <p className="lead mb-5 hero-subtitle">
                  Temukan keharuman yang memukau dengan koleksi parfum eksklusif kami. 
                  Dari aroma floral yang romantis, woody yang maskulin, citrus yang menyegarkan, 
                  hingga oriental yang misterius - setiap tetes menceritakan kisahnya sendiri.
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 animate__animated animate__fadeInUp">
                  <Link to="/gallery" className="btn btn-light btn-lg px-4 py-3 fw-bold shadow-lg">
                    <i className="bi bi-images me-2"></i>Jelajahi Koleksi
                  </Link>
                  <Link to="/register" className="btn btn-outline-light btn-lg px-4 py-3 fw-bold">
                    <i className="bi bi-person-plus me-2"></i>Bergabung Sekarang
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Featured Photos */}
      {featuredPhotos.length > 0 && (
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-4 fw-bold text-dark mb-3 animate__animated animate__fadeIn">
                <i className="bi bi-star-fill text-warning me-2"></i>Produk Unggulan
              </h2>
              <p className="lead text-muted animate__animated animate__fadeIn animate__delay-1s">
                Koleksi parfum terbaik dan terpopuler dari komunitas kami
              </p>
            </div>
            
            <div className="row g-4">
              {featuredPhotos.map((photo, index) => (
                <div key={photo.id} className="col-lg-4 col-md-6 d-flex">
                  <div className={`w-100 animate__animated animate__fadeInUp animate__delay-${(index % 3) + 1}s`}>
                    <PhotoCard photo={photo} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Sections */}
      <div className="py-5 bg-white">
        <div className="container">
          {categories.map((category, index) => (
            <div key={category.id} className={`animate__animated animate__fadeInUp animate__delay-${(index % 3)}s`}>
              <CategorySection category={category} />
            </div>
          ))}
        </div>
      </div>

      {/* Photo Modal */}
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
                    
                    {/* Comment Input */}
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

export default Home;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { photoService } from '../../services/photoService';
import { categoryService } from '../../services/categoryService';
import { commentService } from '../../services/commentService';

import "./Dashboard.css";

// Icons menggunakan Bootstrap Icons
const StatsIcon = ({ type }) => {
  const icons = {
    photos: <i className="fas fa-images"></i>,
    categories: <i className="fas fa-folder"></i>,
    comments: <i className="fas fa-comments"></i>,
    likes: <i className="fas fa-heart"></i>,
    users: <i className="fas fa-users"></i>,
    activity: <i className="fas fa-chart-line"></i>,
    trending: <i className="fas fa-chart-bar"></i>,
    refresh: <i className="fas fa-sync-alt"></i>
  };

  return icons[type] || icons.photos;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalCategories: 0,
    totalComments: 0,
    totalLikes: 0,
    loading: true
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [popularPhotos, setPopularPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchRecentActivity(),
        fetchPopularPhotos()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [photosResponse, categoriesResponse, commentsResponse] = await Promise.all([
        photoService.getRecentPhotos(1000),
        categoryService.getAllCategories(),
        commentService.getAllComments(1000)
      ]);

      let totalLikesCount = 0;
      if (photosResponse.data) {
        const likesPromises = photosResponse.data.map(photo => 
          photoService.getPhotoLikes(photo.id)
        );
        
        const likesResponses = await Promise.all(likesPromises);
        totalLikesCount = likesResponses.reduce((total, response) => {
          return total + (response.data?.likeCount || 0);
        }, 0);
      }

      setStats({
        totalPhotos: photosResponse.data?.length || 0,
        totalCategories: categoriesResponse.data?.length || 0,
        totalComments: commentsResponse.data?.length || 0,
        totalLikes: totalLikesCount,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const [recentPhotos, recentComments] = await Promise.all([
        photoService.getRecentPhotos(5),
        commentService.getAllComments(5)
      ]);

      const activities = [];

      if (recentPhotos.data) {
        recentPhotos.data.forEach(photo => {
          activities.push({
            type: 'photo_upload',
            icon: 'photos',
            title: 'Photo Uploaded',
            description: `"${photo.judul}"`,
            time: formatTime(new Date(photo.created_at)),
            timestamp: new Date(photo.created_at)
          });
        });
      }

      if (recentComments.data) {
        recentComments.data.forEach(comment => {
          activities.push({
            type: 'comment',
            icon: 'comments',
            title: 'New Comment',
            description: `by ${comment.user_name}`,
            time: formatTime(new Date(comment.created_at)),
            timestamp: new Date(comment.created_at)
          });
        });
      }

      activities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const fetchPopularPhotos = async () => {
    try {
      const photosResponse = await photoService.getRecentPhotos(10);
      
      if (photosResponse.data) {
        const photosWithLikes = await Promise.all(
          photosResponse.data.map(async (photo) => {
            try {
              const likesResponse = await photoService.getPhotoLikes(photo.id);
              return {
                ...photo,
                like_count: likesResponse.data?.likeCount || 0
              };
            } catch (error) {
              return { ...photo, like_count: 0 };
            }
          })
        );

        const popular = photosWithLikes
          .sort((a, b) => b.like_count - a.like_count)
          .slice(0, 5);

        setPopularPhotos(popular);
      }
    } catch (error) {
      console.error('Error fetching popular photos:', error);
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-header bg-gradient-primary text-white py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="display-5 fw-bold mb-3">
                  <i className="fas fa-tachometer-alt me-3"></i>
                  Dashboard Overview
                </h1>
                <p className="lead mb-0">Welcome to your gallery management panel</p>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-content py-5">
          <div className="container">
            <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
              <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header Section dengan Gradient Biru */}
      <div className="admin-header bg-gradient-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-5 fw-bold mb-3">
                <i className="fas fa-tachometer-alt me-3"></i>
                Dashboard Overview
              </h1>
              <p className="lead mb-0">Welcome to your gallery management panel</p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="admin-stats">
                <div className="stat-card bg-white bg-opacity-10 rounded-3 p-3 d-inline-block">
                  <h3 className="fw-bold mb-0 text-gradient-reverse">{formatNumber(stats.totalPhotos)}</h3>
                  <small>Total Photos</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content py-5">
        <div className="container">
          {/* Refresh Button */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-end">
                <button 
                  className="btn btn-outline-primary d-flex align-items-center gap-2"
                  onClick={fetchAllData}
                >
                  <StatsIcon type="refresh" />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="row g-4 mb-5">
            <div className="col-xl-3 col-md-6">
              <div className="stats-card card border-0 shadow-lg h-100">
                <div className="card-body text-center p-4">
                  <div className="stats-icon bg-primary bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                    <StatsIcon type="photos" className="text-primary fs-2" />
                  </div>
                  <h3 className="fw-bold text-dark mb-2">{formatNumber(stats.totalPhotos)}</h3>
                  <p className="text-muted mb-3">Total Photos</p>
                  <div className="pt-3 border-top">
                    <Link to="/admin/photos" className="text-primary text-decoration-none fw-semibold">
                      View all photos →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="stats-card card border-0 shadow-lg h-100">
                <div className="card-body text-center p-4">
                  <div className="stats-icon bg-success bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                    <StatsIcon type="categories" className="text-success fs-2" />
                  </div>
                  <h3 className="fw-bold text-dark mb-2">{formatNumber(stats.totalCategories)}</h3>
                  <p className="text-muted mb-3">Categories</p>
                  <div className="pt-3 border-top">
                    <Link to="/admin/categories" className="text-primary text-decoration-none fw-semibold">
                      Manage categories →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="stats-card card border-0 shadow-lg h-100">
                <div className="card-body text-center p-4">
                  <div className="stats-icon bg-info bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                    <StatsIcon type="comments" className="text-info fs-2" />
                  </div>
                  <h3 className="fw-bold text-dark mb-2">{formatNumber(stats.totalComments)}</h3>
                  <p className="text-muted mb-3">Total Comments</p>
                  <div className="pt-3 border-top">
                    <Link to="/admin/comments" className="text-primary text-decoration-none fw-semibold">
                      Moderate comments →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="stats-card card border-0 shadow-lg h-100">
                <div className="card-body text-center p-4">
                  <div className="stats-icon bg-danger bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                    <StatsIcon type="likes" className="text-danger fs-2" />
                  </div>
                  <h3 className="fw-bold text-dark mb-2">{formatNumber(stats.totalLikes)}</h3>
                  <p className="text-muted mb-3">Total Likes</p>
                  <div className="pt-3 border-top">
                    <span className="text-muted">Across all photos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            {/* Popular Photos Section */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-header bg-transparent border-0 py-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="card-title fw-bold mb-0 d-flex align-items-center gap-2">
                      <StatsIcon type="trending" className="text-warning" />
                      Most Popular Photos
                    </h3>
                    <Link to="/admin/photos" className="text-primary text-decoration-none fw-semibold">
                      View All
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <div className="popular-photos-list">
                    {popularPhotos.map((photo, index) => (
                      <div key={photo.id} className="popular-photo-item d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
                        <div className="rank-badge bg-primary text-white rounded-2 px-3 py-2 fw-bold">
                          #{index + 1}
                        </div>
                        <div className="photo-image flex-shrink-0">
                          <img 
                            src={`http://localhost:5050${photo.file}`} 
                            alt={photo.judul}
                            className="rounded-3"
                            style={{width: '80px', height: '80px', objectFit: 'cover'}}
                          />
                        </div>
                        <div className="photo-info flex-grow-1">
                          <h6 className="fw-semibold mb-2">{photo.judul}</h6>
                          <p className="text-muted small mb-2">{photo.category_name}</p>
                          <div className="d-flex align-items-center gap-2">
                            <StatsIcon type="likes" className="text-danger" />
                            <span className="text-muted fw-semibold">{photo.like_count} likes</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-header bg-transparent border-0 py-4">
                  <h3 className="card-title fw-bold mb-0 d-flex align-items-center gap-2">
                    <StatsIcon type="activity" className="text-success" />
                    Recent Activity
                  </h3>
                </div>
                <div className="card-body">
                  <div className="activity-list">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="activity-item d-flex align-items-start gap-3 p-3 border-bottom">
                        <div className="activity-icon bg-primary bg-opacity-10 rounded-circle p-2 flex-shrink-0">
                          <StatsIcon type={activity.icon} className="text-primary" />
                        </div>
                        <div className="activity-content flex-grow-1">
                          <h6 className="fw-semibold mb-1">{activity.title}</h6>
                          <p className="text-muted small mb-1">{activity.description}</p>
                          <span className="text-muted small">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                    {recentActivity.length === 0 && (
                      <div className="text-center py-4 text-muted">
                        <i className="fas fa-inbox fa-2x mb-3"></i>
                        <p className="mb-0">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-transparent border-0 py-4">
              <h3 className="card-title fw-bold mb-0 d-flex align-items-center gap-2">
                <i className="fas fa-bolt text-warning"></i>
                Quick Actions
              </h3>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-sm-6 col-md-3">
                  <Link to="/admin/photos" className="quick-action-card card text-decoration-none text-dark h-100 border-0">
                    <div className="card-body text-center p-4">
                      <div className="action-icon bg-primary bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                        <StatsIcon type="photos" className="text-primary fs-3" />
                      </div>
                      <span className="d-block fw-semibold">Upload Photo</span>
                      <small className="text-muted">Add new photos</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-3">
                  <Link to="/admin/categories" className="quick-action-card card text-decoration-none text-dark h-100 border-0">
                    <div className="card-body text-center p-4">
                      <div className="action-icon bg-success bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                        <StatsIcon type="categories" className="text-success fs-3" />
                      </div>
                      <span className="d-block fw-semibold">Add Category</span>
                      <small className="text-muted">Organize photos</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-3">
                  <Link to="/admin/comments" className="quick-action-card card text-decoration-none text-dark h-100 border-0">
                    <div className="card-body text-center p-4">
                      <div className="action-icon bg-info bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                        <StatsIcon type="comments" className="text-info fs-3" />
                      </div>
                      <span className="d-block fw-semibold">Moderate Comments</span>
                      <small className="text-muted">Manage comments</small>
                    </div>
                  </Link>
                </div>
                <div className="col-sm-6 col-md-3">
                  <Link to="/gallery" className="quick-action-card card text-decoration-none text-dark h-100 border-0">
                    <div className="card-body text-center p-4">
                      <div className="action-icon bg-warning bg-opacity-10 rounded-circle p-3 mb-3 mx-auto">
                        <StatsIcon type="photos" className="text-warning fs-3" />
                      </div>
                      <span className="d-block fw-semibold">View Gallery</span>
                      <small className="text-muted">Browse photos</small>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
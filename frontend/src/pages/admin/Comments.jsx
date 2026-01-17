import React, { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import Loading from '../../components/common/Loading';

import "./Comments.css";

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await commentService.getAllComments();
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setMessage('❌ Error loading comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id) => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      try {
        await commentService.deleteComment(id);
        setComments(comments.filter(comment => comment.id !== id));
        setMessage('✅ Comment deleted successfully');
      } catch (error) {
        console.error('Error deleting comment:', error);
        setMessage('❌ Error deleting comment');
      }
    }
  };

  // Filter comments based on search
  const filteredComments = comments.filter(comment =>
    comment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.comment_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.photo_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="admin-comments">
      {/* Header Section */}
      <div className="admin-header bg-gradient-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-5 fw-bold mb-3">
                <i className="fas fa-comments me-3"></i>
                Comment Management
              </h1>
              <p className="lead mb-0">
                Moderate and manage user comments across all photos
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="admin-stats">
                <div className="stat-card bg-white bg-opacity-10 rounded-3 p-3 d-inline-block">
                  <h3 className="fw-bold mb-0 text-glow-white">{comments.length}</h3>
                  <small className="text-white-50">Total Comments</small>
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

          {/* Search and Filters */}
          <div className="row mb-4">
            <div className="col-md-8">
              <div className="search-box">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search comments by user, content, or photo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={fetchComments}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="fw-semibold">
                  Comments Management 
                  <span className="text-muted fw-normal"> ({filteredComments.length} items)</span>
                </h4>
                {searchTerm && (
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading comments...</p>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="empty-state text-center py-5">
              <div className="empty-icon mb-4">
                <i className="fas fa-comments fa-4x text-muted"></i>
              </div>
              <h4 className="mb-3">
                {searchTerm ? 'No comments found' : 'No comments yet'}
              </h4>
              <p className="text-muted mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Comments will appear here once users start engaging with photos'
                }
              </p>
              {searchTerm && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setSearchTerm('')}
                >
                  Show All Comments
                </button>
              )}
            </div>
          ) : (
            <div className="comments-list">
              <div className="row g-4">
                {filteredComments.map((comment) => (
                  <div key={comment.id} className="col-12">
                    <div className="comment-card card border-0 shadow-sm h-100">
                      <div className="card-body">
                        {/* Comment Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="user-avatar bg-primary bg-opacity-10 rounded-circle p-2">
                              <i className="fas fa-user text-primary"></i>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">{comment.user_name || 'Anonymous User'}</h6>
                              <div className="d-flex align-items-center gap-2 text-muted small">
                                <i className="fas fa-clock"></i>
                                <span>{formatTime(comment.created_at)}</span>
                                <span>•</span>
                                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-end">
                            <span className="badge bg-light text-dark small">
                              ID: {comment.id}
                            </span>
                          </div>
                        </div>

                        {/* Comment Content */}
                        <div className="comment-content mb-3">
                          <p className="mb-0 text-dark">{comment.comment_text}</p>
                        </div>

                        {/* Comment Meta */}
                        <div className="comment-meta">
                          <div className="row g-2">
                            {comment.photo_title && (
                              <div className="col-md-6">
                                <div className="d-flex align-items-center gap-2 text-muted small">
                                  <i className="fas fa-image text-primary"></i>
                                  <span className="text-truncate">
                                    Photo: {comment.photo_title}
                                  </span>
                                </div>
                              </div>
                            )}
                            {comment.galery_title && (
                              <div className="col-md-6">
                                <div className="d-flex align-items-center gap-2 text-muted small">
                                  <i className="fas fa-folder text-success"></i>
                                  <span className="text-truncate">
                                    Gallery: {comment.galery_title}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Comment Actions */}
                      <div className="card-footer bg-transparent border-0 pt-0">
                        <div className="d-flex justify-content-end gap-2">
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            title="Delete Comment"
                          >
                            <i className="fas fa-trash me-2"></i>
                            Delete
                          </button>
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="fas fa-eye me-2"></i>
                            View Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {comments.length > 0 && (
            <div className="row mt-5">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="fw-semibold mb-4">
                      <i className="fas fa-chart-bar me-2"></i>
                      Comments Overview
                    </h5>
                    <div className="row text-center">
                      <div className="col-md-3">
                        <div className="stat-item">
                          <h3 className="fw-bold text-primary">{comments.length}</h3>
                          <small className="text-muted">Total Comments</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="stat-item">
                          <h3 className="fw-bold text-success">
                            {new Set(comments.map(comment => comment.user_name)).size}
                          </h3>
                          <small className="text-muted">Unique Users</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="stat-item">
                          <h3 className="fw-bold text-warning">
                            {new Set(comments.map(comment => comment.photo_title)).size}
                          </h3>
                          <small className="text-muted">Photos with Comments</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="stat-item">
                          <h3 className="fw-bold text-info">
                            {comments.filter(comment => comment.comment_text?.length > 100).length}
                          </h3>
                          <small className="text-muted">Long Comments</small>
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

export default AdminComments;
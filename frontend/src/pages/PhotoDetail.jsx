import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { photoService } from '../services/photoService';
import { commentService } from '../services/commentService';
import Loading from '../components/common/Loading';

const PhotoDetail = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    user_name: '',
    comment_text: ''
  });

  useEffect(() => {
    fetchPhotoDetails();
    fetchComments();
  }, [id]);

  const fetchPhotoDetails = async () => {
    try {
      const response = await photoService.getPhotoById(id);
      setPhoto(response.data);
    } catch (error) {
      console.error('Error fetching photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentService.getCommentsByPhoto(id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentForm.user_name || !commentForm.comment_text) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await commentService.createComment({
        data_galery_id: id,
        user_name: commentForm.user_name,
        comment_text: commentForm.comment_text
      });

      // Clear form and refresh comments
      setCommentForm({ user_name: '', comment_text: '' });
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment');
    }
  };

  if (loading) return <Loading />;
  if (!photo) return <div>Photo not found</div>;

  return (
    <div className="photo-detail">
      <div className="container">
        <div className="photo-content">
          <div className="photo-main">
            <img 
              src={`http://localhost:5000${photo.file}`} 
              alt={photo.judul}
            />
          </div>

          <div className="photo-info">
            <h1>{photo.judul}</h1>
            <p className="description">{photo.deskripsi}</p>
            <div className="meta-info">
              <span className="category">Category: {photo.category_name}</span>
              <span className="date">
                Uploaded: {new Date(photo.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
              <h3>Comments ({comments.length})</h3>
              
              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="user_name"
                    value={commentForm.user_name}
                    onChange={handleCommentChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="comment_text"
                    value={commentForm.comment_text}
                    onChange={handleCommentChange}
                    placeholder="Your comment"
                    rows="3"
                    required
                  />
                </div>
                <button type="submit">Post Comment</button>
              </form>

              {/* Comments List */}
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p>No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <strong>{comment.user_name}</strong>
                        <span className="comment-date">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-text">{comment.comment_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
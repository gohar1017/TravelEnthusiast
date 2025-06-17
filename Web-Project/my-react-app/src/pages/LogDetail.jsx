import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHeart, FaRegHeart, FaBookmark, 
  FaArrowLeft, FaMapMarkerAlt,
  FaEdit, FaTrash, FaImage
} from 'react-icons/fa';

const LogDetail = () => {
  // State declarations
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [log, setLog] = useState(location.state?.log || null);
  const [loading, setLoading] = useState(!location.state?.log);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  const fetchLogDetails = async () => {
    try {
      setLoading(true);
      const response = { data: { _id: id, title: 'Sample Log', content: 'Sample content' } };
      setLog(response.data);
      setLiked(false);
      setLikesCount(0);
    } catch (err) {
      setError('Failed to load travel log');
      console.error('Error fetching log:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-image.jpg';
    if (imagePath.includes('unsplash.com')) {
      const baseUrl = imagePath.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=1200&q=80`;
    }
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    } catch (err) {
      console.error('Error liking travel log:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      setNewComment('');
      setError(null);
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      setEditingComment(null);
      setEditText('');
      setError(null);
    } catch (error) {
      console.error('Error editing comment:', error);
      setError(error.response?.data?.message || 'Failed to edit comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      setError(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const startEditing = (comment) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setEditingComment(comment._id);
    setEditText(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
    setError(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    setIsAuthenticated(!!token);
    setCurrentUserId(userId);
    if (!location.state?.log) fetchLogDetails();
  }, [id, location.state]);

  if (loading) return <div className="loading">Loading travel log...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!log) return <div className="not-found">Travel log not found</div>;

  return (
    <div className="log-detail-container">
      <style>{`
        .log-detail-container {
          min-height: 100vh;
          padding: 20px;
          background-color: #f8f9fa;
          color: #333;
          transition: all 0.3s ease;
        }
        .log-detail-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .log-detail-header {
          margin-bottom: 30px;
          text-align: center;
        }
        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          color: #4a6fa5;
          text-decoration: none;
          font-weight: 500;
        }
        .log-detail-header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #333;
        }
        .log-meta {
          display: flex;
          justify-content: center;
          gap: 20px;
          color: #666;
          font-size: 0.9rem;
        }
        .log-image-container {
          width: 100%;
          max-height: 500px;
          overflow: hidden;
          border-radius: 8px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .log-detail-image {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        .log-content {
          margin: 30px 0;
          line-height: 1.8;
          font-size: 1.1rem;
        }
        .log-actions {
          display: flex;
          gap: 15px;
          margin: 20px 0;
          justify-content: center;
        }
        .action-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .like-button {
          background-color: #ff6b6b;
          color: white;
        }
        .like-button:hover {
          background-color: #ff5252;
        }
        .like-button.liked {
          background-color: #e74c3c;
        }
        .bookmark-button {
          background-color: #74b9ff;
          color: white;
        }
        .bookmark-button:hover {
          background-color: #0984e3;
        }
        .comments-section {
          margin-top: 40px;
        }
        .comment-form {
          margin-bottom: 30px;
        }
        .comment-input {
          width: 100%;
          padding: 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          resize: vertical;
          min-height: 100px;
        }
        .comment-input:focus {
          outline: none;
          border-color: #74b9ff;
        }
        .submit-button {
          background-color: #74b9ff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 10px;
        }
        .submit-button:hover {
          background-color: #0984e3;
        }
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .comment {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #74b9ff;
        }
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .comment-author {
          font-weight: 600;
          color: #333;
        }
        .comment-date {
          color: #666;
          font-size: 0.9rem;
        }
        .comment-content {
          line-height: 1.6;
        }
        .comment-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .comment-action {
          background: none;
          border: none;
          color: #74b9ff;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .comment-action:hover {
          text-decoration: underline;
        }
        .edit-form {
          margin-top: 10px;
        }
        .edit-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .edit-actions {
          display: flex;
          gap: 10px;
        }
        .save-button {
          background-color: #00b894;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        .cancel-button {
          background-color: #636e72;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
          color: #666;
        }
        .error-message {
          text-align: center;
          padding: 40px;
          color: #e74c3c;
          font-size: 1.1rem;
        }
        .not-found {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 1.1rem;
        }
      `}</style>

      <div className="log-detail-wrapper">
        <div className="log-detail-header">
          <Link to="/logs" className="back-button">
            <FaArrowLeft /> Back to Logs
          </Link>
          <h1>{log.title}</h1>
          <div className="log-meta">
            <span className="location">
              <FaMapMarkerAlt /> {log.location}
            </span>
            <span className="date">
              {new Date(log.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="log-detail-content">
          <div className="log-image-container">
            {imageError ? (
              <div className="image-fallback">
                <FaImage className="fallback-icon" />
                <p>Image not available</p>
              </div>
            ) : (
              <img
                src={getImageUrl(log.image)}
                alt={log.title}
                className="log-detail-image"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className="log-description">
            <p>{log.description}</p>
          </div>

          <div className="log-tags">
            {log.tags?.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>

          <div className="log-actions">
            <button 
              className={`action-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {liked ? <FaHeart /> : <FaRegHeart />} 
              <span>{likesCount}</span>
            </button>
            <button className="action-btn">
              <FaBookmark /> Save
            </button>
          </div>

          {log.author && (
            <div className="author-info">
              <img 
                src={log.author.profilePicture || '/default-avatar.jpg'} 
                alt={log.author.username} 
                className="author-avatar" 
              />
              <span>Posted by {log.author.username}</span>
            </div>
          )}

          <div className="comments-section">
            <h3>Comments ({log.comments?.length || 0})</h3>
            
            {log.comments?.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <div className="comment-author">
                    <img 
                      src={comment.author.profilePicture || '/default-avatar.jpg'} 
                      alt={comment.author.username} 
                      className="comment-avatar"
                    />
                    <span>{comment.author.username}</span>
                  </div>
                  {currentUserId === comment.author._id && (
                    <div className="comment-actions">
                      <button onClick={() => startEditing(comment)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteComment(comment._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                
                {editingComment === comment._id ? (
                  <div className="edit-comment-form">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="edit-buttons">
                      <button onClick={() => handleEditComment(comment._id)}>
                        Save
                      </button>
                      <button onClick={cancelEditing}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-content">{comment.content}</p>
                )}
                
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                required
              />
              <button type="submit">Post Comment</button>
            </form>
          ) : (
            <p className="login-prompt">
              Please <Link to="/login">log in</Link> to add a comment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogDetail;
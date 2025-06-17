import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const TravelLogCard = ({ log, onUpdate }) => {
  const [liked, setLiked] = useState(log.likes?.includes(localStorage.getItem('userId')));
  const [likesCount, setLikesCount] = useState(log.likes?.length || 0);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Removed: const response = await travelLogs.like(log._id);
      // Placeholder for like functionality
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error liking travel log:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/logs/${log._id}`);
  };

  // Function to determine the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-image.jpg';
    
    // If it's an Unsplash URL, add size parameters
    if (imagePath.includes('unsplash.com')) {
      // Add size parameters to the URL
      const baseUrl = imagePath.split('?')[0];
      return `${baseUrl}?auto=format&fit=crop&w=800&q=80`;
    }
    
    // If it's already a full URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // For local images, prepend the server URL
    return `http://localhost:5000${imagePath}`;
  };

  const handleImageError = (e) => {
    e.stopPropagation();
    console.error('Image failed to load:', e.target.src);
    setImageError(true);
    e.target.src = '/default-image.jpg';
  };
  
  return (
    <div 
      className="travel-log-card" 
      style={{
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-8px)';
        e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div className="card-image" style={{
        position: 'relative',
        height: '200px',
        overflow: 'hidden'
      }}>
        <img 
          src={getImageUrl(log.image)} 
          alt={log.title || 'Travel Log'}
          onError={handleImageError}
          crossOrigin="anonymous"
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            display: imageError ? 'none' : 'block'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        {imageError && (
          <div className="image-error" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontSize: '0.9rem'
          }}>
            <p>Image not available</p>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
          pointerEvents: 'none'
        }} />
      </div>
      
      <div className="card-content" style={{
        padding: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: '700',
          marginBottom: '0.75rem',
          color: '#2d3748',
          lineHeight: '1.3'
        }}>
          {log.title || 'Untitled Log'}
        </h3>
        
        <p className="location" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#718096',
          fontSize: '0.95rem',
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
          <FaMapMarkerAlt style={{ color: '#667eea' }} />
          {log.location || 'Unknown Location'}
        </p>
        
        <p className="description" style={{
          color: '#4a5568',
          lineHeight: '1.6',
          marginBottom: '1.5rem',
          fontSize: '0.95rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {log.description || 'No description available'}
        </p>
        
        <div className="tags" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          {(log.tags || []).map((tag, index) => (
            <span key={index} className="tag" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '500',
              textTransform: 'lowercase'
            }}>
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="card-footer" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div className="author" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <img
              src={log.author?.profilePicture || '/default-avatar.png'}
              alt={log.author?.username || 'Anonymous'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e2e8f0'
              }}
            />
            <span style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#4a5568'
            }}>
              {log.author?.username || 'Anonymous'}
            </span>
          </div>
          
          <div className="interactions" style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <button
              className={`like-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: liked ? 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)' : 'transparent',
                color: liked ? 'white' : '#718096',
                border: liked ? 'none' : '1px solid #e2e8f0',
                padding: '0.5rem 0.75rem',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!liked) {
                  e.target.style.background = '#f7fafc';
                  e.target.style.borderColor = '#667eea';
                }
              }}
              onMouseLeave={(e) => {
                if (!liked) {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = '#e2e8f0';
                }
              }}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{likesCount}</span>
            </button>
            
            <button 
              className="view-details-btn"
              onClick={handleViewDetails}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FaEye />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelLogCard;
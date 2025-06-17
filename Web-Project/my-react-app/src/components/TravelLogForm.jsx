// components/TravelLogForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaMapMarkerAlt, FaTags } from 'react-icons/fa';

const TravelLogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    tags: '',
    image: null,
    preview: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('image', formData.image);

      await travelLogs.create(formDataToSend);
      navigate('/logs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create travel log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="travel-log-form">
      <h2>Share Your Travel Experience</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>
        
        <div className="form-group with-icon">
          <label htmlFor="location"><FaMapMarkerAlt /> Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group with-icon">
          <label htmlFor="tags"><FaTags /> Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="beach, adventure, hiking"
          />
        </div>
        
        <div className="form-group image-upload">
          <label htmlFor="image"><FaCamera /> Upload Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {formData.preview && (
            <div className="image-preview">
              <img src={formData.preview} alt="Preview" />
            </div>
          )}
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Sharing...' : 'Share Your Journey'}
        </button>
      </form>
    </div>
  );
};

export default TravelLogForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewLog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    tags: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const logData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      // Placeholder for the removed travelLogs.create function
      // await travelLogs.create(logData);
      navigate('/logs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create travel log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-log-page">
      <div className="page-header">
        <h1>Add New Travel Log</h1>
      </div>

      <form onSubmit={handleSubmit} className="travel-log-form">
        {error && <div className="error-message">{error}</div>}
        
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., beach, mountains, city"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Travel Log'}
        </button>
      </form>
    </div>
  );
};

export default NewLog;
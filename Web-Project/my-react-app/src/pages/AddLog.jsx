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

      // Placeholder for the removed travelLogs.create method
      // Replace with actual implementation
      console.log('Travel log data:', logData);
      navigate('/logs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create travel log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .new-log-page {
          background-image: url('https://img.freepik.com/premium-photo/man-stands-cliff-looking-sunset_902049-41947.jpg');
          background-size: cover;
          background-position: center;
          padding: 2rem;
          min-height: 100vh;
          backdrop-filter: blur(4px);
        }

        .page-header h1 {
          color: #fff;
          text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7);
          text-align: center;
          margin-bottom: 2rem;
        }

        .log-form {
          max-width: 600px;
          margin: auto;
          background-color: rgba(255, 255, 255, 0.92);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        @media (prefers-color-scheme: dark) {
          .log-form {
            background-color: rgba(30, 30, 30, 0.9);
            color: #f0f0f0;
          }

          .log-form input,
          .log-form textarea {
            background-color: #333;
            color: #fff;
            border: 1px solid #666;
          }

          .log-form label {
            color: #ccc;
          }
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        input,
        textarea {
          width: 100%;
          padding: 0.7rem;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 1rem;
        }

        textarea {
          min-height: 150px;
          resize: vertical;
        }

        .btn-submit {
          background-color: #0077cc;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        .btn-submit:hover {
          background-color: #005fa3;
        }

        .error-message {
          color: red;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="new-log-page">
        <div className="page-header">
          <h1>Add New Travel Log</h1>
        </div>

        <form onSubmit={handleSubmit} className="log-form">
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

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Travel Log'}
          </button>
        </form>
      </div>
    </>
  );
};

export default NewLog;

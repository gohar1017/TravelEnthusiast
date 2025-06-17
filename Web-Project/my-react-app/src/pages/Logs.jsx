import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TravelLogCard from '../components/TravelLogCard';
import TravelLogSearch from '../components/TravelLogSearch';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filters, setFilters] = useState({});
  const location = useLocation();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Removed: const response = await travelLogs.getAll({ page: currentPage, search: searchTerm, category: selectedCategory, sort: sortBy, ...filters });
      // Placeholder for fetching logs
      const response = { data: [], totalPages: 1 };
      setLogs(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to load travel logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((results) => {
    setFilteredLogs(results);
  }, []);

  const handleSort = (type) => {
    setSortBy(type);
    const sorted = [...filteredLogs].sort((a, b) => {
      if (type === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (type === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (type === 'popular') {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return 0;
    });
    setFilteredLogs(sorted);
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  useEffect(() => {
    if (location.pathname === '/logs') {
      fetchLogs();
    }
  }, [location.pathname]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className={`logs-container`}>
      <style jsx>{`
        .logs-container {
          min-height: 100vh;
          padding: 2rem;
          background: #f8fafc;
          transition: all 0.3s ease;
        }
        
        .logs-container.dark {
          background: #0f172a;
        }
        
        /* Search & Filter Section */
        .search-filter-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        
        .dark .search-filter-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .page-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
          transition: color 0.3s ease;
        }
        
        .dark .page-title {
          color: #f8fafc;
        }
        
        .add-log-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          background: #4f46e5;
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .add-log-btn:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .dark .add-log-btn {
          background: #6366f1;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.3);
        }
        
        .dark .add-log-btn:hover {
          background: #4f46e5;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.5);
        }
        
        /* Filter Sections */
        .filter-section {
          margin: 1.5rem 0;
        }
        
        .filter-label {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #475569;
          transition: color 0.3s ease;
        }
        
        .dark .filter-label {
          color: #94a3b8;
        }
        
        .filter-tags {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        
        .filter-tag {
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-tag:hover {
          background: #e2e8f0;
        }
        
        .dark .filter-tag {
          background: #334155;
          color: #e2e8f8;
        }
        
        .dark .filter-tag:hover {
          background: #475569;
        }
        
        /* Controls Row */
        .controls-row {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .sort-options {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        
        .sort-btn {
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          color: #334155;
          border: none;
          border-radius: 9999px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .sort-btn.active {
          background: #4f46e5;
          color: white;
        }
        
        .dark .sort-btn {
          background: #334155;
          color: #e2e8f8;
        }
        
        .dark .sort-btn.active {
          background: #6366f1;
        }
        
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #4f46e5;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .dark .refresh-btn {
          color: #818cf8;
        }
        
        /* Logs Grid */
        .logs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        
        .no-logs-message {
          text-align: center;
          padding: 3rem;
          color: #64748b;
          font-size: 1.1rem;
        }
        
        .dark .no-logs-message {
          color: #94a3b8;
        }
        
        .show-all-btn {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .show-all-btn:hover {
          background: #4338ca;
        }
        
        .dark .show-all-btn {
          background: #6366f1;
        }
      `}</style>

      <div className="search-filter-card">
        <div className="header-row">
          <h1 className="page-title">Explore Travel Logs</h1>
          <Link to="/logs/new" className="add-log-btn">
            <FaPlus /> Add New Log
          </Link>
        </div>

        <TravelLogSearch logs={logs} onSearch={handleSearch} />

        <div className="filter-section">
          <div className="filter-label">Filter by Tag:</div>
          <div className="filter-tags">
            <div className="filter-tag">All Tags</div>
            {/* Add more tags here */}
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-label">Filter by Location:</div>
          <div className="filter-tags">
            <div className="filter-tag">All Locations</div>
            {/* Add more locations here */}
          </div>
        </div>

        <div className="controls-row">
          <div className="sort-options">
            <button 
              className={`sort-btn ${sortBy === 'newest' ? 'active' : ''}`}
              onClick={() => handleSort('newest')}
            >
              Newest
            </button>
            <button 
              className={`sort-btn ${sortBy === 'oldest' ? 'active' : ''}`}
              onClick={() => handleSort('oldest')}
            >
              Oldest
            </button>
            <button 
              className={`sort-btn ${sortBy === 'popular' ? 'active' : ''}`}
              onClick={() => handleSort('popular')}
            >
              Popular
            </button>
          </div>
          
          <button className="refresh-btn" onClick={handleRefresh}>
            <FaChevronLeft /> Refresh
          </button>
        </div>
      </div>

      {filteredLogs && filteredLogs.length > 0 ? (
        <div className="logs-grid">
          {filteredLogs.map(log => (
            <TravelLogCard key={log._id} log={log} />
          ))}
        </div>
      ) : (
        <div className="no-logs-message">
          <p>No travel logs found matching your criteria</p>
          <button 
            className="show-all-btn" 
            onClick={() => {
              setFilteredLogs(logs);
              setSortBy('newest');
            }}
          >
            Show All Logs
          </button>
        </div>
      )}
    </div>
  );
};


export default Logs;


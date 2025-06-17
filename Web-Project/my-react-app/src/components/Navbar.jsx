import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCompass, FaPlus, FaUser, FaSearch, FaSignOutAlt, FaMoon } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaCompass className="navbar-icon" />
          <span>TravelNetwork</span>
        </Link>
        
        <div className="navbar-links">
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle"
            aria-label="Switch to dark mode"
          >
            <FaMoon />
          </button>
          
          <Link to="/logs" className="navbar-link">
            <FaSearch className="icon" />
            <span>Explore</span>
          </Link>
          
          <Link to="/logs/new" className="navbar-link">
            <FaPlus className="icon" />
            <span>Add Log</span>
          </Link>
          <Link to="/profile" className="navbar-link">
            <FaUser className="icon" />
            <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className="navbar-link logout-btn">
            <FaSignOutAlt className="icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
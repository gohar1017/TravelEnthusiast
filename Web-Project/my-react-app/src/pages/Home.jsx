import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TravelLogCard from '../components/TravelLogCard';
import '../styles/home.css';

const Home = () => {
  const [featuredLogs, setFeaturedLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array of travel images for slideshow
  const slides = [
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ];

  // Function to handle slide transition
  const nextSlide = () =>
    {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    
  };

  const prevSlide = () => 
    {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
   };

  useEffect(() => {
    // Auto-advance slides every 5 seconds
    const slideInterval = setInterval(nextSlide, 5000);

    const fetchFeaturedLogs = async () => {
      try {
        // Placeholder for fetching logs
        setFeaturedLogs([
          { 
            _id: '1', 
            title: 'Amazing Trip to Paris', 
            image: 'https://i.pinimg.com/736x/ba/f9/15/baf91512e81ebebaddede81e434cffd1.jpg',
            location: 'Paris, France',
            description: 'An incredible journey through the City of Light',
            tags: ['paris', 'france', 'travel'],
            author: { username: 'Traveler1', profilePicture: '/default-avatar.png' },
            likes: []
          },
          { 
            _id: '2', 
            title: 'Tokyo Adventure', 
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            location: 'Tokyo, Japan',
            description: 'Exploring the vibrant streets of Tokyo',
            tags: ['tokyo', 'japan', 'adventure'],
            author: { username: 'Traveler2', profilePicture: '/default-avatar.png' },
            likes: []
          },
          { 
            _id: '3', 
            title: 'New York City Experience', 
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            location: 'New York, USA',
            description: 'The city that never sleeps',
            tags: ['newyork', 'usa', 'city'],
            author: { username: 'Traveler3', profilePicture: '/default-avatar.png' },
            likes: []
          },
          { 
            _id: '4', 
            title: 'Santorini Sunset', 
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            location: 'Santorini, Greece',
            description: 'Breathtaking sunsets over the Aegean Sea',
            tags: ['santorini', 'greece', 'sunset'],
            author: { username: 'Traveler4', profilePicture: '/default-avatar.png' },
            likes: []
          }
        ]);
      } catch (err) {
        setError('Failed to load featured logs');
        console.error('Error fetching featured logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedLogs();

    // Cleanup interval on component unmount
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section with Slideshow */}
      <section className="hero-section">
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ 
                backgroundImage: `url(${slide})`,
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out'
              }}
            />
          ))}
        </div>
        <div className="hero-overlay"></div>
        
        {/* Slide Navigation Buttons */}
        <button 
          className="slide-nav prev" 
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>
        <button 
          className="slide-nav next" 
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>

        <div className="hero-content">
          <h1>Share Your Travel Adventures</h1>
          <p>Connect with fellow travelers and discover amazing destinations around the world.</p>
          <div className="hero-buttons">
            <Link to="/logs" className="btn primary">
              <FaCompass /> Explore Logs
            </Link>
            <Link to="/logs/new" className="btn secondary">
              <FaPlus /> Share Your Story
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Logs Section */}
      <div className="featured-logs">
        <h2>Featured Travel Logs</h2>
        {loading ? (
          <div className="loading">Loading featured logs...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="logs-grid">
            {featuredLogs.map(log => (
              <TravelLogCard key={log._id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

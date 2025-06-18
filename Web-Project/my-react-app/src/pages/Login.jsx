import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaSignInAlt, FaUser, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import '../styles/main.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    
    try {
      // Placeholder for the removed auth.login function
      const response = { token: 'placeholder-token', user: { username: 'placeholder-username' } };
      if (response?.token) {
        // Placeholder for the removed login function
        navigate('/', { replace: true });
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        error.request ? 'No response from server' : 
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-page">
      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        
        .login-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          width: 100%;
          max-width: 400px;
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .login-header h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 2rem;
        }
        
        .login-header p {
          color: #666;
          font-size: 0.9rem;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }
        .input-group {
          position: relative;
        }
        .form-input {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }
        .form-input:focus {
          outline: none;
          border-color: #667eea;
        }
        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
        }
        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .remember-me input {
          width: auto;
        }
        .submit-button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .submit-button:hover {
          transform: translateY(-2px);
        }
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .error-message {
          color: #e74c3c;
          text-align: center;
          margin-bottom: 20px;
          padding: 10px;
          background-color: #fdf2f2;
          border-radius: 6px;
          border: 1px solid #fecaca;
        }
        .social-login {
          margin-top: 30px;
          text-align: center;
        }
        .social-login p {
          color: #666;
          margin-bottom: 15px;
        }
        .social-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .social-button {
          padding: 10px 15px;
          border: 1px solid #e1e5e9;
          border-radius: 6px;
          background: white;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .social-button:hover {
          background-color: #f8f9fa;
          border-color: #667eea;
        }
        .register-link {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }
        .register-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to continue your travel journey</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                Login
              </>
            )}
          </button>
        </form>

        <div className="social-login">
          <p>Or continue with:</p>
          <div className="social-buttons">
            <button type="button" className="social-button google-button">
              <FaGoogle />
            </button>
            <button type="button" className="social-button facebook-button">
              <FaFacebook />
            </button>
            <button type="button" className="social-button twitter-button">
              <FaTwitter />
            </button>
          </div>
        </div>

        <div className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

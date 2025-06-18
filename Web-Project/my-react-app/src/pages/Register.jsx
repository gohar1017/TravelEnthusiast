import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/main.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    try {
      // Placeholder for the removed auth.register function
      const response = { data: { token: 'placeholder-token' } };
      if (response.data.token) {
        navigate('/', { replace: true });
      } else {
        setError('Registration failed - no token received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <style jsx>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        .register-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          width: 100%;
          max-width: 400px;
        }
        .register-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .register-header h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 2rem;
        }
        .register-header p {
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
        .login-link {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }
        .login-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join our travel community</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              <FaUser className="input-icon" />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              Email
            </label>
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
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Create a password"
            />
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FaLock className="input-icon" />
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Confirm your password"
            />
            <span 
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <FaUserPlus className="button-icon" />
                Register
              </>
            )}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{' '}
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

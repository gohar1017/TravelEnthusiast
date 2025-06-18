import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Logs from './pages/Logs';
import LogDetail from './pages/LogDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NewLog from './pages/NewLog';
import './styles/main.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/logs/:id" element={<LogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
            
          />
          <Route
            path="/logs/new"
            element={
              <ProtectedRoute>
                <NewLog />
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};


export default App; 

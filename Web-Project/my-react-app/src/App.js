// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Logs from './pages/Logs';
import LogDetail from './pages/LogDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AddLog from './pages/AddLog';
import './styles/main.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <Routes>
          {/* Your routes remain the same */}
          <Route path="/" element={<Home />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/logs/:id" element={<LogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/logs/new" element={<ProtectedRoute><AddLog /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
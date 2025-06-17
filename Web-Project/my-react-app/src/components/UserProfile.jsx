// components/UserProfile.jsx
import React from 'react';
import TravelLogCard from './TravelLogCard';

const UserProfile = ({ user, savedLogs, userLogs }) => {
  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="avatar">
          <img src={user.avatar || '/default-avatar.jpg'} alt={user.name} />
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="bio">{user.bio || 'Travel enthusiast sharing my adventures around the world!'}</p>
          <div className="stats">
            <div className="stat">
              <span className="count">{userLogs.length}</span>
              <span className="label">Logs</span>
            </div>
            <div className="stat">
              <span className="count">42</span>
              <span className="label">Following</span>
            </div>
            <div className="stat">
              <span className="count">128</span>
              <span className="label">Followers</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button className="tab active">My Travel Logs</button>
        <button className="tab">Saved Logs</button>
      </div>
      
      <div className="profile-content">
        <h3>My Travel Logs</h3>
        <div className="logs-grid">
          {userLogs.length > 0 ? (
            userLogs.map(log => (
              <TravelLogCard key={log._id} log={log} />
            ))
          ) : (
            <p className="no-logs">You haven't posted any travel logs yet.</p>
          )}
        </div>
        
        <h3>Saved Travel Logs</h3>
        <div className="logs-grid">
          {savedLogs.length > 0 ? (
            savedLogs.map(log => (
              <TravelLogCard key={log._id} log={log} />
            ))
          ) : (
            <p className="no-logs">You haven't saved any travel logs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
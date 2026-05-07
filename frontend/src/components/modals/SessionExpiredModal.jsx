import React from 'react';
import "./SessionExpiredModal.css";

export default function SessionExpiredModal({ onExtend, onLogout }) {
  return (
    <div className="session-expired-overlay">
      <div className="session-expired-modal">
        <div className="session-expired-content">
          <div className="session-expired-icon">
            <span className="material-icons-sharp">schedule</span>
          </div>
          <h2 className="session-expired-title">Session Expired</h2>
          <p className="session-expired-description">
            Your session has expired due to inactivity.
          </p>
          <p className="session-expired-timeout-info">
            Would you like to continue working or log out?
          </p>
        </div>
        <div className="session-expired-actions">
          <button 
            className="session-expired-btn session-expired-btn-logout" 
            onClick={onLogout}
          >
            <span className="material-icons-sharp">logout</span>
            Logout
          </button>
          <button 
            className="session-expired-btn session-expired-btn-extend" 
            onClick={onExtend}
          >
            <span className="material-icons-sharp">check_circle</span>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
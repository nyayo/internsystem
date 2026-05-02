import React, { useState } from 'react';
import "./StudentFormStyles.css";

export default function SessionExpiredModal({ onExtend, onLogout }) {
  return (
    <div className="student-modal-overlay">
      <div className="student-form-modal" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <div>
            <h2>Session Expiring</h2>
            <p className="modal-subtitle">
              Your session has expired. Would you like to continue?
            </p>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-secondary" onClick={onLogout}>
            <span className="material-icons-sharp">logout</span>
            Logout
          </button>
          <button className="btn-primary" onClick={onExtend}>
            <span className="material-icons-sharp">refresh</span>
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import "./StudentRightPanel.css";

export default function StudentRightPanel({ student }) {
    return (
    <div className="student-right-panel">
      <div className="theme-toggle-section">
        <div className="theme-toggler" onClick={toggleTheme}>
          <span className={`material-icons-sharp ${!isDarkMode ? 'active' : ''}`}>light_mode</span>
          <span className={`material-icons-sharp ${isDarkMode ? 'active' : ''}`}>dark_mode</span>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-photo">
          <img
            src={student.profilePhoto || "/assets/images/profile-1.jpg"}
            alt={`${student.firstName} ${student.lastName}`}
          />
        </div>

        <div className="profile-info">
          <h3 className="student-name">
            {student.firstName} {student.lastName}
          </h3>
          <p className="student-number">{student.studentNumber}</p>

          <div className={`placement-status ${statusInfo.class}`}>
            <span className="material-icons-sharp">{statusInfo.icon}</span>
            <span>{statusInfo.label}</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="material-icons-sharp">school</span>
            <div className="detail-text">
              <span className="label">Programme</span>
              <span className="value">{student.programme}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="material-icons-sharp">calendar_today</span>
            <div className="detail-text">
              <span className="label">Year of Study</span>
              <span className="value">Year {student.yearOfStudy}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="material-icons-sharp">business</span>
            <div className="detail-text">
              <span className="label">Faculty</span>
              <span className="value">{student.faculty}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="material-icons-sharp">apartment</span>
            <div className="detail-text">
              <span className="label">Department</span>
              <span className="value">{student.department}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="material-icons-sharp">email</span>
            <div className="detail-text">
              <span className="label">Email</span>
              <span className="value email">{student.email}</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="material-icons-sharp">phone</span>
            <div className="detail-text">
              <span className="label">Phone</span>
              <span className="value">{student.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <button className="action-btn">
            <span className="material-icons-sharp">help_outline</span>
            <span>Get Help</span>
          </button>
          <button className="action-btn">
            <span className="material-icons-sharp">contact_support</span>
            <span>Contact Supervisor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
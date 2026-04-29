import React from "react";
import "./StudentRightPanel.css";
import { useTheme } from "../../context/ThemeContext";
import CalendarWidget from "./CalendarWidget";


export default function StudentRightPanel({ student, placement }) {
    const { isDarkMode, toggleTheme } = useTheme();

    const placementStatus = placement?.status || "none";

    const getStatusInfo = () => {
    switch (placementStatus) {
      case "draft":
        return { label: "Draft", class: "muted", icon: "edit" };
      case "pending_approval":
        return {
          label: "Pending Approval",
          class: "warning",
          icon: "hourglass_empty",
        };
      case "approved":
        return { label: "Approved", class: "success", icon: "check_circle" };
      case "active":
        return { label: "Active", class: "success", icon: "play_circle" };
      case "completed":
        return { label: "Completed", class: "primary", icon: "verified" };
      case "rejected":
        return { label: "Rejected", class: "danger", icon: "cancel" };
      default:
        return { label: "No Placement", class: "muted", icon: "help_outline" };
    }
  };

  const statusInfo = getStatusInfo();

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
              <span className="label">Univsersity</span>
              <span className="value">{student.university}</span>
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

      {placement &&
        ["approved", "active", "completed"].includes(placement.status) && (
          <CalendarWidget
            startDate={placement.startDate}
            endDate={placement.endDate}
          />
        )}

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
import React, { useState } from "react";
import {
  SupervisorProvider,
  useSupervisor,
} from "../../../context/SupervisorContext";
import AcademicSideBar from "../../../components/supervisor/academic/AcademicSideBar";
import AcademicMainPanel from "../../../components/supervisor/academic/AcademicMainPanel";
import AcademicRightPanel from "../../../components/supervisor/academic/AcademicRightPanel";
import AcademicStudentsPage from "./AcademicStudentsPage";
import AcademicLogsPage from "./AcademicLogsPage";
import AcademicEvaluationsPage from "./AcademicEvaluationsPage";
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router';
import "../../../components/supervisor/shared/SupervisorStyles.css";

const AcademicDashboardContent = () => {
  const [activeLink, setActiveLink] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { stats, notification } = useSupervisor();
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const renderMainContent = () => {
    switch (activeLink) {
      case "students":
        return <AcademicStudentsPage />;
      case "logs":
        return <AcademicLogsPage />;
      case "evaluations":
        return <AcademicEvaluationsPage />;
      case "settings":
        return (
          <main>
            <h1>Settings</h1>
            <p className="welcome-text">
              Configure your preferences and notification settings.
            </p>
            <div
              className="recent-orders"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <span
                className="material-icons-sharp"
                style={{
                  fontSize: "3rem",
                  color: "var(--color-primary)",
                  opacity: 0.5,
                }}
              >
                settings
              </span>
              <p style={{ marginTop: "1rem", color: "var(--color-dark)" }}>
                Settings page coming soon.
              </p>
            </div>
          </main>
        );
      default:
        return <AcademicMainPanel onNavigate={setActiveLink} />;
    }
  };

  return (
    <div className="container">
      <AcademicSideBar
        activeLink={activeLink}
        onLinkClick={setActiveLink}
        pendingLogs={stats.pendingAssessment}
        pendingEvals={stats.pendingAcknowledgement}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
        onLogout={handleLogout}
      />
      {renderMainContent()}
      <AcademicRightPanel onMenuClick={() => setSidebarOpen(true)} />

      {notification && (
        <div className={`supervisor-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

const AcademicDashboard = () => {
  return (
    <SupervisorProvider role="academic_supervisor">
      <AcademicDashboardContent />
    </SupervisorProvider>
  );
};

export default AcademicDashboard;

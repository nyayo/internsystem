import React, { useState } from "react";
import { StudentProvider, useStudent } from "../../context/StudentContext";
import { useNavigate } from "react-router";
import { useNotification } from "../../context/NotificationContext";
import StudentSideBar from "../../components/student/StudentSideBar";
import StudentRightPanel from "../../components/student/StudentRightPanel";
import StudentMainPanel from "../../components/student/StudentMainPanel";
import PlacementApplicationModal from "../../components/modals/PlacementApplicationModal";
import WeeklyLogModal from "../../components/modals/WeeklyLogModal";
import { useAuth } from "../../context/AuthContext";
import "./StudentDashboard.css";

function StudentDashboardContent() {
  const [activeLink, setActiveLink] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const {
    student,
    placement,
    weeklyLogs,
    submitPlacement,
    submitWeeklyLog,
    saveWeeklyLogAsDraft,
  } = useStudent();
  const { showNotification } = useNotification();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (linkId) => {
    setActiveLink(linkId);
    setSidebarOpen(false);

    // Open modals for specific nav items
    if (
      linkId === "placement" &&
      (!placement || placement.status === "draft")
    ) {
      setShowPlacementModal(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNewLog = () => {
    setEditingLog(null);
    setShowLogModal(true);
  };

  const handleEditLog = (log) => {
    setEditingLog(log);
    setShowLogModal(true);
  };

  const handlePlacementSubmit = async (placementData) => {
    await submitPlacement(placementData);
    setShowPlacementModal(false);
    showNotification(
      "Placement application submitted successfully!",
      "success",
    );
  };

  const handleLogSubmit = (logData) => {
    submitWeeklyLog(logData);
    setShowLogModal(false);
    setEditingLog(null);
    showNotification(
      `Week ${logData.weekNumber} log submitted successfully!`,
      "success",
    );
  };

  const handleLogSaveDraft = (logData) => {
    saveWeeklyLogAsDraft(logData);
    setShowLogModal(false);
    setEditingLog(null);
    showNotification(`Week ${logData.weekNumber} log saved as draft`, "info");
  };

  return (
    <div className="student-dashboard">
      <StudentSideBar
        activeLink={activeLink}
        onNavClick={handleNavClick}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        pendingCount={weeklyLogs.filter((l) => l.status === "resubmit").length}
      />

      <StudentMainPanel
        activeLink={activeLink}
        student={student}
        placement={placement}
        weeklyLogs={weeklyLogs}
        onNewLog={handleNewLog}
        onEditLog={handleEditLog}
        onOpenPlacement={() => setShowPlacementModal(true)}
      />

      <StudentRightPanel student={student} placement={placement} />

      {/* Modals */}
      {showPlacementModal && (
        <PlacementApplicationModal
          placement={placement}
          onClose={() => setShowPlacementModal(false)}
          onSubmit={handlePlacementSubmit}
        />
      )}

      {showLogModal && (
        <WeeklyLogModal
          log={editingLog}
          placement={placement}
          onClose={() => {
            setShowLogModal(false);
            setEditingLog(null);
          }}
          onSubmit={handleLogSubmit}
          onSaveDraft={handleLogSaveDraft}
        />
      )}
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <StudentProvider>
      <StudentDashboardContent />
    </StudentProvider>
  );
}

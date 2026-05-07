import React, { useMemo, useState } from "react";
import { StudentProvider, useStudent } from "../../context/StudentContext";
import { useNavigate } from "react-router";
import { useNotification } from "../../context/NotificationContext";
import StudentSideBar from "../../components/student/StudentSideBar";
import StudentRightPanel from "../../components/student/StudentRightPanel";
import StudentMainPanel from "../../components/student/StudentMainPanel";
import PlacementApplicationModal from "../../components/modals/PlacementApplicationModal";
import WeeklyLogModal from "../../components/modals/WeeklyLogModal";
import EvaluationReviewModal from "../../components/modals/EvaluationReviewModal";
import { useAuth } from "../../context/AuthContext";
import { getCurrentWeekNumber, getTotalWeeks } from "../../data/studentDashboardData";
import "./StudentDashboard.css";

function StudentDashboardContent() {
  const [activeLink, setActiveLink] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const {
    student,
    placement,
    weeklyLogs,
    acknowledgedEvaluations,
    isPlacementLoading,
    submitPlacement,
    submitWeeklyLog,
    saveWeeklyLogAsDraft,
  } = useStudent();
  const { showNotification } = useNotification();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPlacement = useMemo(() => {
    if (!placement) return null;

    const normalizeDate = (value) =>
      typeof value === "string" ? value.split("T")[0] : value;

    return {
      ...placement,
      startDate: normalizeDate(placement.startDate),
      endDate: normalizeDate(placement.endDate),
    };
  }, [placement]);

  const handleNavClick = (linkId) => {
    setActiveLink(linkId);
    setSidebarOpen(false);

    // Open modals for specific nav items
    if (
      linkId === "placement" &&
      (!dashboardPlacement || dashboardPlacement.status === "draft")
    ) {
      setShowPlacementModal(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNewLog = () => {
    if (!dashboardPlacement) {
      showNotification("You need an active placement before creating logs.", "warning");
      return;
    }

    const totalWeeks = getTotalWeeks(
      dashboardPlacement.startDate,
      dashboardPlacement.endDate,
    );
    const currentWeek = getCurrentWeekNumber(dashboardPlacement.startDate);
    const allowedWeek = totalWeeks > 0 ? Math.min(Math.max(currentWeek, 0), totalWeeks) : 0;

    if (allowedWeek < 1) {
      showNotification("You can submit logs after your internship starts.", "warning");
      return;
    }

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

  const handleLogSubmit = async (logData) => {
    if (!dashboardPlacement) return;
    const totalWeeks = getTotalWeeks(
      dashboardPlacement.startDate,
      dashboardPlacement.endDate,
    );
    const currentWeek = getCurrentWeekNumber(dashboardPlacement.startDate);
    const allowedWeek = totalWeeks > 0 ? Math.min(Math.max(currentWeek, 0), totalWeeks) : 0;
    const existingLog = weeklyLogs.find((log) => log.id === logData.id);
    const isReturnedLogResubmit = existingLog?.status === "resubmit";

    if (Number(logData.weekNumber) > allowedWeek && !isReturnedLogResubmit) {
      showNotification(
        "You can only submit the current week or overdue weekly logs.",
        "warning",
      );
      return;
    }

    try {
      await submitWeeklyLog(logData);
      setShowLogModal(false);
      setEditingLog(null);
      showNotification(
        `Week ${logData.weekNumber} log submitted successfully!`,
        "success",
      );
    } catch (error) {
      const message =
        error?.response?.data?.detail ??
        "Unable to submit weekly log. Please try again.";
      showNotification(message, "error");
    }
  };

  const handleLogSaveDraft = async (logData) => {
    if (!dashboardPlacement) return;
    const totalWeeks = getTotalWeeks(
      dashboardPlacement.startDate,
      dashboardPlacement.endDate,
    );
    const currentWeek = getCurrentWeekNumber(dashboardPlacement.startDate);
    const allowedWeek = totalWeeks > 0 ? Math.min(Math.max(currentWeek, 0), totalWeeks) : 0;
    const existingLog = weeklyLogs.find((log) => log.id === logData.id);
    const isReturnedLogResubmit = existingLog?.status === "resubmit";

    if (Number(logData.weekNumber) > allowedWeek && !isReturnedLogResubmit) {
      showNotification(
        "You cannot save a draft for a future week log.",
        "warning",
      );
      return;
    }

    try {
      await saveWeeklyLogAsDraft(logData);
      setShowLogModal(false);
      setEditingLog(null);
      showNotification(`Week ${logData.weekNumber} log saved as draft`, "info");
    } catch (error) {
      const message =
        error?.response?.data?.detail ??
        "Unable to save draft. Please try again.";
      showNotification(message, "error");
    }
  };

  const handleViewEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
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
        placement={dashboardPlacement}
        weeklyLogs={weeklyLogs}
        acknowledgedEvaluations={acknowledgedEvaluations}
        isPlacementLoading={isPlacementLoading}
        onNewLog={handleNewLog}
        onEditLog={handleEditLog}
        onOpenPlacement={() => setShowPlacementModal(true)}
        onViewEvaluation={handleViewEvaluation}
      />

      <StudentRightPanel student={student} placement={dashboardPlacement} />

      {/* Modals */}
      {showPlacementModal && (
        <PlacementApplicationModal
          placement={dashboardPlacement}
          onClose={() => setShowPlacementModal(false)}
          onSubmit={handlePlacementSubmit}
        />
      )}

      {showLogModal && (
        <WeeklyLogModal
          log={editingLog}
          placement={dashboardPlacement}
          onClose={() => {
            setShowLogModal(false);
            setEditingLog(null);
          }}
          onSubmit={handleLogSubmit}
          onSaveDraft={handleLogSaveDraft}
        />
      )}

      {selectedEvaluation && (
        <EvaluationReviewModal
          evaluation={selectedEvaluation}
          readOnly
          onAcknowledge={() => {}}
          onClose={() => setSelectedEvaluation(null)}
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

/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useNotification } from "./NotificationContext";
import { useAuth } from "./AuthContext";
import {
  initialPlacements,
  initialEvaluationCriteria,
  initialStudents,
  workplaceSupervisors,
  academicSupervisors,
} from "../data/dashboardData";
import {
  buildAdminStats,
  getDefaultAdminUser,
  toApplicationRows,
  withCriteriaDisplayValues,
} from "../services/adminService";

const AdminContext = createContext(null);

function toPlacementDecision(status) {
  if (status === "approved" || status === "rejected") {
    return status;
  }
  return null;
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [placements, setPlacements] = useState(initialPlacements);
  const [students] = useState(initialStudents);
  const [criteria, setCriteria] = useState(withCriteriaDisplayValues(initialEvaluationCriteria));
  const { showNotification } = useNotification();
  const adminUser = useMemo(() => getDefaultAdminUser(user), [user]);
  const applications = useMemo(() => toApplicationRows(placements), [placements]);
  const { stats, pendingCount } = useMemo(
    () => buildAdminStats(placements, criteria),
    [placements, criteria],
  );

  const handleUpdatePlacement = useCallback((updatedPlacement) => {
    setPlacements((previousPlacements) =>
      previousPlacements.map((placement) =>
        placement.id === updatedPlacement.id ? updatedPlacement : placement,
      ),
    );

    if (updatedPlacement.status === "approved") {
      showNotification(
        `${updatedPlacement.student.name}'s placement has been approved!`,
        "success",
      );
    } else if (updatedPlacement.status === "rejected") {
      showNotification(
        `${updatedPlacement.student.name}'s placement has been rejected.`,
        "danger",
      );
    }
  }, [showNotification]);

  const handleUpdateApplication = useCallback((updatedApp) => {
    const decision = toPlacementDecision(updatedApp.status);
    setPlacements((previousPlacements) =>
      previousPlacements.map((placement) =>
        placement.id === updatedApp.id && decision
          ? { ...placement, status: decision }
          : placement,
      ),
    );

    if (updatedApp.status === "approved") {
      showNotification(
        `${updatedApp.studentName}'s internship has been approved!`,
        "success",
      );
    } else if (updatedApp.status === "rejected") {
      showNotification(
        `${updatedApp.studentName}'s internship has been rejected.`,
        "danger",
      );
    }
  }, [showNotification]);

  const handleAddCriteria = useCallback((newCriteria) => {
    const criteriaWithId = withCriteriaDisplayValues([
      {
        ...newCriteria,
        id: Date.now(),
        isActive: true,
      },
    ])[0];
    setCriteria((previousCriteria) => [...previousCriteria, criteriaWithId]);
    showNotification(
      `Evaluation criteria "${newCriteria.title}" has been created!`,
      "success",
    );
  }, [showNotification]);

  const handleUpdateCriteria = useCallback((updatedCriteria) => {
    const criteriaWithDisplay = withCriteriaDisplayValues([updatedCriteria])[0];
    setCriteria((previousCriteria) =>
      previousCriteria.map((criterion) =>
        criterion.id === updatedCriteria.id
          ? criteriaWithDisplay
          : criterion,
      ),
    );
    showNotification(
      `Evaluation criteria "${updatedCriteria.title}" has been updated!`,
      "success",
    );
  }, [showNotification]);

  const value = useMemo(
    () => ({
      placements,
      setPlacements,
      students,
      criteria,
      setCriteria,
      applications,
      stats,
      pendingCount,
      adminUser,
      workplaceSupervisors,
      academicSupervisors,
      handleUpdatePlacement,
      handleUpdateApplication,
      handleAddCriteria,
      handleUpdateCriteria,
    }),
    [
      placements,
      students,
      criteria,
      applications,
      stats,
      pendingCount,
      adminUser,
      handleUpdatePlacement,
      handleUpdateApplication,
      handleAddCriteria,
      handleUpdateCriteria,
    ],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContext;

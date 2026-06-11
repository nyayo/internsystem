/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useNotification } from "./NotificationContext";
import { useAuth } from "./AuthContext";
import {
  buildAdminStats,
  toApplicationRows,
  withCriteriaDisplayValues,
} from "../services/adminService";
import placementApi from "../services/placementApi";
import adminApi from "../services/adminApi";
import evaluationApi from "../services/evaluationApi";
import {
  normalizePlacement,
  normalizeStudents,
  normalizeWorkplaceSupervisors,
  normalizeAcademicSupervisors,
  normalizeCriteria,
} from "../utils/normalizer";

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
  const [placements, setPlacements] = useState([]);
  const [students, setStudents] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [workplaceSupervisors, setWorkplaceSupervisors] = useState([]);
  const [academicSupervisors, setAcademicSupervisors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();
  const adminUser = useMemo(() => {
    if (user?.role !== "internship_administrator") return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName ?? user.full_name,
      firstName: user.firstName ?? user.first_name,
      lastName: user.lastName ?? user.last_name,
      profilePhoto: user.profilePhoto ?? user.profile_photo,
      phone: user.phone ?? user.phone_number,
      gender: user.gender,
      district: user.district,
      accountStatus: user.accountStatus ?? user.account_status,
      dateJoined: user.dateJoined ?? user.date_joined,
      university: user.university,
      jobTitle: user.job_title,
    };
  }, [user]);
  const applications = useMemo(
    () => toApplicationRows(placements),
    [placements],
  );
  const { stats, pendingCount } = useMemo(
    () => buildAdminStats(placements, criteria),
    [placements, criteria],
  );

  useEffect(() => {
    if (!adminUser) return;
    let cancelled = false;
    (async () => {
      try {
        const raw = await placementApi.listPlacements();
        const rawStudents = await adminApi.listStudents();
        const rawWorkplace = await adminApi.listWorkplaceSupervisor();
        const rawAcademic = await adminApi.listAcademicSupervisor();
        const rawCriteria = await evaluationApi.listCriteria();
        const rows = Array.isArray(raw) ? raw : (raw?.results ?? []);
        const studentRows = Array.isArray(rawStudents)
          ? rawStudents
          : (rawStudents?.results ?? []);
        const workplaceRows = Array.isArray(rawWorkplace)
          ? rawWorkplace
          : (rawWorkplace?.results ?? []);
        const academicRows = Array.isArray(rawAcademic)
          ? rawAcademic
          : (rawAcademic?.results ?? []);
        const criteriaRows = Array.isArray(rawCriteria)
          ? rawCriteria
          : (rawCriteria?.results ?? []);
        const normalized = rows.map(normalizePlacement);
        const normalizedStudents = studentRows.map(normalizeStudents);
        const normalizedWorkplace = workplaceRows.map(
          normalizeWorkplaceSupervisors,
        );
        const normalizedAcademic = academicRows.map(
          normalizeAcademicSupervisors,
        );
        const normalizedCriteria = withCriteriaDisplayValues(
          criteriaRows.map(normalizeCriteria),
        );
        if (!cancelled) setPlacements(normalized);
        if (!cancelled) setStudents(normalizedStudents);
        if (!cancelled) setWorkplaceSupervisors(normalizedWorkplace);
        if (!cancelled) setAcademicSupervisors(normalizedAcademic);
        if (!cancelled) setCriteria(normalizedCriteria);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [adminUser]);

  const handleUpdatePlacement = useCallback(
    async (updatedPlacement) => {
      const payload = {
        status: updatedPlacement.status, // or backend-required key
        workplace_supervisor: updatedPlacement.workplaceSupervisor || null,
        academic_supervisor: updatedPlacement.academicSupervisor || null,
        rejection_reason: updatedPlacement.rejectionReason || "",
      };
      const saved = await placementApi.approvePlacement(
        updatedPlacement.id,
        payload,
      );
      const normalized = normalizePlacement(saved);
      setPlacements((prev) =>
        prev.map((p) => (p.id === normalized.id ? normalized : p)),
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
    },
    [showNotification],
  );

  const handleUpdateApplication = useCallback(
    (updatedApp) => {
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
    },
    [showNotification],
  );

  const handleAddCriteria = useCallback(
    async (newCriteria) => {
      const payload = {
        title: newCriteria.title,
        description: newCriteria.description ?? "",
        category: newCriteria.category,
        max_score: newCriteria.maxScore,
        evaluator_role: newCriteria.evaluatorRole,
        is_active: newCriteria.isActive ?? true,
      };

      const saved = await evaluationApi.createCriteria(payload);
      const criteriaWithDisplay = withCriteriaDisplayValues([
        normalizeCriteria(saved),
      ])[0];
      setCriteria((previousCriteria) => [
        ...previousCriteria,
        criteriaWithDisplay,
      ]);
      showNotification(
        `Evaluation criteria "${criteriaWithDisplay.title}" has been created!`,
        "success",
      );
    },
    [showNotification],
  );

  const handleUpdateCriteria = useCallback(
    async (updatedCriteria) => {
      const payload = {
        title: updatedCriteria.title,
        description: updatedCriteria.description ?? "",
        category: updatedCriteria.category,
        max_score: updatedCriteria.maxScore,
        evaluator_role: updatedCriteria.evaluatorRole,
        is_active: updatedCriteria.isActive ?? true,
      };

      const saved = await evaluationApi.updateCriteria(
        updatedCriteria.id,
        payload,
      );
      const criteriaWithDisplay = withCriteriaDisplayValues([
        normalizeCriteria(saved),
      ])[0];
      setCriteria((previousCriteria) =>
        previousCriteria.map((criterion) =>
          criterion.id === criteriaWithDisplay.id
            ? criteriaWithDisplay
            : criterion,
        ),
      );
      showNotification(
        `Evaluation criteria "${criteriaWithDisplay.title}" has been updated!`,
        "success",
      );
    },
    [showNotification],
  );

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
      workplaceSupervisors,
      academicSupervisors,
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

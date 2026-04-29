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
import placementApi from "../services/placementApi";
import adminApi from "../services/adminApi";

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

  const normalizePlacement = (p) => ({
    id: p.id,
    student: {
      name: p.student_name ?? "-",
      regNumber: p.student_number ?? "-",
      program: p.programme ?? p.student_programme ?? "-",
      email: p.student_email ?? "-",
    },
    organisationName: p.organisation_name,
    organisationType: p.organisation_type,
    organisationDistrict: p.organisation_district,
    organisationAddress: p.organisation_address,
    department: p.department,
    startDate: p.start_date,
    endDate: p.end_date,
    status: p.status,
    intakeCohort: p.intake_cohort,
    remunerationType: p.remuneration_type,
    requestLetter: p.request_letter,
    acceptanceLetter: p.acceptance_letter,
    wpSupervisorName: p.wp_supervisor_name,
    wpSupervisorEmail: p.wp_supervisor_email,
    wpSupervisorPhone: p.wp_supervisor_phone,
    wpSupervisorTitle: p.wp_supervisor_title,
    workplaceSupervisorName: p.workplace_sup_name,
    academicSupervisorName: p.academic_sup_name,
    createdAt: p.created_at ?? null,
  });

  const normalizeStudents = (s) => ({
    id: s.id,
    firstName: s.first_name,
    lastName: s.last_name,
    email: s.email,
    phone: s.phone_number,
    studentName: s.student_number,
    programme: s.programme,
    yearOfStudy: s.year_of_study,
    university: s.university,
    gender: s.gender,
    district: s.district,
    accountStatus: s.account_status,
    dateJoined: s.date_joined,
  });

  const normalizeWorkplaceSupervisors = (w) => ({
    id: w.id,
    firstName: w.first_name,
    lastName: w.last_name,
    name: w.full_name,
    email: w.email,
    phone: w.phone_number,
    organisation: w.organisation_name,
    department: w.department,
    jobTitle: w.job_title,
    gender: w.gender,
    district: w.district,
    accountStatus: w.account_status,
    dateJoined: w.date_joined,
  });

  const normalizeAcademicSupervisors = (a) => ({
    id: a.id,
    firstName: a.firstName,
    lastName: a.last_name,
    name: a.full_name,
    email: a.email,
    phone: a.phone_number,
    university: a.university,
    jobTitle: a.job_title,
    gender: a.gender,
    district: a.district,
    accountStatus: a.account_status,
    dateJoined: a.date_joined,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await placementApi.listPlacements();
        const rawStudents = await adminApi.listStudents();
        const rawWorkplace = await adminApi.listWorkplaceSupervisor();
        const rawAcademic = await adminApi.listAcademicSupervisor();
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
        const normalized = rows.map(normalizePlacement);
        const normalizedStudents = studentRows.map(normalizeStudents);
        const normalizedWorkplace = workplaceRows.map(
          normalizeWorkplaceSupervisors,
        );
        const normalizedAcademic = academicRows.map(
          normalizeAcademicSupervisors,
        );
        if (!cancelled) setPlacements(normalized);
        if (!cancelled) setStudents(normalizedStudents);
        if (!cancelled) setWorkplaceSupervisors(normalizedWorkplace);
        if (!cancelled) setAcademicSupervisors(normalizedAcademic);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    (newCriteria) => {
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
    },
    [showNotification],
  );

  const handleUpdateCriteria = useCallback(
    (updatedCriteria) => {
      const criteriaWithDisplay = withCriteriaDisplayValues([
        updatedCriteria,
      ])[0];
      setCriteria((previousCriteria) =>
        previousCriteria.map((criterion) =>
          criterion.id === updatedCriteria.id ? criteriaWithDisplay : criterion,
        ),
      );
      showNotification(
        `Evaluation criteria "${updatedCriteria.title}" has been updated!`,
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

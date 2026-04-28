/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  studentPlacement,
  studentWeeklyLogs,
  DRAFT_KEYS,
  getDraft,
  saveDraft,
  clearDraft,
} from "../data/studentDashboardData";
import { useAuth } from "./AuthContext";
import {
  createPlacementRecord,
  getLogStats,
  upsertWeeklyLog,
} from "../services/studentService";
import {
  createPlacementDraft,
  listPlacements,
  submitPlacement as submitPlacementApi,
  updatePlacementDraft,
} from "../services/placementApi";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const { user } = useAuth();
  console.log(user);

  const student = useMemo(() => {
    if (user?.role !== "student") return null;

    const year = user.yearOfStudy ?? user.year_of_study;

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
      studentNumber: user.studentNumber ?? user.student_number,
      programme: user.programme,
      yearOfStudy: Number.isNaN(Number(year)) ? year : Number(year), // API sends string
      university: user.university,
    };
  }, [user]);
  const [placement, setPlacement] = useState(studentPlacement);
  const [weeklyLogs, setWeeklyLogs] = useState(studentWeeklyLogs);

  const [placementDraft, setPlacementDraft] = useState(() =>
    getDraft(DRAFT_KEYS.placement),
  );
  const [weeklyLogDraft, setWeeklyLogDraft] = useState(() =>
    getDraft(DRAFT_KEYS.weeklyLog),
  );

  const savePlacementDraft = useCallback(
    async (data) => {
      const form = new FormData();

      const append = (key, value) => {
        if (value !== undefined && value !== null && value !== "") {
          form.append(key, value);
        }
      };

      append("organisation_name", data.organisationName);
      append("organisation_type", data.organisationType);
      append("organisation_district", data.organisationDistrict);
      append("organisation_address", data.organisationAddress);
      append("department", data.department);
      append("start_date", data.startDate);
      append("end_date", data.endDate);
      append("intake_cohort", data.intakeCohort);
      append("remuneration_type", data.remunerationType);
      append("wp_supervisor_email", data.wpSupervisorEmail);
      append("wp_supervisor_phone", data.wpSupervisorPhone);
      append("wp_supervisor_title", data.wpSupervisorTitle);

      if (data.requestLetter instanceof File) {
        form.append("request_letter", data.requestLetter);
      }
      if (data.acceptanceLetter instanceof File) {
        form.append("acceptance_letter", data.acceptanceLetter);
      }

      const saved = placement?.id
        ? await updatePlacementDraft(placement.id, form)
        : await createPlacementDraft(form);

      setPlacement(saved);
      setPlacementDraft(null);
      clearDraft(DRAFT_KEYS.placement);
      return saved;
    },
    [placement?.id],
  );

  const saveWeeklyLogDraft = useCallback((data) => {
    setWeeklyLogDraft(data);
    saveDraft(DRAFT_KEYS.weeklyLog, data);
  }, []);

  const clearPlacementDraft = useCallback(() => {
    setPlacementDraft(null);
    clearDraft(DRAFT_KEYS.placement);
  }, []);

  const clearWeeklyLogDraft = useCallback(() => {
    setWeeklyLogDraft(null);
    clearDraft(DRAFT_KEYS.weeklyLog);
  }, []);

  const submitPlacement = useCallback(
    async (placementData) => {
      const saved = await savePlacementDraft(placementData);
      const submitted = await submitPlacementApi(saved.id); // POST /placements/:id/submit/
      setPlacement(submitted);
      clearPlacementDraft();
      return submitted;
    },
    [savePlacementDraft, clearPlacementDraft],
  );

  const updatePlacement = useCallback((placementData) => {
    setPlacement((previousPlacement) => ({
      ...previousPlacement,
      ...placementData,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const submitWeeklyLog = useCallback(
    (logData) => {
      setWeeklyLogs((previousLogs) =>
        upsertWeeklyLog(previousLogs, logData, "submitted"),
      );
      clearWeeklyLogDraft();
    },
    [clearWeeklyLogDraft],
  );

  const saveWeeklyLogAsDraft = useCallback(
    (logData) => {
      setWeeklyLogs((previousLogs) =>
        upsertWeeklyLog(previousLogs, logData, "draft"),
      );
      clearWeeklyLogDraft();
    },
    [clearWeeklyLogDraft],
  );

  const getLogByWeek = useCallback(
    (weekNumber) => weeklyLogs.find((log) => log.weekNumber === weekNumber),
    [weeklyLogs],
  );

  const getStats = useCallback(() => getLogStats(weeklyLogs), [weeklyLogs]);

  const value = useMemo(
    () => ({
      student,
      placement,
      weeklyLogs,
      placementDraft,
      weeklyLogDraft,
      savePlacementDraft,
      saveWeeklyLogDraft,
      clearPlacementDraft,
      clearWeeklyLogDraft,
      submitPlacement,
      updatePlacement,
      submitWeeklyLog,
      saveWeeklyLogAsDraft,
      getLogByWeek,
      getStats,
    }),
    [
      student,
      placement,
      weeklyLogs,
      placementDraft,
      weeklyLogDraft,
      savePlacementDraft,
      saveWeeklyLogDraft,
      clearPlacementDraft,
      clearWeeklyLogDraft,
      submitPlacement,
      updatePlacement,
      submitWeeklyLog,
      saveWeeklyLogAsDraft,
      getLogByWeek,
      getStats,
    ],
  );

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}

export default StudentContext;

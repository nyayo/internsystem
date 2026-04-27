/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  currentStudent,
  studentPlacement,
  studentWeeklyLogs,
  DRAFT_KEYS,
  getDraft,
  saveDraft,
  clearDraft,
} from "../data/studentDashboardData";
import { useAuth } from "./AuthContext";
import {
  buildStudentProfile,
  createPlacementRecord,
  getLogStats,
  upsertWeeklyLog,
} from "../services/studentService";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const { user } = useAuth();

  const student = useMemo(() => {
   if (user?.role !== "student") return null;
 
   return {
     ...user,
     firstName: user.firstName ?? user.first_name ?? currentStudent.firstName,
     lastName: user.lastName ?? user.last_name ?? currentStudent.lastName,
     studentNumber: user.studentNumber ?? user.student_number ?? currentStudent.studentNumber,
     phone: user.phone ?? user.phone_number ?? currentStudent.phone,
     yearOfStudy: user.yearOfStudy ?? user.year_of_study ?? currentStudent.yearOfStudy,
     accountStatus: user.accountStatus ?? user.account_status ?? currentStudent.accountStatus,
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

  const savePlacementDraft = useCallback((data) => {
    setPlacementDraft(data);
    saveDraft(DRAFT_KEYS.placement, data);
  }, []);

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

  const submitPlacement = useCallback((placementData) => {
    const newPlacement = createPlacementRecord(placementData);
    setPlacement(newPlacement);
    clearPlacementDraft();
    return newPlacement;
  }, [clearPlacementDraft]);

  const updatePlacement = useCallback((placementData) => {
    setPlacement((previousPlacement) => ({
      ...previousPlacement,
      ...placementData,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const submitWeeklyLog = useCallback((logData) => {
    setWeeklyLogs((previousLogs) => upsertWeeklyLog(previousLogs, logData, "submitted"));
    clearWeeklyLogDraft();
  }, [clearWeeklyLogDraft]);

  const saveWeeklyLogAsDraft = useCallback((logData) => {
    setWeeklyLogs((previousLogs) => upsertWeeklyLog(previousLogs, logData, "draft"));
    clearWeeklyLogDraft();
  }, [clearWeeklyLogDraft]);

  const getLogByWeek = useCallback(
    (weekNumber) => weeklyLogs.find((log) => log.weekNumber === weekNumber),
    [weeklyLogs],
  );

  const getStats = useCallback(() => getLogStats(weeklyLogs), [weeklyLogs]);

  const value = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
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

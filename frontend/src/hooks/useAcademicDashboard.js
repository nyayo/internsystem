import {
  academicAssignedStudents,
  academicWeeklyLogs,
  academicEvaluations,
  getAcademicStats,
  getAcademicRecentActivity,
} from "../data/mockData";
import { useState } from "react";

export const useAcademicDashboard = () => {
    const [selectedLog, setSelectedLog] = useState(null);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  return {

    stats: getAcademicStats(),
    students: academicAssignedStudents,
    logs: academicWeeklyLogs,
    evaluations: academicEvaluations,
    activity: getAcademicRecentActivity()
    selectedLog,
    selectedEvaluation,
  };
};
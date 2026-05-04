import { useState } from "react";
import {
  academicAssignedStudents,
  academicWeeklyLogs,
  academicEvaluations,
  getAcademicStats,
  getAcademicRecentActivity,
} from "../data/mockData";


export const useAcademicDashboard = () => {
    const [selectedLog, setSelectedLog] = useState(null);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const openLog = (log) => setSelectedLog(log);
    const closeLog = () => setSelectedLog(null);
    const openEvaluation = (evaluation) => setSelectedEvaluation(evaluation);
    const closeEvaluation = () => setSelectedEvaluation(null);
        
        


  return {

    stats: getAcademicStats(),
    students: academicAssignedStudents,
    logs: academicWeeklyLogs,
    evaluations: academicEvaluations,
    activity: getAcademicRecentActivity()

    selectedLog,
    selectedEvaluation,

    openLog: setSelectedLog
    closeLog: () => setSelectedLog(null),
    
    openEvaluation: setSelectedEvaluation
    closeEvaluation: () => setSelectedEvaluation(null)
    

  };
};
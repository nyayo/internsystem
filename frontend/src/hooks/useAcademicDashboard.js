import {
  academicAssignedStudents,
  academicWeeklyLogs,
  academicEvaluations,
  getAcademicStats,
  getAcademicRecentActivity,
} from "../data/mockData";
export const useAcademicDashboard = () => {
  return {};
};
tats: getAcademicStats(),
    students: academicAssignedStudents,
    logs: academicWeeklyLogs,
    evaluations: academicEvaluations,
    activity: getAcademicRecentActivity(),
  };
};
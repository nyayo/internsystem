import {
  getCategoryDisplay,
  getEvaluatorDisplay,
} from "../data/dashboardData";

function getSupervisorName(supervisors, supervisorId) {
  if (!supervisorId) {
    return "";
  }
  return (
    supervisors.find((supervisor) => supervisor.id === supervisorId)?.name ?? ""
  );
}

function toApplicationStatus(status) {
  return status === "pending_approval" ? "pending" : status;
}

export function withCriteriaDisplayValues(criteria) {
  return criteria.map((item) => ({
    ...item,
    categoryDisplay: getCategoryDisplay(item.category),
    evaluatorDisplay: getEvaluatorDisplay(item.evaluatorRole),
  }));
}

export function toApplicationRows(placements) {
  return placements.map((placement) => ({
    id: placement.id,
    studentName: placement.student.name,
    regNumber: placement.student.regNumber,
    program: placement.student.program,
    workplaceSupervisor: placement.workplaceSupervisorName,
    academicSupervisor: placement.academicSupervisorName,
    status: toApplicationStatus(placement.status),
  }));
}

export function buildAdminStats(placements, criteria) {
  const pendingCount = placements.filter(
    (placement) => placement.status === "pending_approval",
  ).length;

  return {
    stats: {
      pendingApplications: pendingCount,
      activeCriteria: criteria.filter((criterion) => criterion.isActive).length,
    },
    pendingCount,
  };
}

export function getDefaultAdminUser(user) {
  if (user && user.role === "admin") {
    return user;
  }

  return {
    id: 9000,
    firstName: "System",
    lastName: "Admin",
    email: "admin@internship.local",
    role: "admin",
  };
}

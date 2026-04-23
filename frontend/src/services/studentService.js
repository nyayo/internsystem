export function buildStudentProfile(currentStudent, authenticatedUser) {
  if (authenticatedUser && authenticatedUser.role === "student") {
    return {
      ...currentStudent,
      ...authenticatedUser,
    };
  }
  return currentStudent;
}

function nowIso() {
  return new Date().toISOString();
}

export function createPlacementRecord(placementData) {
  const timestamp = nowIso();
  return {
    ...placementData,
    id: Date.now(),
    status: "pending_approval",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function sortLogsByWeek(logs) {
  return [...logs].sort((a, b) => a.weekNumber - b.weekNumber);
}

export function upsertWeeklyLog(logs, logData, status) {
  const timestamp = nowIso();
  const existingLog = logs.find((log) => log.weekNumber === logData.weekNumber);

  if (existingLog) {
    return sortLogsByWeek(
      logs.map((log) =>
        log.weekNumber === logData.weekNumber
          ? {
              ...log,
              ...logData,
              status,
              ...(status === "submitted" ? { submittedAt: timestamp } : {}),
              updatedAt: timestamp,
            }
          : log,
      ),
    );
  }

  const newLog = {
    ...logData,
    id: Date.now(),
    status,
    ...(status === "submitted" ? { submittedAt: timestamp } : {}),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return sortLogsByWeek([...logs, newLog]);
}

export function getLogStats(weeklyLogs) {
  const totalLogs = weeklyLogs.length;
  const submittedLogs = weeklyLogs.filter(
    (log) => log.status !== "draft",
  ).length;
  const assessedLogs = weeklyLogs.filter((log) =>
    ["assessed", "closed"].includes(log.status),
  ).length;
  const pendingLogs = weeklyLogs.filter((log) =>
    ["submitted", "under_review", "endorsed"].includes(log.status),
  ).length;
  const draftLogs = weeklyLogs.filter((log) => log.status === "draft").length;
  const resubmitLogs = weeklyLogs.filter(
    (log) => log.status === "resubmit",
  ).length;

  const averageGrade =
    assessedLogs > 0
      ? weeklyLogs
          .filter((log) => log.academicGrade)
          .reduce((sum, log) => sum + parseFloat(log.academicGrade), 0) /
        assessedLogs
      : null;

  return {
    totalLogs,
    submittedLogs,
    assessedLogs,
    pendingLogs,
    draftLogs,
    resubmitLogs,
    averageGrade: averageGrade ? Math.round(averageGrade * 10) / 10 : null,
  };
}

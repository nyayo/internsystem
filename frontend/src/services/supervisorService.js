export function buildSupervisorProfile(user, role) {
  if (user && user.role === role) {
    return {
      ...user,
    };
  }
}

function nowIso() {
  return new Date().toISOString();
}

function updateById(items, itemId, updateFactory) {
  return items.map((item) => {
    if (item.id !== itemId) {
      return item;
    }
    return updateFactory(item);
  });
}

export function endorseWeeklyLog(logs, logId, comment) {
  return updateById(logs, logId, (log) => ({
    ...log,
    status: "endorsed",
    workplaceComment: comment,
    workplaceEndorsedAt: nowIso(),
  }));
}

export function assessWeeklyLog(logs, logId, grade, comment) {
  return updateById(logs, logId, (log) => ({
    ...log,
    status: "assessed",
    academicComment: comment,
    academicGrade: grade,
    academicAssessedAt: nowIso(),
  }));
}

export function saveEvaluationDraft(evaluations, evaluationId, scores, overallRemarks) {
  return updateById(evaluations, evaluationId, (evaluation) => ({
    ...evaluation,
    status: "in_progress",
    scores,
    overallRemarks,
    updatedAt: nowIso(),
  }));
}

export function submitEvaluation(evaluations, evaluationId, scores, overallRemarks) {
  const totalScore = scores.reduce((sum, score) => sum + (score.scoreAwarded || 0), 0);
  const timestamp = nowIso();
  return updateById(evaluations, evaluationId, (evaluation) => ({
    ...evaluation,
    status: "submitted",
    scores,
    overallRemarks,
    totalScore,
    submittedAt: timestamp,
    updatedAt: timestamp,
  }));
}

export function acknowledgeEvaluation(evaluations, evaluationId, notes, supervisor) {
  const timestamp = nowIso();
  return updateById(evaluations, evaluationId, (evaluation) => ({
    ...evaluation,
    status: "acknowledged",
    acknowledgedBy: `${supervisor.firstName} ${supervisor.lastName}`,
    acknowledgedAt: timestamp,
    acknowledgementNotes: notes,
    updatedAt: timestamp,
  }));
}

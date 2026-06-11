export const normalizePlacement = (p) => ({
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

export const normalizeStudents = (s) => ({
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

export const normalizeWorkplaceSupervisors = (w) => ({
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

export const normalizeAcademicSupervisors = (a) => ({
  id: a.id,
  firstName: a.first_name,
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

export const normalizeCriteria = (item) => ({
  id: item.id,
  title: item.title ?? "",
  description: item.description ?? "",
  category: item.category ?? "",
  maxScore: item.max_score ?? item.maxScore ?? 0,
  evaluatorRole: item.evaluator_role ?? item.evaluatorRole ?? "",
  isActive: item.is_active ?? item.isActive ?? true,
});

export const normalizeWeeklyLog = (log) => ({
  id: log.id,
  placement: log.placement ?? null,
  student: {
    name: log.student_name ?? "-",
    regNumber: log.student_number ?? "-",
    organisation: log.organisation ?? "-",
  },
  weekNumber: log.week_number,
  weekStartDate: log.week_start_date ?? null,
  weekEndDate: log.week_end_date ?? null,
  activitiesPerformed: log.activities_performed ?? "",
  skillsGained: log.skills_gained ?? "",
  challengesFaced: log.challenges_faced ?? "",
  studentRemarks: log.student_remarks ?? "",
  status: log.status ?? "draft",

  workplaceComment: log.workplace_remarks ?? null,
  workplaceEndorsedBy: log.workplace_endorsed_by ?? null,
  workplaceEndorsedByName: log.workplace_endorsed_by_name ?? null,
  workplaceEndorsedAt: log.workplace_endorsed_at ?? null,

  academicComment: log.academic_remarks ?? null,
  academicGrade: log.academic_grade ?? null,
  academicAssessedBy: log.academic_assessed_by ?? null,
  academicAssessedByName: log.academic_assessed_by_name ?? null,
  academicAssessedAt: log.academic_assessed_at ?? null,

  submittedAt: log.submitted_at ?? null,
  createdAt: log.created_at ?? null,
  updatedAt: log.updated_at ?? null,
});

export const normalizeLog = (log) => ({
  id: log.id,
  placement: log.placement ?? null,
  student: {
    name: log.student_name ?? "-",
    regNumber: log.student_number ?? "-",
    organisation: log.organisation ?? "-",
    programme: log.programme ?? "-",
  },
  weekNumber: log.week_number,
  weekStartDate: log.week_start_date ?? null,
  weekEndDate: log.week_end_date ?? null,
  activitiesPerformed: log.activities_performed ?? "",
  skillsGained: log.skills_gained ?? "",
  challengesFaced: log.challenges_faced ?? "",
  studentRemarks: log.student_remarks ?? "",
  status: log.status ?? "draft",

  workplaceComment: log.workplace_remarks ?? null,
  workplaceEndorsedBy: log.workplace_endorsed_by ?? null,
  workplaceEndorsedByName: log.workplace_endorsed_by_name ?? null,
  workplaceEndorsedAt: log.workplace_endorsed_at ?? null,

  academicComment: log.academic_remarks ?? null,
  academicGrade: log.academic_grade ?? null,
  academicAssessedBy: log.academic_assessed_by ?? null,
  academicAssessedByName: log.academic_assessed_by_name ?? null,
  academicAssessedAt: log.academic_assessed_at ?? null,

  submittedAt: log.submitted_at ?? null,
  createdAt: log.created_at ?? null,
  updatedAt: log.updated_at ?? null,
});

export const normalizeEvaluationScore = (score = {}) => ({
  criteriaId: score.criteria ?? score.criteria_id ?? score.criteriaId,
  criteriaTitle:
    score.criteria_title ??
    score.criteria_name ??
    score.criteriaTitle ??
    score.criteria_detail?.title ??
    `Criteria ${score.criteria ?? score.criteria_id ?? score.criteriaId ?? ""}`.trim(),
  maxScore: Number(
    score.max_score ??
      score.maxScore ??
      score.criteria_max_score ??
      score.criteria_detail?.max_score ??
      20,
  ),
  scoreAwarded:
    score.score_awarded !== undefined && score.score_awarded !== null
      ? Number(score.score_awarded)
      : score.scoreAwarded !== undefined && score.scoreAwarded !== null
        ? Number(score.scoreAwarded)
        : null,
  comment: score.comment ?? "",
});

export const normalizeEvaluation = (evaluation = {}, student="", placement = "") => {
  const scoresRaw = Array.isArray(evaluation.scores) ? evaluation.scores : [];
  const scores = scoresRaw.map(normalizeEvaluationScore);
  const totalScoreRaw = evaluation.total_score ?? evaluation.totalScore;
  const totalScore =
    totalScoreRaw === null || totalScoreRaw === undefined || totalScoreRaw === ""
      ? null
      : Number(totalScoreRaw);
  const maxPossibleScore =
    Number(evaluation.max_possible_score ?? evaluation.maxPossibleScore) ||
    scores.reduce((sum, score) => sum + (Number(score.maxScore) || 0), 0);

  return {
    id: evaluation.id,
    studentName: evaluation.student_name ?? student?.fullName ?? "-",
    programme: evaluation.programme ?? student?.programme ?? "-",
    organization:
      evaluation.organisation_name ??
      evaluation.organisation ??
      evaluation.placement_organisation_name ??
      placement?.organisationName ??
      "-",
    workplaceSupervisor:
      evaluation.evaluator_name ??
      evaluation.workplaceSupervisor ??
      placement?.workplaceSupervisorName ??
      "-",
    evaluationType: evaluation.evaluation_type ?? evaluation.evaluationType ?? "",
    evaluationTypeDisplay:
      evaluation.evaluation_type ??
      evaluation.evaluationTypeDisplay ??
      "Evaluation",
    status: evaluation.status ?? "not_started",
    totalScore,
    maxPossibleScore,
    overallRemarks:
      evaluation.overall_remarks ?? evaluation.overallRemarks ?? "",
    scores,
    submittedAt: evaluation.submitted_at ?? evaluation.submittedAt ?? null,
    acknowledgementNotes:
      evaluation.acknowledgement_notes ??
      evaluation.acknowledgementNotes ??
      "",
    acknowledgedBy:
      evaluation.acknowledged_by_name ??
      evaluation.acknowledgedBy ??
      "",
    acknowledgedAt:
      evaluation.acknowledged_at ?? evaluation.acknowledgedAt ?? null,
  };
};

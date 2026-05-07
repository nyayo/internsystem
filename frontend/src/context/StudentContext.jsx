/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
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
import {
  listLogs,
  createLogDraft,
  updateLogDraft,
  endorseLog,
  assessLog,
  listPendingLogs,
  closeLog,
  submitLog,
  getLog,
} from "../services/logsApi";
import {
  listEvaluations,
  getEvaluation as getEvaluationApi,
} from "../services/evaluationApi";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const { user } = useAuth();

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
  const [placement, setPlacement] = useState(null);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [acknowledgedEvaluations, setAcknowledgedEvaluations] = useState([]);

  const [placementDraft, setPlacementDraft] = useState(() =>
    getDraft(DRAFT_KEYS.placement),
  );
  const [weeklyLogDraft, setWeeklyLogDraft] = useState(() =>
    getDraft(DRAFT_KEYS.weeklyLog),
  );

  const [isPlacementLoading, setIsPlacementLoading] = useState(true);

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

  const normalizeWeeklyLog = (log) => ({
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

  const normalizeEvaluationScore = (score = {}) => ({
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

  const normalizeEvaluation = (evaluation = {}) => {
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

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const loadPlacement = async () => {
      try {
        const data = await listPlacements();
        if (cancelled) return;

        const normalized = normalizePlacement(
          Array.isArray(data) ? (data[0] ?? null) : (data ?? null),
        );
        setPlacement(normalized);
      } catch (error) {
        // Log the error but don't crash - let it retry on next load
        if (!cancelled) {
          console.warn("Failed to load placement:", error);
          // Don't clear placement on error - keep previous state
        }
      } finally {
        if (!cancelled) setIsPlacementLoading(false);
      }
    };

    const loadLogs = async () => {
      try {
        const data = await listLogs();
        if (cancelled) return;

        const list = Array.isArray(data) ? data : data ? [data] : [];
        const detailed = await Promise.all(
          list.filter(Boolean).map((item) => getLog(item.id)),
        );
        const normalized = detailed.filter(Boolean).map(normalizeWeeklyLog);

        setWeeklyLogs(normalized);
      } catch (error) {
        // Log the error but don't crash - let it retry on next load
        if (!cancelled) {
          console.warn("Failed to load logs:", error);
          // Don't clear logs on error - keep previous state
        }
      } finally {
        if (!cancelled) setIsPlacementLoading(false);
      }
    };

    const loadAcknowledgedEvaluations = async () => {
      try {
        const raw = await listEvaluations();
        if (cancelled || !raw) return;
        const rows = Array.isArray(raw)
          ? raw
          : (raw?.results ?? raw?.evaluations ?? []);
        const detailedRows = await Promise.all(
          rows
            .filter((row) => row?.id)
            .map(async (row) => (await getEvaluationApi(row.id)) ?? row),
        );
        const normalized = detailedRows
          .filter(Boolean)
          .map(normalizeEvaluation)
          .filter((evaluation) => evaluation.status === "acknowledged");
        if (!cancelled) setAcknowledgedEvaluations(normalized);
      } catch (error) {
        if (!cancelled) {
          console.warn("Failed to load evaluations:", error);
        }
      }
    };

    loadPlacement();
    loadLogs();
    loadAcknowledgedEvaluations();
    return () => {
      cancelled = true;
    };
  }, [user]);

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
      append("wp_supervisor_name", data.wpSupervisorName);
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

  const saveWeeklyLogDraft = useCallback(
    async (data) => {
      if (!placement?.id) {
        throw new Error("No active placement found. Cannot save log.");
      }
      const payload = {};

      const append = (key, value) => {
        if (value !== undefined && value !== null && value !== "") {
          payload[key] = value;
        }
      };

      append("placement", placement.id);
      append("week_number", data.weekNumber);
      append("week_start_date", data.weekStartDate);
      append("week_end_date", data.weekEndDate);
      append("activities_performed", data.activitiesPerformed);
      append("skills_gained", data.skillsGained);
      append("challenges_faced", data.challengesFaced);
      append("student_remarks", data.studentRemarks);

      const saved = data.id
        ? await updateLogDraft(data.id, payload)
        : await createLogDraft(payload);

      const normalized = normalizeWeeklyLog(saved);
      setWeeklyLogs(
        (prev) =>
          prev.some((l) => l.id === normalized.id)
            ? prev.map((l) => (l.id === normalized.id ? normalized : l)) // update existing
            : [...prev, normalized], // add new
      );
      setWeeklyLogDraft(null);
      clearDraft(DRAFT_KEYS.weeklyLog);
      return normalized;
    },
    [placement],
  );

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

  const updatePlacement = savePlacementDraft;

  const submitWeeklyLog = useCallback(
    async (logData) => {
      const saved = await saveWeeklyLogDraft(logData);
      const submitted = await submitLog(saved.id);
      const normalized = normalizeWeeklyLog(submitted);

      setWeeklyLogs((prev) =>
        prev.some((l) => l.id === normalized.id)
          ? prev.map((l) => (l.id === normalized.id ? normalized : l))
          : [...prev, normalized],
      );
      clearWeeklyLogDraft();
      return normalized;
    },
    [saveWeeklyLogDraft, clearWeeklyLogDraft],
  );

  const saveWeeklyLogAsDraft = saveWeeklyLogDraft;

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
      acknowledgedEvaluations,
      isPlacementLoading,
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
      acknowledgedEvaluations,
      isPlacementLoading,
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

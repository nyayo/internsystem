/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { buildSupervisorProfile } from "../services/supervisorService";
import {
  listLogs,
  getLog,
  endorseLog as endorseLogApi,
  assessLog as assessLogApi,
} from "../services/logsApi";
import { listPlacements } from "../services/placementApi";
import { listStudents } from "../services/adminApi";
import {
  listCriteria as listCriteriaApi,
  listEvaluations,
  getEvaluation as getEvaluationApi,
  saveEvaluationDraft as saveEvaluationDraftApi,
  submitEvaluation as submitEvaluationApi,
  acknowledgeEvaluation as acknowledgeEvaluationApi,
} from "../services/evaluationApi";
import {
  normalizeEvaluation,
  normalizeLog,
  normalizeCriteria,
} from "../utils/normalizer";

import { toast } from "react-toastify";

const SupervisorContext = createContext(null);

export const useSupervisor = () => {
  const context = useContext(SupervisorContext);
  if (!context) {
    throw new Error("useSupervisor must be used within a SupervisorProvider");
  }
  return context;
};

const EVALUATION_TYPE_LABELS = {
  midterm: "Midterm Evaluation",
  final: "Final Evaluation",
};

export const SupervisorProvider = ({ children, role }) => {
  const { user } = useAuth();
  const isWorkplace = role === "workplace_supervisor";

  const supervisor = useMemo(
    () => buildSupervisorProfile(user, role),
    [role, user],
  );

  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [criteria, setCriteria] = useState(null);
  const notification = null;

  const stats = useMemo(() => {
    if (isWorkplace) {
      const totalLogs = logs.length;
      const pendingLogs = logs.filter((l) => l.status === "submitted").length;
      const endorsedLogs = logs.filter((l) =>
        ["endorsed", "assessed", "closed"].includes(l.status),
      ).length;
      const resubmitLogs = logs.filter((l) => l.status === "resubmit").length;

      const activeStudents = new Set(
        logs
          .filter((l) => l.status !== "draft")
          .map((l) => l.student?.regNumber),
      ).size;

      return {
        totalStudents: students.length,
        activeStudents,
        pendingLogs,
        endorsedLogs,
        resubmitLogs,
        totalLogs,

        // Percentages
        activeStudentsPercent:
          students.length > 0
            ? Math.round((activeStudents / students.length) * 100)
            : 0,
        endorsedPercent:
          totalLogs > 0 ? Math.round((endorsedLogs / totalLogs) * 100) : 0,
        pendingPercent:
          totalLogs > 0 ? Math.round((pendingLogs / totalLogs) * 100) : 0,
        pendingEvaluations: evaluations.filter((e) =>
          ["not_started", "in_progress"].includes(e.status),
        ).length,
        completedEvaluations: evaluations.filter((e) =>
          ["submitted", "acknowledged"].includes(e.status),
        ).length,
      };
    }

    // Academic supervisor stats
    const pendingAssessment = logs.filter(
      (l) => l.status === "endorsed",
    ).length;
    const assessedLogs = logs.filter((l) =>
      ["assessed", "closed"].includes(l.status),
    ).length;
    const totalAssessable = pendingAssessment + assessedLogs;

    const gradesOnly = logs
      .filter((l) => l.academicGrade !== null && l.academicGrade !== undefined)
      .map((l) => parseFloat(l.academicGrade))
      .filter((g) => !isNaN(g));

    const averageGrade =
      gradesOnly.length > 0
        ? Math.round(
            gradesOnly.reduce((sum, g) => sum + g, 0) / gradesOnly.length,
          )
        : 0;

    return {
      totalStudents: students.length,
      pendingAssessment,
      assessedLogs,
      totalAssessable,
      pendingAcknowledgement: evaluations.filter(
        (e) => e.status === "submitted",
      ).length,

      // Percentages
      assessedPercent:
        totalAssessable > 0
          ? Math.round((assessedLogs / totalAssessable) * 100)
          : 0,
      pendingPercent:
        totalAssessable > 0
          ? Math.round((pendingAssessment / totalAssessable) * 100)
          : 0,
      averageGrade,
    };
  }, [logs, students, evaluations, isWorkplace]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const loadStudents = async () => {
      try {
        const placementList = await listPlacements();
        const studentList = await listStudents();
        if (cancelled || !placementList || !studentList) return;

        const placements = Array.isArray(placementList)
          ? placementList
          : (placementList?.results ?? []);

        const studentRows = Array.isArray(studentList)
          ? studentList
          : (studentList?.results ?? []);

        // Build a student lookup map by id for fast access
        const studentMap = Object.fromEntries(
          studentRows.map((s) => [s.id, s]),
        );

        const enrichedStudents = placements.map((p) => {
          const student = studentMap[p.student] ?? {}; // p.student is the FK id
          return {
            id: p.student,
            placementId: p.id,
            firstName: student.first_name ?? "-",
            lastName: student.last_name ?? "-",
            name:
              student.full_name ??
              `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim(),
            email: student.email ?? "-",
            phone: student.phone_number ?? "-",
            regNumber: student.student_number ?? "-",
            programme: student.programme ?? "-",
            year: student.year_of_study ?? "-",
            gender: student.gender ?? "-",
            // From placement
            weekNumber: p.week_number ?? "-",
            status: p.status ?? "-",
            startDate: p.start_date ?? null,
            endDate: p.end_date ?? null,
            placementStatus: p.status ?? "-",
            department: p.department ?? "-",
            organisation: p.organisation_name ?? "-",
          };
        });

        if (!cancelled) setStudents(enrichedStudents);
      } catch (err) {
        console.error("Failed to load students:", err);
      }
    };

    const loadLogs = async () => {
      try {
        const list = await listLogs();
        if (cancelled || !list) return;

        const detailed = await Promise.all(
          list.filter(Boolean).map((item) => getLog(item.id)),
        );

        if (!cancelled) {
          setLogs(detailed.filter(Boolean).map(normalizeLog));
        }
      } catch (err) {
        console.error("Failed to load logs:", err);
      }
    };

    const loadCriteria = async () => {
      try {
        const raw = await listCriteriaApi();
        if (cancelled || !raw) return;
        const rows = Array.isArray(raw) ? raw : (raw?.results ?? []);
        if (!cancelled) setCriteria(rows.map(normalizeCriteria));
      } catch (err) {
        console.error("Failed to load criteria:", err);
      }
    };

    const loadEvaluations = async () => {
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
        if (!cancelled) {
          setEvaluations(detailedRows.filter(Boolean).map(normalizeEvaluation));
        }
      } catch (err) {
        console.error("Failed to load evaluations:", err);
      }
    };

    Promise.all([
      loadLogs(),
      loadStudents(),
      loadCriteria(),
      loadEvaluations(),
    ]).finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const showNotification = useCallback((message, type = "success") => {
    const text = String(message ?? "").trim();
    if (!text) return;

    if (type === "error" || type === "danger") {
      toast.error(text);
      return;
    }
    if (type === "warning") {
      toast.warn(text);
      return;
    }
    if (type === "info") {
      toast.info(text);
      return;
    }
    toast.success(text);
  }, []);

  const endorseLog = useCallback(
    async (
      logId,
      actionOrRemarks = "endorse",
      workplaceRemarks = "",
      resubmitReason = "",
    ) => {
      const action =
        actionOrRemarks === "endorse" || actionOrRemarks === "return"
          ? actionOrRemarks
          : "endorse";
      const remarks =
        action === "endorse" && actionOrRemarks !== "endorse"
          ? actionOrRemarks
          : workplaceRemarks;

      try {
        const result = await endorseLogApi(
          logId,
          action,
          remarks,
          resubmitReason,
        );
        if (!result) return;

        const updated = await getLog(logId);
        if (!updated) return;

        const normalized = normalizeLog(updated);
        setLogs((prev) =>
          prev.map((l) => (l.id === normalized.id ? normalized : l)),
        );
        const msg =
          action === "endorse"
            ? "Weekly log endorsed successfully!"
            : "Log returned for revision.";
        showNotification(msg, "success");
      } catch (err) {
        const detail =
          err?.response?.data?.detail ??
          err?.response?.data?.resubmit_reason ??
          "Failed to update log. Please try again.";
        showNotification(detail, "error");
        throw err;
      }
    },
    [showNotification],
  );

  const toScorePayload = useCallback(
    (scores = [], { allowIncomplete = false } = {}) =>
      scores
        .filter((score) =>
          allowIncomplete ? score.scoreAwarded !== null : true,
        )
        .map((score) => ({
          criteria: score.criteriaId,
          score_awarded:
            score.scoreAwarded === null || score.scoreAwarded === undefined
              ? undefined
              : Number(score.scoreAwarded),
          ...(score.comment ? { comment: score.comment } : {}),
        }))
        .filter((score) => score.criteria && score.score_awarded !== undefined),
    [],
  );

  const saveEvaluationDraft = useCallback(
    async (evaluationId, scores, overallRemarks) => {
      try {
        const payload = {
          overall_remarks: overallRemarks ?? "",
          scores: toScorePayload(scores, { allowIncomplete: true }),
        };
        await saveEvaluationDraftApi(evaluationId, payload);
        const updated = await getEvaluationApi(evaluationId);
        if (updated) {
          const normalized = normalizeEvaluation(updated);
          setEvaluations((previousEvaluations) =>
            previousEvaluations.map((evaluation) =>
              evaluation.id === normalized.id ? normalized : evaluation,
            ),
          );
        }
        showNotification("Evaluation draft saved!", "info");
      } catch (err) {
        const detail =
          err?.response?.data?.detail ??
          err?.response?.data?.scores ??
          "Failed to save evaluation draft.";
        showNotification(detail, "error");
        throw err;
      }
    },
    [showNotification, toScorePayload],
  );

  const submitEvaluation = useCallback(
    async (evaluationId, scores, overallRemarks) => {
      try {
        const payload = {
          overall_remarks: overallRemarks ?? "",
          scores: toScorePayload(scores, { allowIncomplete: false }),
        };
        await submitEvaluationApi(evaluationId, payload);
        const updated = await getEvaluationApi(evaluationId);
        if (updated) {
          const normalized = normalizeEvaluation(updated);
          setEvaluations((previousEvaluations) =>
            previousEvaluations.map((evaluation) =>
              evaluation.id === normalized.id ? normalized : evaluation,
            ),
          );
        }
        showNotification("Evaluation submitted successfully!", "success");
      } catch (err) {
        const detail =
          err?.response?.data?.detail ??
          err?.response?.data?.scores ??
          "Failed to submit evaluation.";
        showNotification(detail, "error");
        throw err;
      }
    },
    [showNotification, toScorePayload],
  );

  const assessLog = useCallback(
    async (logId, academicGrade, academicRemarks) => {
      try {
        const result = await assessLogApi(
          logId,
          academicGrade,
          academicRemarks,
        );
        if (!result) return;

        const updated = await getLog(logId);
        if (!updated) return;

        const normalized = normalizeLog(updated);
        setLogs((prev) =>
          prev.map((l) => (l.id === normalized.id ? normalized : l)),
        );
        showNotification(`Log assessed — grade: ${result.grade}`, "success");
      } catch (err) {
        const detail =
          err?.response?.data?.detail ??
          err?.response?.data?.academic_grade ??
          err?.response?.data?.academic_remarks ??
          "Failed to assess log. Please try again.";
        showNotification(detail, "error");
        throw err;
      }
    },
    [showNotification],
  );

  const acknowledgeEvaluation = useCallback(
    async (evaluationId, notes) => {
      try {
        await acknowledgeEvaluationApi(evaluationId, {
          acknowledgement_notes: notes ?? "",
        });
        const updated = await getEvaluationApi(evaluationId);
        if (updated) {
          const normalized = normalizeEvaluation(updated);
          setEvaluations((previousEvaluations) =>
            previousEvaluations.map((evaluation) =>
              evaluation.id === normalized.id ? normalized : evaluation,
            ),
          );
        }
        showNotification("Evaluation acknowledged successfully!", "success");
      } catch (err) {
        const detail =
          err?.response?.data?.detail ??
          err?.response?.data?.acknowledgement_notes ??
          "Failed to acknowledge evaluation.";
        showNotification(detail, "error");
        throw err;
      }
    },
    [showNotification],
  );

  const value = useMemo(
    () => ({
      supervisor,
      students,
      logs,
      evaluations,
      criteria,
      stats,
      notification,
      isWorkplace,
      showNotification,
      endorseLog,
      saveEvaluationDraft,
      submitEvaluation,
      assessLog,
      acknowledgeEvaluation,
    }),
    [
      supervisor,
      students,
      logs,
      evaluations,
      criteria,
      stats,
      notification,
      isWorkplace,
      showNotification,
      endorseLog,
      saveEvaluationDraft,
      submitEvaluation,
      assessLog,
      acknowledgeEvaluation,
    ],
  );

  return (
    <SupervisorContext.Provider value={value}>
      {children}
    </SupervisorContext.Provider>
  );
};

export default SupervisorContext;

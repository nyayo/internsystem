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
  currentWorkplaceSupervisor,
  currentAcademicSupervisor,
  workplaceAssignedStudents,
  academicAssignedStudents,
  workplaceWeeklyLogs,
  academicWeeklyLogs,
  workplaceEvaluations,
  academicEvaluations,
  evaluationCriteria,
} from "../data/supervisorData";
import { useAuth } from "./AuthContext";
import {
  acknowledgeEvaluation as acknowledgeEvaluationInList,
  assessWeeklyLog,
  buildSupervisorProfile,
  endorseWeeklyLog,
  saveEvaluationDraft as saveEvaluationDraftInList,
  submitEvaluation as submitEvaluationInList,
} from "../services/supervisorService";
import {
  listLogs,
  getLog,
  endorseLog as endorseLogApi,
  assessLog as assessLogApi,
} from "../services/logsApi";
import { listPlacements } from "../services/placementApi";
import { listStudents } from "../services/adminApi";

const SupervisorContext = createContext(null);

export const useSupervisor = () => {
  const context = useContext(SupervisorContext);
  if (!context) {
    throw new Error("useSupervisor must be used within a SupervisorProvider");
  }
  return context;
};

const normalizeLog = (log) => ({
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
  const [criteria] = useState(evaluationCriteria);
  const [notification, setNotification] = useState(null);

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
  }, [logs, students, isWorkplace]);

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
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadLogs();
    loadStudents();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
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

  const saveEvaluationDraft = useCallback(
    (evaluationId, scores, overallRemarks) => {
      setEvaluations((previousEvaluations) =>
        saveEvaluationDraftInList(
          previousEvaluations,
          evaluationId,
          scores,
          overallRemarks,
        ),
      );
      showNotification("Evaluation draft saved!", "info");
    },
    [showNotification],
  );

  const submitEvaluation = useCallback(
    (evaluationId, scores, overallRemarks) => {
      setEvaluations((previousEvaluations) =>
        submitEvaluationInList(
          previousEvaluations,
          evaluationId,
          scores,
          overallRemarks,
        ),
      );
      showNotification("Evaluation submitted successfully!", "success");
    },
    [showNotification],
  );

  const assessLog = useCallback(
    async (logId, grade, comment) => {
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
          "Failed to assess log. Please try again.";
        showNotification(detail, "error");
        throw err;
      }
    },
    [showNotification],
  );

  const acknowledgeEvaluation = useCallback(
    (evaluationId, notes) => {
      setEvaluations((previousEvaluations) =>
        acknowledgeEvaluationInList(
          previousEvaluations,
          evaluationId,
          notes,
          supervisor,
        ),
      );
      showNotification("Evaluation acknowledged successfully!", "success");
    },
    [showNotification, supervisor],
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

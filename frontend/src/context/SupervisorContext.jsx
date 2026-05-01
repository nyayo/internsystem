/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
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
  getWorkplaceStats,
  getAcademicStats,
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
  const [logs, setLogs] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [criteria] = useState(evaluationCriteria);
  const [notification, setNotification] = useState(null);

  const stats = useMemo(
    () => (isWorkplace ? getWorkplaceStats() : getAcademicStats()),
    [isWorkplace],
  );

  useEffect(() => {
    let cancelled = false;

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
    return () => {
      cancelled = true;
    };
  }, []);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const endorseLog = useCallback(
    async (logId, comment) => {
      try {
        const updated = await endorseLogApi(logId);
        if (!updated) return;

        const normalized = normalizeLog(updated);
        setLogs((prev) =>
          prev.map((l) => (l.id === normalized.id ? normalized : l)),
        );
        showNotification("Weekly log endorsed successfully!", "success");
      } catch (err) {
        console.error("Endorse log failed:", err);
        showNotification("Failed to endorse log. Please try again.", "error");
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
        // Pass grade/comment if the API accepts a body, e.g.:
        // assessLogApi(logId, { academic_grade: grade, academic_remarks: comment })
        const updated = await assessLogApi(logId);
        if (!updated) return;

        const normalized = normalizeLog(updated);
        setLogs((prev) =>
          prev.map((l) => (l.id === normalized.id ? normalized : l)),
        );
        showNotification("Weekly log assessed successfully!", "success");
      } catch (err) {
        console.error("Assess log failed:", err);
        showNotification("Failed to assess log. Please try again.", "error");
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

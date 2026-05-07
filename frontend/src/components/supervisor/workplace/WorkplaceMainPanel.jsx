import React, { useMemo } from "react";
import { useSupervisor } from "../../../context/SupervisorContext";
import "../shared/SupervisorStyles.css";

const WorkplaceMainPanel = ({ onNavigate }) => {
  const { supervisor, logs, evaluations, stats } = useSupervisor();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const actionRequired = useMemo(() => {
    const pendingLogActions = logs
      .filter((log) => ["submitted", "resubmit"].includes(log.status))
      .map((log) => ({
        key: `log-${log.id}`,
        type: "log",
        studentName: log.student?.name ?? "-",
        organization: log.student?.organisation ?? "-",
        details:
          log.status === "submitted"
            ? `Week ${log.weekNumber} pending endorsement`
            : `Week ${log.weekNumber} resubmitted and pending review`,
        action: "Review Log",
        sortDate: log.submittedAt ?? log.updatedAt ?? log.createdAt ?? "",
      }));

    const pendingEvaluationActions = evaluations
      .filter((evaluation) =>
        ["not_started", "in_progress"].includes(evaluation.status),
      )
      .map((evaluation) => ({
        key: `evaluation-${evaluation.id}`,
        type: "evaluation",
        studentName: evaluation.studentName ?? "-",
        organization: evaluation.organization ?? "-",
        details:
          evaluation.status === "in_progress"
            ? `${evaluation.evaluationTypeDisplay ?? "Evaluation"} in progress`
            : `${evaluation.evaluationTypeDisplay ?? "Evaluation"} ready to start`,
        action:
          evaluation.status === "in_progress"
            ? "Continue Evaluation"
            : "Start Evaluation",
        sortDate: evaluation.dueDate ?? evaluation.updatedAt ?? "",
      }));

    return [...pendingLogActions, ...pendingEvaluationActions]
      .sort((a, b) => {
        const aTime = a.sortDate ? new Date(a.sortDate).getTime() : 0;
        const bTime = b.sortDate ? new Date(b.sortDate).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 6);
  }, [logs, evaluations]);

  return (
    <main>
      <h1>Supervisor Dashboard</h1>
      <p className="welcome-text">
        {getGreeting()}, {supervisor.firstName}! You have {stats.pendingLogs}{" "}
        logs to endorse and {stats.pendingEvaluations} evaluations pending.
      </p>

      {/* Stats Cards - using admin insight cards pattern */}
      <div className="insights">
        <div className="pending">
          <span className="material-icons-sharp">school</span>
          <div className="middle">
            <div className="left">
              <h3>Assigned Students</h3>
              <h1>{stats.totalStudents}</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>{stats.activeStudentsPercent}%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Currently Supervising</small>
        </div>

        <div className="active">
          <span className="material-icons-sharp">pending_actions</span>
          <div className="middle">
            <div className="left">
              <h3>Logs to Endorse</h3>
              <h1>{stats.pendingLogs}</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>{stats.pendingPercent}%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Awaiting Endorsement</small>
        </div>

        <div className="completed">
          <span className="material-icons-sharp">rate_review</span>
          <div className="middle">
            <div className="left">
              <h3>Evaluations</h3>
              <h1>{stats.pendingEvaluations}</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>{stats.completedEvaluations} done</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Pending Completion</small>
        </div>
      </div>

      {/* Recent Activity Table - using admin table pattern */}
      <div className="recent-orders">
        <h2>Action Required</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Student</th>
              <th>Organization</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {actionRequired.length > 0 ? (
              actionRequired.map((item) => (
                <tr key={item.key}>
                  <td>
                    <span className={item.type === "log" ? "primary" : "warning"}>
                      {item.type === "log" ? "Weekly Log" : "Evaluation"}
                    </span>
                  </td>
                  <td>{item.studentName}</td>
                  <td>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-info-dark)" }}>
                      {item.organization}
                    </span>
                  </td>
                  <td>{item.details}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() =>
                        onNavigate(item.type === "log" ? "logs" : "evaluations")
                      }
                    >
                      {item.action}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <span
                    className="material-icons-sharp"
                    style={{ fontSize: "2rem", color: "var(--color-success)" }}
                  >
                    task_alt
                  </span>
                  <p style={{ marginTop: "0.5rem" }}>
                    All caught up! No pending actions.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("logs");
          }}
        >
          View All Logs
        </a>
      </div>
    </main>
  );
};

export default WorkplaceMainPanel;

import React, { useMemo } from "react";
import { useSupervisor } from "../../../context/SupervisorContext";
import {
  getWorkplaceRecentActivity,
  formatDate,
} from "../../../data/supervisorData";
import "../shared/SupervisorStyles.css";

const WorkplaceMainPanel = ({ onNavigate }) => {
  const { supervisor, logs, isLoading } = useSupervisor();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const stats = useMemo(() => {
    const pendingLogs = logs.filter((l) => l.status === "submitted").length;
    const endorsedLogs = logs.filter((l) =>
      ["endorsed", "assessed", "closed"].includes(l.status),
    ).length;
    const resubmitLogs = logs.filter((l) => l.status === "resubmit").length;
    const uniqueStudents = new Set(logs.map((l) => l.student?.regNumber)).size;

    return {
      pendingLogs,
      endorsedLogs,
      resubmitLogs,
      totalStudents: uniqueStudents,
    };
  }, [logs]);

  const actionRequired = useMemo(() => {
    return logs
      .filter((l) => ["submitted", "resubmit"].includes(l.status))
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
  }, [logs]);

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
                <p>100%</p>
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
                <p>{stats.pendingLogs > 0 ? "Action" : "0%"}</p>
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
              <th>Details</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {actionRequired.length > 0 ? (
              actionRequired.map((log) => (
                <tr key={log.id}>
                  <td>{log.student?.name ?? "-"}</td>
                  <td>Week {log.weekNumber}</td>
                  <td>
                    {formatDate(log.weekStartDate)} →{" "}
                    {formatDate(log.weekEndDate)}
                  </td>
                  <td>
                    <span
                      className={
                        log.status === "submitted" ? "primary" : "warning"
                      }
                    >
                      {log.status === "submitted"
                        ? "Pending Review"
                        : "Resubmitted"}
                    </span>
                  </td>
                  <td>{log.submittedAt ? formatDate(log.submittedAt) : "-"}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => onNavigate("logs")}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
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

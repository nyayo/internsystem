import React from "react";
import "./RightPanel.css";
import { useTheme } from "../../context/ThemeContext";

export default function RightPanel({
  onMenuClick,
  stats,
  admin,
  workplaceSupervisors = [],
  academicSupervisors = [],
}) {
  const { isDarkMode, toggleTheme } = useTheme();
  const safeAdmin = admin ?? {
    fullName: "Administrator",
    jobTitle: "Internship Administrator",
    firstName: "A",
    lastName: "D",
  };

  const workplaceTotal = workplaceSupervisors.length;
  const academicTotal = academicSupervisors.length;
  const workplaceActive = workplaceSupervisors.filter(
    (item) => item.accountStatus === "active",
  ).length;
  const academicActive = academicSupervisors.filter(
    (item) => item.accountStatus === "active",
  ).length;
  const activeCriteria = Number(stats?.activeCriteria ?? 0);

  return (
    <div className="right">
      <div className="top">
        <button onClick={onMenuClick}>
          <span className="material-icons-sharp">menu</span>
        </button>
        <div className="theme-toggler" onClick={toggleTheme}>
          <span
            className={`material-icons-sharp ${!isDarkMode ? "active" : ""}`}
          >
            light_mode
          </span>
          <span
            className={`material-icons-sharp ${isDarkMode ? "active" : ""}`}
          >
            dark_mode
          </span>
        </div>
        <div className="profile">
          <div className="info">
            <p>
              Hey, <b>{safeAdmin.fullName}</b>
            </p>
            <small className="text-muted">{safeAdmin.jobTitle}</small>
          </div>
          <div className="profile-photo">
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "var(--color-primary)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
                fontSize: "0.9rem",
              }}
            >
              {safeAdmin.firstName.split(" ").pop().charAt(0).toUpperCase()}
              {safeAdmin.lastName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="analytics">
        <h2>Supervisors Overview</h2>
        <div className="item online">
          <div className="icon">
            <span className="material-icons-sharp">work</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Workplace Supervisors</h3>
              <small className="text-muted">Industry professionals</small>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <h5 className={workplaceTotal ? "success" : "danger"}>
                {workplaceActive}/{workplaceTotal} active
              </h5>
              <h3>{workplaceTotal}</h3>
            </div>
          </div>
        </div>
        <div className="item offline">
          <div className="icon">
            <span className="material-icons-sharp">school</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Academic Supervisors</h3>
              <small className="text-muted">Faculty members</small>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <h5 className={academicTotal ? "success" : "danger"}>
                {academicActive}/{academicTotal} active
              </h5>
              <h3>{academicTotal}</h3>
            </div>
          </div>
        </div>
        <div className="item customers">
          <div className="icon">
            <span className="material-icons-sharp">fact_check</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Active Criteria</h3>
              <small className="text-muted">Evaluation metrics</small>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <h5 className={activeCriteria > 0 ? "success" : "danger"}>
                {activeCriteria} total
              </h5>
              <h3>{activeCriteria > 0 ? "Live" : "0"}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

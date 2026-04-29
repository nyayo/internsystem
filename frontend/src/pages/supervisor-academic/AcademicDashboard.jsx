import React from "react";
import AcademicStats from "../components/AcademicStats";
import AcademicStudentsTable from "../components/AcademicStudentsTable";
import AcademicLogsTable from "../components/AcademicLogsTable";
import AcademicEvaluationsTable from "../components/AcademicEvaluationsTable";
import RecentActivity from "../components/RecentActivity";

export default function AcademicDashboard() {
  return (
    <div className="dashboard">
      <h2>Academic Supervisor Dashboard</h2>
       <div className="stats-section"></div>
      <div className="activity-section"></div>
      <div className="students-section"></div>
      <div className="logs-section"></div>
      <div className="evaluations-section"></div>
    </div>
  );
}
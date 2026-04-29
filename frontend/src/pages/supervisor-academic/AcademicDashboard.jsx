import React from "react";
import AcademicStats from "../components/AcademicStats";
import AcademicStudentsTable from "../components/AcademicStudentsTable";
import AcademicLogsTable from "../components/AcademicLogsTable";
import AcademicEvaluationsTable from "../components/AcademicEvaluationsTable";
import RecentActivity from "../components/RecentActivity";
import { useAcademicDashboard } from "../hooks/useAcademicDashboard";


export default function AcademicDashboard() {
    const {
    stats,
    students,
    logs,
    evaluations,
    activity,
    selectedLog,
    selectedEvaluation,
    openLog,
    closeLog,
    openEvaluation,
    closeEvaluation,   
  } = useAcademicDashboard();
  return (
    <div className="dashboard">
      <h2>Academic Supervisor Dashboard</h2>
       <div className="stats-section">
        <AcademicStats stats={stats} />
      </div>
        
      
      <div className="activity-section">
        <RecentActivity activity={activity} />
      </div>
        
      
      <div className="students-section"></div>
      <div className="students-table">
        <AcademicStudentsTable students={students} />
      </div>    
      <div className="logs-section">
        <AcademicLogsTable logs={logs} />
      </div>
      <div className="evaluations-section">
        <AcademicEvaluationsTable evaluations={evaluations}
        onView={openEvaluation} />
      </div>
    </div>
  );
}
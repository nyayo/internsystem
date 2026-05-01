export default function AcademicStats({ stats }) {
  return(
     <div className="stats">
         <div>Total Students: {stats.totalStudents}</div>
      <div>Pending Assessment: {stats.pendingAssessment}</div>
      <div>Assessed Logs: {stats.assessedLogs}</div>

  </div>
);
}
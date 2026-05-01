export default function AcademicStats({ stats }) {
      if (!stats) return null;

  return(
     <div className="stats">
      <div>Total Students: {stats.totalStudents}</div>
      <div>Pending Assessment: {stats.pendingAssessment}</div>
      <div>Assessed Logs: {stats.assessedLogs}</div>
      <div>Pending Acknowledgement: {stats.pendingAcknowledgement}</div>
      <div>Avg Grade: {stats.averageGrade}</div>

  </div>
);
}
import React from 'react';

const WeeklyLogs = ({ logs }) => {
  return (
    <div className="weekly-logs">
      <h3>Weekly Logs</h3>
      {logs.map(log => (
        <div key={log.id} className="log-entry">
          <h4>Week {log.weekNumber}</h4>
          <p>Activities: {log.activitiesPerformed}</p>
          <p>Skills: {log.skillsGained}</p>
          <p>Status: {log.status}</p>
          {log.academicGrade && <p>Grade: {log.academicGrade}</p>}
        </div>
      ))}
    </div>
  );
};

export default WeeklyLogs;
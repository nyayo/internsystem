import React, { useMemo } from 'react';
import { 
  calculateInternshipProgress, 
  getCurrentWeekNumber, 
  getTotalWeeks
} from '../../data/studentDashboardData';
import './ProgressTracker.css';
export default function ProgressTracker({ placement, weeklyLogs }) {
  const progress = useMemo(() => {
    return calculateInternshipProgress(placement.startDate, placement.endDate);
  }, [placement.startDate, placement.endDate]);
  
  const totalWeeks = useMemo(() => {
    return getTotalWeeks(placement.startDate, placement.endDate);
  }, [placement.startDate, placement.endDate]);

  const currentWeek = useMemo(() => {
    const week = getCurrentWeekNumber(placement.startDate);
    return totalWeeks > 0 ? Math.min(week, totalWeeks) : week;
  }, [placement.startDate, totalWeeks]);
  const logsStats = useMemo(() => {
    const submitted = weeklyLogs.filter(log => log.status !== 'draft').length;
    const assessed = weeklyLogs.filter(log => ['assessed', 'closed'].includes(log.status)).length;
    const pending = weeklyLogs.filter(log => ['submitted', 'under_review', 'endorsed'].includes(log.status)).length;
    const requiresAction = weeklyLogs.filter(log => log.status === 'resubmit').length;
    
    return { submitted, assessed, pending, requiresAction };
  }, [weeklyLogs]);
  const milestones = [
    { week: 1, label: 'Start', icon: 'flag', completed: currentWeek >= 1 },
    { week: Math.ceil(totalWeeks / 2), label: 'Midterm', icon: 'hourglass_bottom', completed: currentWeek >= Math.ceil(totalWeeks / 2) },
    { week: totalWeeks, label: 'End', icon: 'emoji_events', completed: currentWeek >= totalWeeks },
  ];
  
  return (
    <div className="progress-tracker">
      <div className="tracker-header">
        <h3>Internship Progress</h3>
        <span className="week-indicator">Week {currentWeek} of {totalWeeks}</span>
      </div>
      <div className="progress-section">
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <span className="progress-percentage">{progress}%</span>
        </div>
        {/* Milestones */}
        <div className="milestones">
          {milestones.map((milestone, index) => (
            <div 
              key={index} 
              className={`milestone ${milestone.completed ? 'completed' : ''}`}
              style={{ left: `${totalWeeks > 0 ? (milestone.week / totalWeeks) * 100 : 0}%` }}
            >
              <div className="milestone-dot">
                <span className="material-icons-sharp">{milestone.icon}</span>
              </div>
              <span className="milestone-label">{milestone.label}</span>
            </div>
          ))}
        </div>
      </div>
     { /* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon logs">
            <span className="material-icons-sharp">edit_note</span>
          </div>
          <div className="stat-info">
            <span className="stat-value">{logsStats.submitted}</span>
            <span className="stat-label">Logs Submitted</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon assessed">
            <span className="material-icons-sharp">grading</span>
          </div>
          <div className="stat-info">
            <span className="stat-value">{logsStats.assessed}</span>
            <span className="stat-label">Logs Assessed</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <span className="material-icons-sharp">pending_actions</span>
          </div>
          <div className="stat-info">
            <span className="stat-value">{logsStats.pending}</span>
            <span className="stat-label">Pending Review</span>
          </div>
        </div>
        {logsStats.requiresAction > 0 && (
          <div className="stat-card alert">
            <div className="stat-icon action">
              <span className="material-icons-sharp">warning</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{logsStats.requiresAction}</span>
              <span className="stat-label">Needs Resubmission</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

            
        
  

import React, { useMemo } from 'react';
import { 
  calculateInternshipProgress, 
  getCurrentWeekNumber, 
  getTotalWeeks
} from '../../data/studentDashboardData';
import './ProgressTracker.csss';
export default function ProgressTracker({ placement, weeklyLogs }) {
  const progress = useMemo(() => {
    return calculateInternshipProgress(placement.startDate, placement.endDate);
  }, [placement.startDate, placement.endDate]);
  
  const currentWeek = useMemo(() => {
    return getCurrentWeekNumber(placement.startDate);
  }, [placement.startDate]);
  
  const totalWeeks = useMemo(() => {
    return getTotalWeeks(placement.startDate, placement.endDate);
  }, [placement.startDate, placement.endDate]);
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
  
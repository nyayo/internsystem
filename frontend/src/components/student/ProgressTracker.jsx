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
  
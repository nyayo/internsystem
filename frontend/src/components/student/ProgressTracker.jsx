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
  
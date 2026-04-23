import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import ProgressTracker from './ProgressTracker';
import WeeklyLogsTable from './WeeklyLogsTable';
import './StudentMainPanel.css';

export default function StudentMainPanel({ 
  activeLink, 
  student, 
  placement, 
  weeklyLogs, 
  onNewLog, 
  onEditLog,
  onOpenPlacement 
}) {
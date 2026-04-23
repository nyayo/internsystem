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
    const hasActivePlacement = placement && ['approved', 'active', 'completed'].includes(placement.status);
  const hasPendingPlacement = placement && placement.status === 'pending_approval';
  const hasDraftPlacement = placement && placement.status === 'draft';
  const hasNoPlacement = !placement || placement.status === 'rejected';
  
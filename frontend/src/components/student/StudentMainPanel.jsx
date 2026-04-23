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
  return (
    <main className="student-main-panel">
      {/* Welcome Banner - Always shown on dashboard */}
      {activeLink === 'dashboard' && (
        <>
          <WelcomeBanner 
            student={student} 
            placement={placement}
            onOpenPlacement={onOpenPlacement}
          />
          {hasActivePlacement && (
            <>
              <ProgressTracker 
                placement={placement}
                weeklyLogs={weeklyLogs}
              />
              
              <WeeklyLogsTable 
                weeklyLogs={weeklyLogs}
                placement={placement}
                onNewLog={onNewLog}
                onEditLog={onEditLog}
                showTitle
                limit={5}
              />
            </>
          )}
          {hasPendingPlacement && (
            <div className="status-card pending">
              <span className="material-icons-sharp">hourglass_top</span>
              <div className="status-content">
                <h3>Placement Under Review</h3>
                <p>Your placement application is currently being reviewed by the internship administrator. You will be notified once a decision is made.</p>
                <button className="btn-secondary" onClick={onOpenPlacement}>
                  View Application
                </button>
              </div>
            </div>
          )}
  
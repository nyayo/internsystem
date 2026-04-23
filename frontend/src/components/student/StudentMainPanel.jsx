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
          {(hasNoPlacement || hasDraftPlacement) && (
            <div className="status-card no-placement">
              <span className="material-icons-sharp">add_business</span>
              <div className="status-content">
                <h3>Submit Your Placement Application</h3>
                <p>You haven't submitted an internship placement application yet. Start by providing details about your internship organisation.</p>
                <button className="btn-primary" onClick={onOpenPlacement}>
                  {hasDraftPlacement ? 'Continue Application' : 'Apply Now'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
      /* Weekly Logs Page */}
      {activeLink === 'logs' && (
        <div className="page-section">
          <div className="section-header">
            <div>
              <h2>Weekly Logs</h2>
              <p className="subtitle">Document your weekly activities and progress</p>
            </div>
  
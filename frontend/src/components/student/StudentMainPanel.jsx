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
            {hasActivePlacement && (
              <button className="btn-primary" onClick={onNewLog}>
                <span className="material-icons-sharp">add</span>
                New Log Entry
              </button>
            )}
          </div>
          </div>
          
          {hasActivePlacement ? (
            <WeeklyLogsTable 
              weeklyLogs={weeklyLogs}
              placement={placement}
              onNewLog={onNewLog}
              onEditLog={onEditLog}
              showTitle={false}
            />
          ) : (
            <div className="empty-state">
              <span className="material-icons-sharp">edit_note</span>
              <h3>No Active Placement</h3>
              <p>You need an approved placement before you can submit weekly logs.</p>
            </div>
          )}
        </div>
      )}

          {/* Placement Page */}
      {activeLink === 'placement' && (
        <div className="page-section">
          <div className="section-header">
            <div>
              <h2>My Placement</h2>
              <p className="subtitle">View and manage your internship placement</p>
            </div>
            {hasActivePlacement && (
            <div className="placement-details-card">
              <div className="placement-header">
                <div className="org-info">
                  <h3>{placement.organisationName}</h3>
                  <span className="department">{placement.department}</span>
                </div>
                activeLink === 'evaluations' && (
        <div className="page-section">
          <div className="section-header">
            <div>
              <h2>Evaluations</h2>
              <p className="subtitle">View supervisor evaluations and feedback</p>
            </div>
          </div>
          
          <div className="empty-state">
            <span className="material-icons-sharp">assessment</span>
            <h3>No Evaluations Yet</h3>
            <p>Evaluations will appear here once your supervisors submit their assessments.</p>
          </div>
        </div>
      )}
            {/* Settings Page */}
      {activeLink === 'settings' && (
        <div className="page-section">
          <div className="section-header">
            <div>
              <h2>Settings</h2>
              <p className="subtitle">Manage your account preferences</p>
            </div>
          </div>
          
          <div className="settings-card">
            <h4>Profile Information</h4>
            <p>Your profile information is managed by the university. Contact the administrator for updates.</p>
          </div>
        </div>
      )}
    </main>
  );
}

  
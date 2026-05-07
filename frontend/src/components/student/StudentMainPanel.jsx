import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import ProgressTracker from './ProgressTracker';
import WeeklyLogsTable from './WeeklyLogsTable';
import './StudentMainPanel.css';

export default function StudentMainPanel({ 
  activeLink, 
  student, 
  placement,
  isPlacementLoading,
  weeklyLogs, 
  acknowledgedEvaluations = [],
  onNewLog, 
  onEditLog,
  onOpenPlacement,
  onViewEvaluation
}) {
  const hasActivePlacement = placement && ['approved', 'active', 'completed'].includes(placement.status);
  const hasPendingPlacement = placement && placement.status === 'pending_approval';
  const hasDraftPlacement = placement && placement.status === 'draft';
  const hasNoPlacement = !placement || placement.status === 'rejected';
  console.log("Evaluations", acknowledgedEvaluations)
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
          
          {isPlacementLoading && (
            <div className="status-card loading">
              <span className="material-icons-sharp spin">sync</span>
              <div className="status-content">
                <h3>Loading Your Placement Information</h3>
                <p>Please wait while we fetch your placement details...</p>
              </div>
            </div>
          )}
          
          {!isPlacementLoading && hasActivePlacement && (
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
          
          {!isPlacementLoading && hasPendingPlacement && (
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
          
          {!isPlacementLoading && (hasNoPlacement || hasDraftPlacement) && (
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
      
      {/* Weekly Logs Page */}
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
            {(hasNoPlacement || hasDraftPlacement) && (
              <button className="btn-primary" onClick={onOpenPlacement}>
                <span className="material-icons-sharp">add</span>
                {hasDraftPlacement ? 'Continue Application' : 'Apply Now'}
              </button>
            )}
          </div>
          
          {hasActivePlacement && (
            <div className="placement-details-card">
              <div className="placement-header">
                <div className="org-info">
                  <h3>{placement.organisationName}</h3>
                  <span className="department">{placement.department}</span>
                </div>
                <span className={`status-badge ${placement.status}`}>
                  {placement.status === 'active' ? 'Active' : 
                   placement.status === 'approved' ? 'Approved' : 'Completed'}
                </span>
              </div>
              
              <div className="placement-grid">
                <div className="info-group">
                  <label>Location</label>
                  <p>{placement.organisationDistrict}</p>
                </div>
                <div className="info-group">
                  <label>Duration</label>
                  <p>{placement.startDate} to {placement.endDate}</p>
                </div>
                <div className="info-group">
                  <label>Workplace Supervisor</label>
                  <p>{placement.workplaceSupervisorName}</p>
                </div>
                <div className="info-group">
                  <label>Academic Supervisor</label>
                  <p>{placement.academicSupervisorName}</p>
                </div>
              </div>
            </div>
          )}
          
          {hasPendingPlacement && (
            <div className="status-card pending">
              <span className="material-icons-sharp">hourglass_top</span>
              <div className="status-content">
                <h3>Application Under Review</h3>
                <p>Your placement application is currently being reviewed.</p>
                <button className="btn-secondary" onClick={onOpenPlacement}>
                  View Application
                </button>
              </div>
            </div>
          )}
          
          {hasNoPlacement && (
            <div className="empty-state">
              <span className="material-icons-sharp">work</span>
              <h3>No Placement Application</h3>
              <p>Start your internship journey by submitting a placement application.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Evaluations Page */}
      {activeLink === 'evaluations' && (
        <div className="page-section">
          <div className="section-header">
            <div>
              <h2>Evaluations</h2>
              <p className="subtitle">View supervisor evaluations and feedback</p>
            </div>
          </div>
          
          {acknowledgedEvaluations.length > 0 ? (
            <table className="student-evaluations-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Organization</th>
                  <th>Score</th>
                  <th>Acknowledged</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {acknowledgedEvaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td>{evaluation.evaluationTypeDisplay}</td>
                    <td>{evaluation.organization}</td>
                    <td>
                      {evaluation.totalScore ?? 0}/{evaluation.maxPossibleScore ?? 0}
                    </td>
                    <td>
                      {evaluation.acknowledgedAt
                        ? new Date(evaluation.acknowledgedAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td>
                      <button
                        className="btn-small"
                        onClick={() => onViewEvaluation?.(evaluation)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <span className="material-icons-sharp">assessment</span>
              <h3>No Acknowledged Evaluations Yet</h3>
              <p>Your acknowledged evaluations will appear here once your supervisors complete and acknowledge them.</p>
            </div>
          )}
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

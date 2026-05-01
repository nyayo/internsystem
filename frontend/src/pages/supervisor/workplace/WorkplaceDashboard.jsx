import React, { useState } from 'react';
import { SupervisorProvider, useSupervisor } from '../../../context/SupervisorContext';
import WorkplaceSideBar from '../../../components/supervisor/workplace/WorkplaceSideBar';
import WorkplaceMainPanel from '../../../components/supervisor/workplace/WorkplaceMainPanel';
import WorkplaceRightPanel from '../../../components/supervisor/workplace/WorkplaceRightPanel';
import WorkplaceStudentsPage from './WorkplaceStudentsPage';
import WorkplaceLogsPage from './WorkplaceLogsPage';
import WorkplaceEvaluationsPage from './WorkplaceEvaluationsPage';
import '../../../components/supervisor/shared/SupervisorStyles.css';

const WorkplaceDashboardContent = () => {
  const [activeLink, setActiveLink] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { stats, notification } = useSupervisor();

  const renderMainContent = () => {
    switch (activeLink) {
      case 'students':
        return <WorkplaceStudentsPage />;
      case 'logs':
        return <WorkplaceLogsPage />;
      case 'evaluations':
        return <WorkplaceEvaluationsPage />;
      case 'settings':
        return (
          <main>
            <h1>Settings</h1>
            <p className="welcome-text">Configure your preferences and notification settings.</p>
            <div className="recent-orders" style={{ textAlign: 'center', padding: '3rem' }}>
              <span className="material-icons-sharp" style={{ fontSize: '3rem', color: 'var(--color-primary)', opacity: 0.5 }}>settings</span>
              <p style={{ marginTop: '1rem', color: 'var(--color-dark)' }}>Settings page coming soon.</p>
            </div>
          </main>
        );
      default:
        return <WorkplaceMainPanel onNavigate={setActiveLink} />;
    }
  };

  return (
    <div className="container">
      <WorkplaceSideBar
        activeLink={activeLink}
        onLinkClick={setActiveLink}
        pendingLogs={stats.pendingLogs}
        pendingEvals={stats.pendingEvaluations}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
      />
      {renderMainContent()}
      <WorkplaceRightPanel onMenuClick={() => setSidebarOpen(true)} />
      
      {notification && (
        <div className={`supervisor-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

const WorkplaceDashboard = () => {
  return (
    <SupervisorProvider role="workplace_supervisor">
      <WorkplaceDashboardContent />
    </SupervisorProvider>
  );
};

export default WorkplaceDashboard;

import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useSupervisor } from '../../../context/SupervisorContext';

const WorkplaceRightPanel = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { supervisor, stats } = useSupervisor();

  return (
    <div className="right">
      <div className="top">
        <button onClick={onMenuClick}>
          <span className="material-icons-sharp">menu</span>
        </button>
        <div className="theme-toggler" onClick={toggleTheme}>
          <span className={`material-icons-sharp ${!isDarkMode ? 'active' : ''}`}>light_mode</span>
          <span className={`material-icons-sharp ${isDarkMode ? 'active' : ''}`}>dark_mode</span>
        </div>
        <div className="profile">
          <div className="info">
            <p>
              Hey, <b>{supervisor.firstName}</b>
            </p>
            <small className="text-muted">Workplace Supervisor</small>
          </div>
          <div className="profile-photo">
            <div style={{
              width: '100%',
              height: '100%',
              background: 'var(--color-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              {supervisor.firstName.charAt(0)}{supervisor.lastName.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="recent-updates">
        <h2>Your Profile</h2>
        <div className="updates">
          <div className="update">
            <div style={{ 
              width: '2.6rem', 
              height: '2.6rem', 
              background: 'var(--color-light)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-sharp" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>business</span>
            </div>
            <div className="message">
              <p><b>Organization</b></p>
              <small>{supervisor.organization}</small>
            </div>
          </div>
          <div className="update">
            <div style={{ 
              width: '2.6rem', 
              height: '2.6rem', 
              background: 'var(--color-light)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-sharp" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>badge</span>
            </div>
            <div className="message">
              <p><b>Position</b></p>
              <small>{supervisor.position}</small>
            </div>
          </div>
          <div className="update">
            <div style={{ 
              width: '2.6rem', 
              height: '2.6rem', 
              background: 'var(--color-light)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-icons-sharp" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>email</span>
            </div>
            <div className="message">
              <p><b>Email</b></p>
              <small>{supervisor.email}</small>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics">
        <h2>Quick Stats</h2>
        <div className="item online">
          <div className="icon">
            <span className="material-icons-sharp">school</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Total Students</h3>
              <small className="text-muted">Assigned to you</small>
            </div>
            <h3>{stats.totalStudents}</h3>
          </div>
        </div>
        <div className="item offline">
          <div className="icon">
            <span className="material-icons-sharp">pending_actions</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Pending Logs</h3>
              <small className="text-muted">Need endorsement</small>
            </div>
            <h3>{stats.pendingLogs}</h3>
          </div>
        </div>
        <div className="item customers">
          <div className="icon">
            <span className="material-icons-sharp">rate_review</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Evaluations</h3>
              <small className="text-muted">Pending completion</small>
            </div>
            <h3>{stats.pendingEvaluations}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkplaceRightPanel;

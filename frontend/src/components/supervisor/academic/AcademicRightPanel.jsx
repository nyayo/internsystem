import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useSupervisor } from '../../../context/SupervisorContext';

const AcademicRightPanel = ({ onMenuClick }) => {
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
              Hey, <b>{supervisor.firstName.split(' ').pop()}</b>
            </p>
            <small className="text-muted">Academic Supervisor</small>
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
              {supervisor.firstName.split(' ').pop().charAt(0)}{supervisor.lastName.charAt(0)}
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
              <span className="material-icons-sharp" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>account_balance</span>
            </div>
            <div className="message">
              <p><b>University</b></p>
              <small>{supervisor.university}</small>
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
              <span className="material-icons-sharp" style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>apartment</span>
            </div>
            <div className="message">
              <p><b>Department</b></p>
              <small>{supervisor.department}</small>
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
            <span className="material-icons-sharp">groups</span>
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
            <span className="material-icons-sharp">grading</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Pending Logs</h3>
              <small className="text-muted">Need assessment</small>
            </div>
            <h3>{stats.pendingAssessment}</h3>
          </div>
        </div>
        <div className="item customers">
          <div className="icon">
            <span className="material-icons-sharp">trending_up</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Average Grade</h3>
              <small className="text-muted">Across all students</small>
            </div>
            <h3>{stats.averageGrade?.toFixed(0) || '-'}%</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicRightPanel;

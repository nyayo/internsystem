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
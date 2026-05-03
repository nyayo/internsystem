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
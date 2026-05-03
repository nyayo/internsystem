import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useSupervisor } from '../../../context/SupervisorContext';

const AcademicRightPanel = ({ onMenuClick }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { supervisor, stats } = useSupervisor();

  return (
    <div className="right"></div>
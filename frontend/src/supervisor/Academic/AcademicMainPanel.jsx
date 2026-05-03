import React from 'react';
import { useSupervisor } from '../../../context/SupervisorContext';
import { getAcademicRecentActivity } from '../../../data/supervisorData';
import '../shared/SupervisorStyles.css';

const AcademicMainPanel = ({ onNavigate }) => {
      const { supervisor, stats } = useSupervisor();
  const recentActivity = getAcademicRecentActivity();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
import React from 'react';
import { useSupervisor } from '../../../context/SupervisorContext';
import { getAcademicRecentActivity } from '../../../data/supervisorData';
import '../shared/SupervisorStyles.css';

const AcademicMainPanel = ({ onNavigate }) => {
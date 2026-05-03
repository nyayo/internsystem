import React from 'react';

const AcademicSideBar = ({ activeLink, onLinkClick, pendingLogs, pendingEvals, onClose, isOpen }) => {
  return (
    <aside>
    </aside>
  );
};

export default AcademicSideBar;
const menuItems = [
  { id: 'dashboard', icon: 'grid_view', label: 'Dashboard' },
  { id: 'students', icon: 'people_outline', label: 'My Students' },
  { id: 'logs', icon: 'grading', label: 'Weekly Logs', count: pendingLogs },
  { id: 'evaluations', icon: 'fact_check', label: 'Evaluations', count: pendingEvals },
];
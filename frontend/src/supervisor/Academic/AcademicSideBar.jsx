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
<aside className={isOpen ? 'show-menu' : ''}>
  <div className="top">
    <div className="logo">
      <div className="logo-icon">
        <span className="material-icons-sharp">school</span>
      </div>
      <h2>
        Intern<span className="accent">Hub</span>
      </h2>
    </div>
    <div className="close" onClick={onClose}>
      <span className="material-icons-sharp">close</span>
    </div>
  </div>
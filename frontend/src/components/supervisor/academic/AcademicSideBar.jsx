import React from 'react';

const AcademicSideBar = ({ activeLink, onLinkClick, pendingLogs, pendingEvals, onClose, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'grid_view', label: 'Dashboard' },
    { id: 'students', icon: 'people_outline', label: 'My Students' },
    { id: 'logs', icon: 'grading', label: 'Weekly Logs', count: pendingLogs },
    { id: 'evaluations', icon: 'fact_check', label: 'Evaluations', count: pendingEvals },
  ];

  return (
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
      <div className="sidebar">
        {menuItems.map(item => (
          <a 
            key={item.id}
            href="#" 
            className={activeLink === item.id ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              onLinkClick(item.id);
            }}
          >
            <span className="material-icons-sharp">{item.icon}</span>
            <h3>{item.label}</h3>
            {item.count !== undefined && item.count > 0 && (
              <span className="message-count">{item.count}</span>
            )}
          </a>
        ))}
        <a href="#">
          <span className="material-icons-sharp">logout</span>
          <h3>Logout</h3>
        </a>
      </div>
    </aside>
  );
};

export default AcademicSideBar;

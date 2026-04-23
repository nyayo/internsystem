import {Link} from "react-router-dom";
import React from "react";
import './Sidebar.css'


export default function SideBar({ activeLink, onLinkClick, pendingCount, onClose, isOpen }) {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', path: "/admin"},
    { key: 'pending', label: 'Pending Approvals', path: "/admin/pending" },
    { key: 'active', label: 'Active Internships', path:"/admin/internships" },
    { key: 'students', label: 'Students', path: "/admin/students"},
    { key: 'supervisors', label: 'Supervisors', path:"./admin/supervisors" },
    { key: 'evaluation', label: 'Evaluation Criteria', path:"/admin/evaluation" },
    // { id: 'progress', icon: 'trending_up', label: 'Progress Tracking' },
    // { id: 'reports', icon: 'assessment', label: 'Reports' },
    // { id: 'settings', icon: 'settings', label: 'Settings' },
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
            key={item.key}
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
}
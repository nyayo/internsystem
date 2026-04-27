import React from "react";
import { studentNavLinks } from "../../data/studentDashboardData";
import "./StudentSideBar.css";

export default function StudentSideBar({
  activeLink,
  onNavClick,
  isOpen,
  onToggle,
  pendingCount,
}) {
  return (
    <aside className={`student-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <span className="material-icons-sharp">school</span>
          </div>
          <h2>
            Intern<span className="accent">Hub</span>
          </h2>
        </div>
        <button className="menu-toggle" onClick={onToggle}>
          <span className="material-icons-sharp">
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      <div className="sidebar-nav">
        {studentNavLinks.map((link) => (
          <a
            key={link.id}
            href="#"
            className={`nav-link ${activeLink === link.id ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick(link.id);
            }}
          >
            <span className="material-icons-sharp">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
            {link.id === "logs" && pendingCount > 0 && (
              <span className="badge danger">{pendingCount}</span>
            )}
          </a>
        ))}
        <a
          href="#"
          className="nav-link logout-link"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <span className="material-icons-sharp">logout</span>
          <h3>Logout</h3>
        </a>
      </div>
    </aside>
  );
}

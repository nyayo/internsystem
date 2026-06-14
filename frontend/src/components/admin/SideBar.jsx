import React from "react";
import "./SideBar.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SideBar({
  activeLink,
  onLinkClick,
  pendingCount,
  onClose,
  isOpen,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = [
    { id: "dashboard", icon: "grid_view", label: "Dashboard" },
    {
      id: "pending",
      icon: "pending_actions",
      label: "Pending Approvals",
      count: pendingCount,
    },
    { id: "active", icon: "work_outline", label: "Active Internships" },
    { id: "students", icon: "people_outline", label: "Students" },
    { id: "supervisors", icon: "badge", label: "Supervisors" },
    { id: "criteria", icon: "fact_check", label: "Evaluation Criteria" },
    // { id: 'progress', icon: 'trending_up', label: 'Progress Tracking' },
    { id: "reports", icon: "assessment", label: "Reports" },
    // { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className={isOpen ? "show-menu" : ""}>
      <div className="top">
        <div className="logo">
          <div className="logo-icon">
            <span className="material-icons-sharp">school</span>
          </div>
          <h2>
            Intern<span className="accent">System</span>
          </h2>
        </div>
        <div className="close" onClick={onClose}>
          <span className="material-icons-sharp">close</span>
        </div>
      </div>
      <div className="sidebar">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={activeLink === item.id ? "active" : ""}
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
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <span className="material-icons-sharp">logout</span>
          <h3>Logout</h3>
        </a>
      </div>
    </aside>
  );
}

import React from "react";
import Profile1 from '../../assets/images/profile-1.jpg'
import Profile2 from '../../assets/images/profile-2.jpg'
import Profile3 from '../../assets/images/profile-3.jpg'
import Profile4 from '../../assets/images/profile-4.jpg'
import './RightPanel.css'
import { useTheme } from '../../context/ThemeContext';

export default function RightPanel({ onMenuClick, stats, admin }) {
  const { isDarkMode, toggleTheme } = useTheme();

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
        <div className="profile">
          <div className="info">
            <p>
              Hey, <b>{admin.fullName}</b>
            </p>
            <small className="text-muted">{admin.jobTitle}</small>
          </div>
          <div className="profile-photo">
            <img src={Profile1} alt="Administrator" />
          </div>
        </div>
      </div>

      <div className="recent-updates">
        <h2>Recent Activity</h2>
        <div className="updates">
          <div className="update">
            <div className="profile-photo">
              <img src={Profile2} alt="" />
            </div>
            <div className="message">
              <p>
                <b>Nakato Joy</b> submitted a new internship application for
                Stanbic Bank.
              </p>
              <small>5 Minutes Ago</small>
            </div>
          </div>
          <div className="update">
            <div className="profile-photo">
              <img src={Profile3} alt="" />
            </div>
            <div className="message">
              <p>
                <b>Kato David</b>'s internship at KCCA was approved by the
                committee.
              </p>
              <small>15 Minutes Ago</small>
            </div>
          </div>
          <div className="update">
            <div className="profile-photo">
              <img src={Profile4} alt="" />
            </div>
            <div className="message">
              <p>
                <b>Amongi Faith</b> submitted her weekly progress report from
                URA.
              </p>
              <small>1 Hour Ago</small>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics">
        <h2>Supervisors Overview</h2>
        <div className="item online">
          <div className="icon">
            <span className="material-icons-sharp">work</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Workplace Supervisors</h3>
              <small className="text-muted">Industry professionals</small>
            </div>
            <h5 className="success">+5%</h5>
            <h3>{stats.workplaceSupervisors}</h3>
          </div>
        </div>
        <div className="item offline">
          <div className="icon">
            <span className="material-icons-sharp">school</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Academic Supervisors</h3>
              <small className="text-muted">Faculty members</small>
            </div>
            <h5 className="success">+2%</h5>
            <h3>{stats.academicSupervisors}</h3>
          </div>
        </div>
        <div className="item customers">
          <div className="icon">
            <span className="material-icons-sharp">fact_check</span>
          </div>
          <div className="right-side">
            <div className="info">
              <h3>Active Criteria</h3>
              <small className="text-muted">Evaluation metrics</small>
            </div>
            <h5 className="success">{stats.activeCriteria} total</h5>
            <h3>100%</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

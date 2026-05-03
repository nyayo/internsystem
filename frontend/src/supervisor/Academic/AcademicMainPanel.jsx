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
    return (
    <main>
      <h1>Academic Supervisor</h1>
      <p className="welcome-text">
        {getGreeting()}, {supervisor.firstName.split(' ').pop()}! You have {stats.pendingAssessment} logs to assess and {stats.pendingAcknowledgement} evaluations to acknowledge.
      </p>
            <div className="insights">
        <div className="pending">
          <span className="material-icons-sharp">groups</span>
          <div className="middle">
            <div className="left">
              <h3>Assigned Students</h3>
              <h1>{stats.totalStudents}</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>100%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Currently Supervising</small>
        </div>

        <div className="active">
          <span className="material-icons-sharp">grading</span>
          <div className="middle">
            <div className="left">
              <h3>Logs to Assess</h3>
              <h1>{stats.pendingAssessment}</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>{stats.pendingAssessment > 0 ? 'Action' : '0%'}</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Endorsed & Ready</small>
        </div>

        <div className="completed">
          <span className="material-icons-sharp">trending_up</span>
          <div className="middle">
            <div className="left">
              <h3>Average Grade</h3>
              <h1>{stats.averageGrade?.toFixed(0) || '-'}%</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>{stats.pendingAcknowledgement} evals</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Across All Students</small>
        </div>
      </div>
            <div className="recent-orders">
        <h2>Action Required</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Student</th>
              <th>Organization</th>
              <th>Details</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td>
                    <span className={item.type === 'log' ? 'primary' : 'warning'}>
                      {item.type === 'log' ? 'Weekly Log' : 'Evaluation'}
                    </span>
                  </td>
                  <td>{item.studentName}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-info-dark)' }}>
                    {item.organization}
                  </td>
                  <td>{item.title}</td>
                  <td>
                    <button 
                      className="btn-view"
                      onClick={() => onNavigate(item.type === 'log' ? 'logs' : 'evaluations')}
                    >
                      {item.action}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                  <span className="material-icons-sharp" style={{ fontSize: '2rem', color: 'var(--color-success)' }}>task_alt</span>
                  <p style={{ marginTop: '0.5rem' }}>All caught up! No pending actions.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('logs'); }}>View All Logs</a>
      </div>
    </main>
  );
};

export default AcademicMainPanel;
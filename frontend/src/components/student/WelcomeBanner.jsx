import React from 'react';
import { formatDate } from '../../data/studentDashboardData';
import './WelcomeBanner.css';

export default function WelcomeBanner({ student, placement }) {
  const hasActivePlacement = placement && ['approved', 'active', 'completed'].includes(placement.status);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  return (
    <div className="welcome-banner">
      <div className="welcome-content">
        <div className="greeting">
          <h1>{getGreeting()}, {student.firstName}!</h1>
          {hasActivePlacement ? (
            <p className="welcome-subtitle">
              Welcome back to your internship dashboard. Keep up the great work!
            </p>
          ) : (
            <p className="welcome-subtitle">
              Ready to start your internship journey? Submit your placement application today.
            </p>
          )}
        </div>
        
        {hasActivePlacement && (
          <div className="placement-summary">
            <div className="org-badge">
              <span className="material-icons-sharp">business</span>
              <div>
                <span className="org-name">{placement.organisationName}</span>
                <span className="org-dept">{placement.department}</span>
              </div>
            </div>
            <div className="date-badge">
              <span className="material-icons-sharp">date_range</span>
              <span>{formatDate(placement.startDate)} - {formatDate(placement.endDate)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="welcome-illustration">
        <div className="illustration-circle">
          <span className="material-icons-sharp">
            {hasActivePlacement ? 'trending_up' : 'rocket_launch'}
          </span>
        </div>
      </div>
    </div>
  );
}

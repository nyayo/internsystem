import React from 'react';

const ProgressCard = ({ progress, currentWeek, totalWeeks }) => {
  return (
    <div className="progress-card">
      <h3>Internship Progress</h3>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{progress}% Complete</p>
      <p>Week {currentWeek} of {totalWeeks}</p>
    </div>
  );
};

export default ProgressCard;
import React, { useState } from 'react';
import { formatDate, formatDateTime } from '../../data/supervisorData';
import './StudentFormStyles.css';

const LogAssessmentModal = ({ log, onClose, onAssess, readOnly = false }) => {
    const [grade, setGrade] = useState(log.academicGrade || '');
const [comment, setComment] = useState(log.academicComment || '');
const handleSubmit = (e) => {
  e.preventDefault();
  if (!grade || grade < 0 || grade > 100) {
    alert('Please enter a valid grade between 0 and 100.');
    return;
  }
  onAssess(log.id, Number(grade), comment);
};
const getGradeColor = (grade) => {
  if (grade >= 80) return 'var(--color-success)';
  if (grade >= 60) return 'var(--color-primary)';
  if (grade >= 40) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

return (
    <div className="student-modal-overlay" onClick={onClose}> 
        <div className="student-modal" onClick={(e) => e.stopPropagation()} >
            <div className="modal-header">
                <h2>{readOnly ? 'View Weekly Log' : 'Assess & Grade Log'}
        
                </h2>
                <button className="close-btn" onClick={onClose}>
                    <span className="material-icons-sharp">close</span>
                </button>
            </div> 
            <div className="modal-body">
  <div style={{
    background: 'var(--color-light)',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h3>{log.studentName}</h3>
        <p>{log.programme}</p>
      </div>
      <div>
        <div>Week {log.weekNumber}</div>
        <div>
          {formatDate(log.weekStartDate)} - {formatDate(log.weekEndDate)}
        </div>
      </div>
    </div>
  </div> 
  <div>
  <h3>Activities Performed</h3>
  <div>{log.activitiesPerformed}</div>
</div>

<div>
  <h3>Skills Gained</h3>
  <div>{log.skillsGained}</div>
</div>

<div>
  <h3>Challenges Faced</h3>
  <div>{log.challengesFaced}</div>
</div>

<div>
  <h3>Supervisor Interactions</h3>
  <div>{log.supervisorInteractions}</div>
</div>

{log.studentRemarks && (
  <div>
    <h3>Student Remarks</h3>
    <div>{log.studentRemarks}</div>
  </div>
)}
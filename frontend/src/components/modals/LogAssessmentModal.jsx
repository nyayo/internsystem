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
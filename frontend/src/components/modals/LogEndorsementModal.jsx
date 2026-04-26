import React, { useState } from 'react';
import { formatDate, formatDateTime } from '../../data/supervisorData';
import './StudentFormStyles.css';

const LogEndorsementModal = ({ log, onClose, onEndorse, readOnly = false }) => {
    const [comment, setComment] = useState(log.workplaceComment || '');
    const handleSubmit = (e) => {
  e.preventDefault();
  onEndorse(log.id, comment);
};
return (
  <div className="student-modal-overlay" onClick={onClose}>
    <div className="student-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>
          {readOnly ? 'View Weekly Log' : 'Review & Endorse Log'}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
        {log.studentName}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-info-dark)' }}>
        {log.programme}
      </p>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div>
        Week {log.weekNumber}
      </div>
      <div>
        {formatDate(log.weekStartDate)} - {formatDate(log.weekEndDate)}
      </div>
    </div>
  </div>
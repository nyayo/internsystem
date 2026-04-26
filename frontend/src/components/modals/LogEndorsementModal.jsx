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
<div style={{
  fontSize: '0.8rem',
  color: 'var(--color-info-dark)',
  marginTop: '0.5rem',
  paddingTop: '0.5rem',
  borderTop: '1px solid var(--color-info-light)'
}}>
  Submitted: {formatDateTime(log.submittedAt)}
</div>
<form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
  <div className="form-group">
    <label>Your Endorsement Comment *</label>
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      rows={4}
    />
  </div>

  <button type="submit">Endorse Log</button>
</form>
{log.workplaceComment && (
  <div>
    <div>{log.workplaceComment}</div>
    <div>
      Endorsed: {formatDateTime(log.workplaceEndorsedAt)}
    </div>
  </div>
)}
{log.academicComment && (
  <div>
    <div>{log.academicComment}</div>

    {log.academicGrade && (
      <div>
        Grade: {log.academicGrade}%
      </div>
    )}
  </div>
)}
import React, { useState } from 'react';
import { formatDateTime } from '../../data/supervisorData';
import './StudentFormStyles.css';

const EvaluationReviewModal = ({ evaluation, onClose, onAcknowledge, readOnly = false }) => {
    const [acknowledgementNotes, setAcknowledgementNotes] = useState(evaluation.acknowledgementNotes || '');
    const handleSubmit = (e) => {
  e.preventDefault();
  onAcknowledge(evaluation.id, acknowledgementNotes);
};
const getScoreColor = (score, max) => {
  const percentage = (score / max) * 100;
  if (percentage >= 80) return 'var(--color-success)';
  if (percentage >= 60) return 'var(--color-primary)';
  if (percentage >= 40) return 'var(--color-warning)';
  return 'var(--color-danger)';
};
const getOverallPercentage = () => {
    return ((evaluation.totalScore / evaluation.maxPossibleScore) * 100).toFixed(1);
  };
  return (
  <div className="student-modal-overlay" onClick={onClose}>
    <div className="student-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
      <div className="modal-header">
        <h2>{readOnly ? 'View Evaluation' : 'Review & Acknowledge Evaluation'}</h2>
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
        <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
          {evaluation.studentName}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-info-dark)' }}>
          {evaluation.programme}
        </p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div>
          {evaluation.evaluationTypeDisplay}
        </div>
      </div>
    </div>
  </div>
  <div>
  <div>Total Score</div>
  <div>
    {evaluation.totalScore} / {evaluation.maxPossibleScore}
  </div>
  <div>
    {getOverallPercentage()}%
  </div>
</div>
<table>
  <thead>
    <tr>
      <th>Criterion</th>
      <th>Score</th>
      <th>Comment</th>
    </tr>
  </thead>
  <tbody></tbody>
  {evaluation.scores.map((score) => (
  <tr key={score.criteriaId}>
    <td>{score.criteriaTitle}</td>
    <td>
      <span>
        {score.scoreAwarded}/{score.maxScore}
      </span>
    </td>
    <td>{score.comment || '—'}</td>
  </tr>
))}
<div>
  <h3>Workplace Supervisor Remarks</h3>
  <div>{evaluation.overallRemarks}</div>
  <div>
    Submitted on {formatDateTime(evaluation.submittedAt)}
  </div>
</div>
<form onSubmit={handleSubmit}>
  <textarea
    value={acknowledgementNotes}
    onChange={(e) => setAcknowledgementNotes(e.target.value)}
  />
  <button type="submit">Acknowledge</button>
</form>
{evaluation.acknowledgementNotes && (
  <div>
    <div>{evaluation.acknowledgementNotes}</div>
    <div>
      Acknowledged by {evaluation.acknowledgedBy}
    </div>
  </div>
)}
<div>
  <button onClick={onClose}>Cancel</button>
</div>
    </div>
  </div>
);

};

export default EvaluationReviewModal;

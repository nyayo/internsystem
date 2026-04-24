import React, { useState } from 'react';
import { formatDate } from '../../data/supervisorData';
import './StudentFormStyles.css';

const EvaluationFormModal = ({ evaluation, criteria, onClose, onSaveDraft, onSubmit, readOnly = false }) => {
    const getInitialScores = () => {
  if (evaluation.scores && evaluation.scores.length > 0) {
    return evaluation.scores;
  }
  return criteria
    .filter(c => c.evaluatorRole === 'workplace_supervisor' || c.evaluatorRole === 'both')
    .map(c => ({
      criteriaId: c.id,
      criteriaTitle: c.title,
      maxScore: c.maxScore,
      scoreAwarded: null,
      comment: '',
    }));
};
const [scores, setScores] = useState(getInitialScores);
const [overallRemarks, setOverallRemarks] = useState(evaluation.overallRemarks || '');
const handleScoreChange = (criteriaId, value) => {
  const numValue = value === '' ? null : Math.min(Number(value), 20);
  setScores(prev => prev.map(s => 
    s.criteriaId === criteriaId ? { ...s, scoreAwarded: numValue } : s
  ));
};
const handleCommentChange = (criteriaId, value) => {
  setScores(prev => prev.map(s => 
    s.criteriaId === criteriaId ? { ...s, comment: value } : s
  ));
};
const getTotalScore = () => {
  return scores.reduce((sum, s) => sum + (s.scoreAwarded || 0), 0);
};

const getMaxPossibleScore = () => {
  return scores.reduce((sum, s) => sum + s.maxScore, 0);
};
const allScoresFilled = () => {
  return scores.every(s => s.scoreAwarded !== null && s.scoreAwarded >= 0);
};
const handleSaveDraft = () => {
  onSaveDraft(evaluation.id, scores, overallRemarks);
};
const handleSubmit = (e) => {
  e.preventDefault();
  if (!allScoresFilled()) {
    alert('Please fill in all scores before submitting.');
    return;
  }
  if (!overallRemarks.trim()) {
    alert('Please provide overall remarks.');
    return;
  }
  onSubmit(evaluation.id, scores, overallRemarks);
};
const getScoreColor = (score, max) => {
  const percentage = (score / max) * 100;
  if (percentage >= 80) return 'var(--color-success)';
  if (percentage >= 60) return 'var(--color-primary)';
  if (percentage >= 40) return 'var(--color-warning)';
  return 'var(--color-danger)';
};
return (
  <div className="student-modal-overlay" onClick={onClose}>
    <div className="student-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
      <div className="modal-header">
        <h2>{readOnly ? 'View Evaluation' : evaluation.evaluationTypeDisplay}</h2>
        <button className="close-btn" onClick={onClose}>
          <span className="material-icons-sharp">close</span>
        </button>
      </div>
      return (
  <div className="student-modal-overlay" onClick={onClose}>
    <div className="student-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
      <div className="modal-header">
        <h2>{readOnly ? 'View Evaluation' : evaluation.evaluationTypeDisplay}</h2>
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
              {evaluation.studentName}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-info-dark)' }}>
              {evaluation.programme}
            </p>
          </div>
        </div>
        <form>
  <table style={{ width: '100%' }}>
    <thead>
      <tr>
        <th>Criterion</th>
        <th>Max</th>
        <th>Score</th>
        <th>Comment</th>
      </tr>
    </thead>
    <tbody></tbody>
    {scores.map((score) => (
  <tr key={score.criteriaId}>
    <td>{score.criteriaTitle}</td>
    <td>{score.maxScore}</td>
    <td>
      <input
        type="number"
        value={score.scoreAwarded ?? ''}
        onChange={(e) =>
          handleScoreChange(score.criteriaId, e.target.value)
        }
      />
    </td>
    <td>
      <input
        type="text"
        value={score.comment}
        onChange={(e) =>
          handleCommentChange(score.criteriaId, e.target.value)
        }
      />
    </td>
  </tr>
))}
</tbody>
<tfoot>
  <tr>
    <td>Total</td>
    <td>{getMaxPossibleScore()}</td>
    <td>{getTotalScore()}</td>
    <td></td>
  </tr>
</tfoot>
</table>
</form>
<div>
  <label>Overall Remarks</label>
  <textarea
    value={overallRemarks}
    onChange={(e) => setOverallRemarks(e.target.value)}
  />
</div>
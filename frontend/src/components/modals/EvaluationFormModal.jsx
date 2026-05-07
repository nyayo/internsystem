import React, { useState } from 'react';
import { formatDate } from '../../data/supervisorData';
import './StudentFormStyles.css';

const EvaluationFormModal = ({ evaluation, criteria, onClose, onSaveDraft, onSubmit, readOnly = false }) => {
  const getInitialScores = () => {
    const savedScores = Array.isArray(evaluation.scores) ? evaluation.scores : [];
    const savedByCriteria = new Map(
      savedScores.map((score) => [score.criteriaId, score]),
    );
    const applicableCriteria = criteria.filter(
      (c) => c.evaluatorRole === 'workplace_supervisor' || c.evaluatorRole === 'both'
    );

    if (applicableCriteria.length === 0) {
      return savedScores;
    }

    return applicableCriteria.map((criterion) => {
      const saved = savedByCriteria.get(criterion.id);
      return {
        criteriaId: criterion.id,
        criteriaTitle: criterion.title,
        maxScore: criterion.maxScore,
        scoreAwarded: saved?.scoreAwarded ?? null,
        comment: saved?.comment ?? '',
      };
    });
  };

  const [scores, setScores] = useState(getInitialScores);
  const [overallRemarks, setOverallRemarks] = useState(evaluation.overallRemarks || '');

  const handleScoreChange = (criteriaId, value) => {
    setScores(prev =>
      prev.map((s) => {
        if (s.criteriaId !== criteriaId) {
          return s;
        }
        const max = Number(s.maxScore) || 0;
        const numValue = value === '' ? null : Math.min(Number(value), max);
        return { ...s, scoreAwarded: numValue };
      }),
    );
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

        <div className="modal-body">
          {/* Student Info Header */}
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
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{evaluation.studentName}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-info-dark)' }}>{evaluation.programme}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: evaluation.evaluationType === 'midterm' 
                  ? 'rgba(99, 102, 241, 0.15)' 
                  : 'rgba(16, 185, 129, 0.15)',
                color: evaluation.evaluationType === 'midterm' 
                  ? 'var(--color-primary)' 
                  : 'var(--color-success)'
              }}>
                {evaluation.evaluationTypeDisplay}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-info-dark)', marginTop: '0.5rem' }}>
                Due: {formatDate(evaluation.dueDate)}
              </div>
            </div>
          </div>

          {/* Scoring Table */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '0.95rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                color: 'var(--color-dark)'
              }}>
                Evaluation Criteria
              </h3>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-light)' }}>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'left', 
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'var(--color-info-dark)'
                    }}>Criterion</th>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'center', 
                      width: '80px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'var(--color-info-dark)'
                    }}>Max</th>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'center', 
                      width: '100px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'var(--color-info-dark)'
                    }}>Score</th>
                    <th style={{ 
                      padding: '0.75rem', 
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'var(--color-info-dark)'
                    }}>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score) => (
                    <tr key={score.criteriaId} style={{ borderBottom: '1px solid var(--color-info-light)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontWeight: '500' }}>{score.criteriaTitle}</div>
                        {criteria.find(c => c.id === score.criteriaId)?.description && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-info-dark)', marginTop: '0.25rem' }}>
                            {criteria.find(c => c.id === score.criteriaId)?.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600' }}>
                        {score.maxScore}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {readOnly ? (
                          <span style={{ 
                            fontWeight: '600',
                            color: getScoreColor(score.scoreAwarded, score.maxScore)
                          }}>
                            {score.scoreAwarded}
                          </span>
                        ) : (
                          <input
                            type="number"
                            min="0"
                            max={score.maxScore}
                            value={score.scoreAwarded ?? ''}
                            onChange={(e) => handleScoreChange(score.criteriaId, e.target.value)}
                            style={{
                              width: '60px',
                              padding: '0.5rem',
                              border: '1px solid var(--color-info-light)',
                              borderRadius: '6px',
                              textAlign: 'center',
                              fontSize: '0.9rem',
                              background: 'var(--color-white)',
                              color: 'var(--color-dark)'
                            }}
                          />
                        )}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {readOnly ? (
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-info-dark)' }}>
                            {score.comment || '—'}
                          </span>
                        ) : (
                          <input
                            type="text"
                            value={score.comment}
                            onChange={(e) => handleCommentChange(score.criteriaId, e.target.value)}
                            placeholder="Optional comment..."
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid var(--color-info-light)',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              background: 'var(--color-white)',
                              color: 'var(--color-dark)'
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--color-light)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>Total Score</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600' }}>
                      {getMaxPossibleScore()}
                    </td>
                    <td style={{ 
                      padding: '0.75rem', 
                      textAlign: 'center', 
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      color: 'var(--color-primary)'
                    }}>
                      {getTotalScore()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Overall Remarks */}
            <div className="form-group">
              <label htmlFor="overallRemarks">Overall Remarks {!readOnly && '*'}</label>
              {readOnly ? (
                <div style={{
                  background: 'var(--color-light)',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: 'var(--color-dark)'
                }}>
                  {overallRemarks || 'No remarks provided.'}
                </div>
              ) : (
                <textarea
                  id="overallRemarks"
                  value={overallRemarks}
                  onChange={(e) => setOverallRemarks(e.target.value)}
                  placeholder="Provide your overall assessment and feedback for this student..."
                  rows={4}
                  required
                />
              )}
            </div>

            {/* Acknowledgement Section (for submitted/acknowledged) */}
            {(evaluation.status === 'submitted' || evaluation.status === 'acknowledged') && evaluation.acknowledgedBy && (
              <div style={{ 
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                borderLeft: '3px solid var(--color-success)'
              }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-success)' }}>
                  Academic Acknowledgement
                </h4>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{evaluation.acknowledgementNotes}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-info-dark)' }}>
                  Acknowledged by {evaluation.acknowledgedBy} on {formatDate(evaluation.acknowledgedAt)}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                {readOnly ? 'Close' : 'Cancel'}
              </button>
              {!readOnly && (
                <>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={!allScoresFilled() || !overallRemarks.trim()}
                  >
                    <span className="material-icons-sharp">send</span>
                    Submit Evaluation
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvaluationFormModal;

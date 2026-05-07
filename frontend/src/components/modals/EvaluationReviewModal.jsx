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
          {/* Student & Evaluation Info Header */}
          <div style={{
            background: 'var(--color-light)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
              </div>
            </div>
            <div style={{ 
              marginTop: '0.75rem', 
              paddingTop: '0.75rem', 
              borderTop: '1px solid var(--color-info-light)',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              color: 'var(--color-info-dark)'
            }}>
              <div>
                <strong>Organization:</strong> {evaluation.organization}
              </div>
              <div>
                <strong>Evaluated by:</strong> {evaluation.workplaceSupervisor}
              </div>
            </div>
          </div>

          {/* Score Summary */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #818cf8 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.25rem' }}>Total Score</div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                {evaluation.totalScore} / {evaluation.maxPossibleScore}
              </div>
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '0.5rem 1rem'
            }}>
              {getOverallPercentage()}%
            </div>
          </div>

          {/* Detailed Scores Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '0.95rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: 'var(--color-dark)'
            }}>
              Evaluation Breakdown
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
                {evaluation.scores.map((score) => (
                  <tr key={score.criteriaId} style={{ borderBottom: '1px solid var(--color-info-light)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>
                      {score.criteriaTitle}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span style={{ 
                        fontWeight: '600',
                        color: getScoreColor(score.scoreAwarded, score.maxScore)
                      }}>
                        {score.scoreAwarded}/{score.maxScore}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--color-info-dark)' }}>
                      {score.comment || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Overall Remarks from Workplace Supervisor */}
          <div className="form-section">
            <h3 style={{ 
              fontSize: '0.95rem', 
              fontWeight: '600', 
              marginBottom: '0.75rem',
              color: 'var(--color-dark)'
            }}>
              Workplace Supervisor Remarks
            </h3>
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              borderLeft: '3px solid var(--color-primary)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: 'var(--color-dark)'
            }}>
              {evaluation.overallRemarks}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-info-dark)', marginTop: '0.5rem' }}>
              Submitted on {formatDateTime(evaluation.submittedAt)}
            </div>
          </div>

          {/* Acknowledgement Section */}
          {!readOnly ? (
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="acknowledgementNotes">Acknowledgement Notes (Optional)</label>
                <textarea
                  id="acknowledgementNotes"
                  value={acknowledgementNotes}
                  onChange={(e) => setAcknowledgementNotes(e.target.value)}
                  placeholder="Add any notes or observations about this evaluation..."
                  rows={4}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--color-info-dark)', marginTop: '0.5rem' }}>
                  These notes will be visible to the workplace supervisor and stored in the student's record.
                </p>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <span className="material-icons-sharp">verified</span>
                  Acknowledge Evaluation
                </button>
              </div>
            </form>
          ) : (
            <>
              {evaluation.acknowledgementNotes && (
                <div className="form-section" style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: '600', 
                    marginBottom: '0.75rem',
                    color: 'var(--color-dark)'
                  }}>
                    Acknowledgement Notes
                  </h3>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderLeft: '3px solid var(--color-success)',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: 'var(--color-dark)'
                  }}>
                    {evaluation.acknowledgementNotes}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-info-dark)', marginTop: '0.5rem' }}>
                    Acknowledged by {evaluation.acknowledgedBy} on {formatDateTime(evaluation.acknowledgedAt)}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationReviewModal;

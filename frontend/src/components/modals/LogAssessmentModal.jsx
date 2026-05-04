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
      <div className="student-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {readOnly ? 'View Weekly Log' : 'Assess & Grade Log'}
          </h2>
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
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{log.studentName}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-info-dark)' }}>{log.programme}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontWeight: '600', 
                  color: 'var(--color-primary)',
                  fontSize: '1.1rem'
                }}>
                  Week {log.weekNumber}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-info-dark)' }}>
                  {formatDate(log.weekStartDate)} - {formatDate(log.weekEndDate)}
                </div>
              </div>
            </div>
            <div style={{ 
              marginTop: '0.75rem', 
              paddingTop: '0.75rem', 
              borderTop: '1px solid var(--color-info-light)',
              fontSize: '0.85rem',
              color: 'var(--color-info-dark)'
            }}>
              <strong>Organization:</strong> {log.student.organisation} · <strong>Supervisor:</strong> {log.workplaceEndorsedByName}
            </div>
          </div>

          {/* Log Details */}
          <div className="form-section">
            <h3>Activities Performed</h3>
            <div className="log-content">{log.activitiesPerformed}</div>
          </div>

          <div className="form-section">
            <h3>Skills Gained</h3>
            <div className="log-content">{log.skillsGained}</div>
          </div>

          <div className="form-section">
            <h3>Challenges Faced</h3>
            <div className="log-content">{log.challengesFaced}</div>
          </div>

          {log.studentRemarks && (
            <div className="form-section">
              <h3>Student Remarks</h3>
              <div className="log-content">{log.studentRemarks}</div>
            </div>
          )}

          {/* Workplace Endorsement */}
          <div className="form-section" style={{ marginTop: '1.5rem' }}>
            <h3>Workplace Supervisor Endorsement</h3>
            <div className="log-content" style={{ 
              background: 'rgba(99, 102, 241, 0.1)',
              borderLeft: '3px solid var(--color-primary)'
            }}>
              {log.workplaceComment}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-info-dark)', marginTop: '0.5rem' }}>
              Endorsed by {log.workplaceEndorsedByName} on {formatDateTime(log.workplaceEndorsedAt)}
            </div>
          </div>

          {/* Assessment Section */}
          {!readOnly ? (
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '150px 1fr', 
                gap: '1rem',
                alignItems: 'start'
              }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="grade">Grade (0-100) *</label>
                  <input
                    type="number"
                    id="grade"
                    min="0"
                    max="100"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                    style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: '600' }}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="comment">Assessment Comment *</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Provide your academic assessment and feedback..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <span className="material-icons-sharp">grading</span>
                  Submit Assessment
                </button>
              </div>
            </form>
          ) : (
            <>
              {log.academicComment && (
                <div className="form-section" style={{ marginTop: '1.5rem' }}>
                  <h3>Academic Assessment</h3>
                  <div className="log-content" style={{ 
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderLeft: '3px solid var(--color-success)'
                  }}>
                    {log.academicComment}
                  </div>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '0.75rem'
                  }}>
                    <div style={{ 
                      fontWeight: '700', 
                      fontSize: '1.5rem',
                      color: getGradeColor(log.academicGrade)
                    }}>
                      {log.academicGrade}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-info-dark)' }}>
                      Assessed on {formatDateTime(log.academicAssessedAt)}
                    </div>
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

      <style>{`
        .log-content {
          background: var(--color-light);
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-dark);
          white-space: pre-wrap;
        }
        
        .form-section {
          margin-bottom: 1.25rem;
        }
        
        .form-section h3 {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-info-dark);
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default LogAssessmentModal;

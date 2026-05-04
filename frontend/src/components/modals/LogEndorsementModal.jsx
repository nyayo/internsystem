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

          <div style={{ 
            fontSize: '0.8rem', 
            color: 'var(--color-info-dark)', 
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--color-info-light)'
          }}>
            Submitted: {formatDateTime(log.submittedAt)}
          </div>

          {/* Endorsement Section */}
          {!readOnly ? (
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="endorsementComment">Your Endorsement Comment *</label>
                <textarea
                  id="endorsementComment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your feedback and comments about this week's log..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <span className="material-icons-sharp">check_circle</span>
                  Endorse Log
                </button>
              </div>
            </form>
          ) : (
            <>
              {log.workplaceComment && (
                <div className="form-section" style={{ marginTop: '1.5rem' }}>
                  <h3>Workplace Supervisor Comment</h3>
                  <div className="log-content" style={{ 
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderLeft: '3px solid var(--color-primary)'
                  }}>
                    {log.workplaceComment}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-info-dark)', marginTop: '0.5rem' }}>
                    Endorsed: {formatDateTime(log.workplaceEndorsedAt)}
                  </div>
                </div>
              )}

              {log.academicComment && (
                <div className="form-section">
                  <h3>Academic Supervisor Assessment</h3>
                  <div className="log-content" style={{ 
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderLeft: '3px solid var(--color-success)'
                  }}>
                    {log.academicComment}
                  </div>
                  {log.academicGrade && (
                    <div style={{ 
                      fontWeight: '600', 
                      color: 'var(--color-success)',
                      marginTop: '0.5rem'
                    }}>
                      Grade: {log.academicGrade}%
                    </div>
                  )}
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

export default LogEndorsementModal;

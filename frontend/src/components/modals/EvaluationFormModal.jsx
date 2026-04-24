import React, { useState } from 'react';
import React from 'react';
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

const EvaluationFormModal = ({ onClose }) => {
  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Evaluation</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>

        <div className="modal-body">
          <p>Evaluation form coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default EvaluationFormModal;
import React, { useState } from 'react';
import React from 'react';
import './StudentFormStyles.css';
import React, { useState } from 'react';

const EvaluationFormModal = ({ evaluation, criteria, onClose }) => {

  const getInitialScores = () => {
    return criteria.map(c => ({
      criteriaId: c.id,
      scoreAwarded: null,
      comment: '',
      maxScore: c.maxScore
    }));
  };

  const [scores, setScores] = useState(() => getInitialScores());
  const [overallRemarks, setOverallRemarks] = useState('');

  return <div>...</div>;
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
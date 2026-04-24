import React from 'react';
import './StudentFormStyles.css';

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
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
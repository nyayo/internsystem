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
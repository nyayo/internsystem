import React, { useState } from 'react';
import { formatDateTime } from '../../data/supervisorData';
import './StudentFormStyles.css';

const EvaluationReviewModal = ({ evaluation, onClose, onAcknowledge, readOnly = false }) => {
    const [acknowledgementNotes, setAcknowledgementNotes] = useState(evaluation.acknowledgementNotes || '');
    const handleSubmit = (e) => {
  e.preventDefault();
  onAcknowledge(evaluation.id, acknowledgementNotes);
};
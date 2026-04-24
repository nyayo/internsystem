import React, { useState } from 'react';
import { formatDate } from '../../data/supervisorData';
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
const [scores, setScores] = useState(getInitialScores);
const [overallRemarks, setOverallRemarks] = useState(evaluation.overallRemarks || '');
const handleScoreChange = (criteriaId, value) => {
  const numValue = value === '' ? null : Math.min(Number(value), 20);
  setScores(prev => prev.map(s => 
    s.criteriaId === criteriaId ? { ...s, scoreAwarded: numValue } : s
  ));
};
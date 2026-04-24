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
const handleCommentChange = (criteriaId, value) => {
  setScores(prev => prev.map(s => 
    s.criteriaId === criteriaId ? { ...s, comment: value } : s
  ));
};
const getTotalScore = () => {
  return scores.reduce((sum, s) => sum + (s.scoreAwarded || 0), 0);
};

const getMaxPossibleScore = () => {
  return scores.reduce((sum, s) => sum + s.maxScore, 0);
};
const allScoresFilled = () => {
  return scores.every(s => s.scoreAwarded !== null && s.scoreAwarded >= 0);
};
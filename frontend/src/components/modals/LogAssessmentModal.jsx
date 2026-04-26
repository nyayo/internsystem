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
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
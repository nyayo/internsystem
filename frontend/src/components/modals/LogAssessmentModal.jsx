import React, { useState } from 'react';
import { formatDate, formatDateTime } from '../../data/supervisorData';
import './StudentFormStyles.css';

const LogAssessmentModal = ({ log, onClose, onAssess, readOnly = false }) => {
    const [grade, setGrade] = useState(log.academicGrade || '');
const [comment, setComment] = useState(log.academicComment || '');
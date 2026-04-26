import React, { useState } from 'react';
import { formatDate, formatDateTime } from '../../data/supervisorData';
import './StudentFormStyles.css';

const LogEndorsementModal = ({ log, onClose, onEndorse, readOnly = false }) => {
    const [comment, setComment] = useState(log.workplaceComment || '');
    const handleSubmit = (e) => {
  e.preventDefault();
  onEndorse(log.id, comment);
};
import React, { useState } from 'react';
import { formatDateTime } from '../../data/supervisorData';
import './StudentFormStyles.css';

const EvaluationReviewModal = ({ evaluation, onClose, onAcknowledge, readOnly = false }) => {
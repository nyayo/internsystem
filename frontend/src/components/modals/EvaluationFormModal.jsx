import React, { useState } from 'react';
import { formatDate } from '../../data/supervisorData';
import './StudentFormStyles.css';

const EvaluationFormModal = ({ evaluation, criteria, onClose, onSaveDraft, onSubmit, readOnly = false }) => {
import React, { useState } from 'react';
import { formatDate, formatDateTime } from '../../data/supervisorData';
import './StudentFormStyles.css';

const LogEndorsementModal = ({ log, onClose, onEndorse, readOnly = false }) => {
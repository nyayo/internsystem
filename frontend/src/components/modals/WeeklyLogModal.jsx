import React, { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  organisationTypes, 
  remunerationTypes, 
  intakeCohorts 
} from '../../data/dashboardData';
import { validatePlacementApplication } from '../../services/studentFormService';
import './StudentFormStyles.css';

export default function PlacementApplicationModal({ placement, onClose, onSubmit }) {
}
const { placementDraft, savePlacementDraft, clearPlacementDraft } = useStudent();

const getInitialData = () => {
  if (placement && placement.status !== 'draft') return placement;
  if (placementDraft) return placementDraft;

  return {
    organisationName: '',
    organisationType: '',
    organisationDistrict: '',
    organisationAddress: '',
    department: '',
    wpSupervisorName: '',
    wpSupervisorEmail: '',
    wpSupervisorPhone: '',
    wpSupervisorTitle: '',
    startDate: '',
    endDate: '',
    intakeCohort: '',
    remunerationType: 'unpaid',
    placementFee: '',
    requestLetter: null,
    acceptanceLetter: null,
  };
};
const [formData, setFormData] = useState(getInitialData);
const [errors, setErrors] = useState({});
const [isDirty, setIsDirty] = useState(false);
useEffect(() => {
  if (!isDirty) return;

  const timeout = setTimeout(() => {
    savePlacementDraft(formData);
  }, 1000);

  return () => clearTimeout(timeout);
}, [formData, isDirty, savePlacementDraft]);
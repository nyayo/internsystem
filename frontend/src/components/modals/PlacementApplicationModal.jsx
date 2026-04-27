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
    const { placementDraft, savePlacementDraft, clearPlacementDraft } = useStudent();

const getInitialData = () => {
  if (placement && placement.status !== 'draft') {
    return placement;
  }
  if (placementDraft) {
    return placementDraft;
  }
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
const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  setIsDirty(true);

  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: null }));
  }
};
const validate = () => {
  const newErrors = validatePlacementApplication(formData);
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (!validate()) {
    return;
  }

  onSubmit(formData);
  clearPlacementDraft();
};
const handleSaveDraft = () => {
  savePlacementDraft(formData);
  onClose();
};
const isViewOnly = placement && !['draft', 'rejected'].includes(placement.status);
return (
  <div className="student-modal-overlay" onClick={onClose}>
    <div className="student-form-modal" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <div>
          <h2>Placement Application</h2>
          <p>
            {isViewOnly
              ? 'View your placement details'
              : 'Submit your internship placement details'}
          </p>
        </div>
        <button onClick={onClose}>close</button>
      </div>

      {placementDraft && !isViewOnly && (
        <div>Draft saved automatically</div>
      )}

      <form onSubmit={handleSubmit}></form>
      <section>
  <h3>Organisation Details</h3>

  <input
    value={formData.organisationName}
    onChange={(e) => handleChange('organisationName', e.target.value)}
  />

  <select
    value={formData.organisationType}
    onChange={(e) => handleChange('organisationType', e.target.value)}
  >
    {organisationTypes.map(type => (
      <option key={type.value} value={type.value}>
        {type.label}
      </option>
    ))}
  </select>
</section>
<section>
  <h3>Workplace Supervisor</h3>

  <input
    value={formData.wpSupervisorName}
    onChange={(e) => handleChange('wpSupervisorName', e.target.value)}
  />

  <input
    value={formData.wpSupervisorEmail}
    onChange={(e) => handleChange('wpSupervisorEmail', e.target.value)}
  />
</section>
<section>
  <h3>Remuneration</h3>

  <select
    value={formData.remunerationType}
    onChange={(e) => handleChange('remunerationType', e.target.value)}
  >
    {remunerationTypes.map(type => (
      <option key={type.value} value={type.value}>
        {type.label}
      </option>
    ))}
  </select>

  <input
    type="number"
    value={formData.placementFee}
    onChange={(e) => handleChange('placementFee', e.target.value)}
  />
</section>
<section>
  <h3>Documents</h3>

  <input
    type="file"
    onChange={(e) => handleChange('requestLetter', e.target.files[0])}
  />

  <input
    type="file"
    onChange={(e) => handleChange('acceptanceLetter', e.target.files[0])}
  />
</section>

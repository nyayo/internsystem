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
  if (!validate()) return;

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
        <h2>Placement Application</h2>
      </div>

      <form onSubmit={handleSubmit}></form>
      <section>
  <h3>Organisation Details</h3>

  <input
    value={formData.organisationName}
    onChange={(e) => handleChange('organisationName', e.target.value)}
  />
</section>
<section>
  <h3>Supervisor</h3>

  <input
    value={formData.wpSupervisorName}
    onChange={(e) => handleChange('wpSupervisorName', e.target.value)}
  />
</section>
<section>
  <input
    type="date"
    value={formData.startDate}
    onChange={(e) => handleChange('startDate', e.target.value)}
  />
</section>
<section>
  <select
    value={formData.remunerationType}
    onChange={(e) => handleChange('remunerationType', e.target.value)}
  >
    {remunerationTypes.map(type => (
      <option key={type.value} value={type.value}>{type.label}</option>
    ))}
  </select>
</section>
<section>
  <input
    type="file"
    onChange={(e) => handleChange('requestLetter', e.target.files[0])}
  />
</section>
{!isViewOnly && (
  <div>
    <button type="button" onClick={handleSaveDraft}>
      Save Draft
    </button>
    <button type="submit">
      Submit
    </button>
  </div>
)}

{isViewOnly && (
  <div>
    <button onClick={onClose}>Close</button>
  </div>
)}

      </form>
    </div>
  </div>
);
}
import React, { useState } from 'react';
import './Modal.css';
import './PlacementDetailsModal.css';
import { 
  workplaceSupervisors, 
  academicSupervisors,
  getOrganisationTypeLabel,
  getRemunerationLabel,
  getIntakeCohortLabel,
  formatDate,
  calculateDurationWeeks
} from '../../data/dashboardData';

export default function PlacementDetailsModal({ placement, onClose, onSave }) {
  const [formData, setFormData] = useState({
    workplaceSupervisor: placement.workplaceSupervisor || '',
    academicSupervisor: placement.academicSupervisor || '',
    decision: '',
    rejectionReason: '',
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedPlacement = {
      ...placement,
      workplaceSupervisor: formData.workplaceSupervisor || null,
      academicSupervisor: formData.academicSupervisor || null,
      status: formData.decision === 'approve' ? 'approved' : 'rejected',
      rejectionReason: formData.decision === 'reject' ? formData.rejectionReason : null,
      approvalDate: formData.decision === 'approve' ? new Date().toISOString() : null,
    };
    
    onSave(updatedPlacement);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const durationWeeks = calculateDurationWeeks(placement.startDate, placement.endDate);

  return (
    <div className="modal-overlay show" onClick={handleOverlayClick}>
      <div className="modal modal-xl placement-modal">
        <div className="modal-header">
          <div className="modal-title">
            <h2>Placement Application Review</h2>
            <span className="application-id">ID: PLM-{String(placement.id).padStart(4, '0')}</span>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <span className="material-icons-sharp">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Student Information */}
            <div className="form-section">
              <h3>
                <span className="material-icons-sharp">school</span>
                Student Information
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={placement.student.name} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>Registration Number</label>
                  <input type="text" value={placement.student.regNumber} readOnly className="readonly" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Program</label>
                  <input type="text" value={placement.student.program} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="text" value={placement.student.email} readOnly className="readonly" />
                </div>
              </div>
            </div>

            {/* Organisation Details */}
            <div className="form-section">
              <h3>
                <span className="material-icons-sharp">business</span>
                Organisation Details
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Organisation Name</label>
                  <input type="text" value={placement.organisationName} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>Organisation Type</label>
                  <input type="text" value={getOrganisationTypeLabel(placement.organisationType)} readOnly className="readonly" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>District</label>
                  <input type="text" value={placement.organisationDistrict} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" value={placement.department} readOnly className="readonly" />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={placement.organisationAddress} readOnly className="readonly" />
              </div>
            </div>

            {/* Workplace Supervisor (from Student) */}
            <div className="form-section">
              <h3>
                <span className="material-icons-sharp">person_outline</span>
                Workplace Supervisor Contact (Provided by Student)
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Supervisor Name</label>
                  <input type="text" value={placement.wpSupervisorName} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>Title/Position</label>
                  <input type="text" value={placement.wpSupervisorTitle || 'Not specified'} readOnly className="readonly" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="text" value={placement.wpSupervisorEmail} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" value={placement.wpSupervisorPhone} readOnly className="readonly" />
                </div>
              </div>
            </div>

            {/* Internship Period */}
            <div className="form-section">
              <h3>
                <span className="material-icons-sharp">event</span>
                Internship Period & Remuneration
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="text" value={formatDate(placement.startDate)} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="text" value={formatDate(placement.endDate)} readOnly className="readonly" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" value={`${durationWeeks} weeks`} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>Intake Cohort</label>
                  <input type="text" value={getIntakeCohortLabel(placement.intakeCohort)} readOnly className="readonly" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Remuneration Type</label>
                  <input type="text" value={getRemunerationLabel(placement.remunerationType)} readOnly className="readonly" />
                </div>
                {placement.placementFee && (
                  <div className="form-group">
                    <label>Placement Fee</label>
                    <input type="text" value={`UGX ${placement.placementFee.toLocaleString()}`} readOnly className="readonly" />
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="form-section">
              <h3>
                <span className="material-icons-sharp">folder</span>
                Submitted Documents
              </h3>
              <div className="documents-list">
                <div className="document-item">
                  <span className="material-icons-sharp doc-icon">description</span>
                  <div className="doc-info">
                    <span className="doc-name">Request Letter</span>
                    <span className="doc-file">{placement.requestLetter}</span>
                  </div>
                  <button type="button" className="btn-download">
                    <span className="material-icons-sharp">download</span>
                  </button>
                </div>
                <div className="document-item">
                  <span className="material-icons-sharp doc-icon">description</span>
                  <div className="doc-info">
                    <span className="doc-name">Acceptance Letter</span>
                    <span className="doc-file">{placement.acceptanceLetter}</span>
                  </div>
                  <button type="button" className="btn-download">
                    <span className="material-icons-sharp">download</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Supervisor Assignment */}
            <div className="form-section highlight-section">
              <h3>
                <span className="material-icons-sharp">assignment_ind</span>
                Supervisor Assignment
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Assign Workplace Supervisor <span className="required">*</span></label>
                  <select 
                    name="workplaceSupervisor" 
                    value={formData.workplaceSupervisor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Supervisor --</option>
                    {workplaceSupervisors.map(sup => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name} ({sup.organisation})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign Academic Supervisor <span className="required">*</span></label>
                  <select 
                    name="academicSupervisor" 
                    value={formData.academicSupervisor}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Supervisor --</option>
                    {academicSupervisors.map(sup => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name} ({sup.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Decision */}
            <div className="form-section highlight-section">
              <h3>
                <span className="material-icons-sharp">gavel</span>
                Decision
              </h3>
              <div className="form-group">
                <label>Action <span className="required">*</span></label>
                <select 
                  name="decision" 
                  value={formData.decision}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Action --</option>
                  <option value="approve">Approve Placement</option>
                  <option value="reject">Reject Placement</option>
                </select>
              </div>

              {formData.decision === 'reject' && (
                <div className="form-group">
                  <label>Rejection Reason <span className="required">*</span></label>
                  <textarea
                    name="rejectionReason"
                    value={formData.rejectionReason}
                    onChange={handleChange}
                    placeholder="Please provide a reason for rejection..."
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Additional Comments (Optional)</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Add any additional notes or comments..."
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <div className="footer-info">
              <span className="material-icons-sharp">info</span>
              <span>Submitted on {formatDate(placement.createdAt)}</span>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-save"
                disabled={!formData.decision || !formData.workplaceSupervisor || !formData.academicSupervisor || (formData.decision === 'reject' && !formData.rejectionReason)}
              >
                {formData.decision === 'approve' ? 'Approve Placement' : 
                 formData.decision === 'reject' ? 'Reject Placement' : 'Submit Decision'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

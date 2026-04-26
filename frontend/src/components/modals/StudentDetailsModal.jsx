import React, { useState } from 'react';
import { workplaceSupervisors, academicSupervisors } from '../../data/dashboardData';
import { useNotification } from '../../context/NotificationContext';
import './Modal.css';

export default function StudentDetailsModal({ student, onClose, onSave }) {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    workplaceSupervisor: student.workplaceSupervisor || '',
    academicSupervisor: student.academicSupervisor || '',
    decision: '',
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.workplaceSupervisor || !formData.academicSupervisor || !formData.decision) {
      showNotification('Please fill in all required fields', 'danger');
      return;
    }

    const newStatus = formData.decision === 'approve' ? 'approved' : 'rejected';
    
    onSave({
      ...student,
      workplaceSupervisor: formData.workplaceSupervisor,
      academicSupervisor: formData.academicSupervisor,
      status: newStatus,
    });

    if (formData.decision === 'approve') {
      showNotification(`${student.studentName}'s internship has been approved!`, 'success');
    } else {
      showNotification(`${student.studentName}'s internship has been rejected.`, 'danger');
    }

    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay show" onClick={handleOverlayClick}>
      <div className="modal modal-lg">
        <h2>Internship Application Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Student Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Student Name</label>
                <input type="text" value={student.studentName} readOnly className="readonly" />
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input type="text" value={student.regNumber} readOnly className="readonly" />
              </div>
            </div>
            <div className="form-group">
              <label>Program</label>
              <input type="text" value={student.program} readOnly className="readonly" />
            </div>
          </div>

          <div className="form-section">
            <h3>Supervisor Assignment</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Workplace Supervisor <span className="required">*</span></label>
                <select 
                  name="workplaceSupervisor" 
                  value={formData.workplaceSupervisor}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Supervisor --</option>
                  {workplaceSupervisors.map(sup => (
                    <option key={sup.id} value={sup.name}>{sup.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Academic Supervisor <span className="required">*</span></label>
                <select 
                  name="academicSupervisor" 
                  value={formData.academicSupervisor}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Supervisor --</option>
                  {academicSupervisors.map(sup => (
                    <option key={sup.id} value={sup.name}>{sup.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Decision</h3>
            <div className="form-group">
              <label>Action <span className="required">*</span></label>
              <select 
                name="decision" 
                value={formData.decision}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Action --</option>
                <option value="approve">Approve Internship</option>
                <option value="reject">Reject Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comments (Optional)</label>
              <textarea 
                name="comments" 
                value={formData.comments}
                onChange={handleChange}
                placeholder="Add any comments or notes..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save & Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

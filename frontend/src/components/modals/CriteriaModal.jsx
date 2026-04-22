import React, { useState } from 'react';
import { categoryOptions, evaluatorRoleOptions, getCategoryDisplay, getEvaluatorDisplay } from '../../data/dashboardData';
import { useNotification } from '../../context/NotificationContext';
import './Modal.css';

export default function CriteriaModal({ criteria, onClose, onSave }) {
  const { showNotification } = useNotification();
  const isEditing = !!criteria;
  
  const [formData, setFormData] = useState({
    title: criteria?.title || '',
    description: criteria?.description || '',
    category: criteria?.category || '',
    maxScore: criteria?.maxScore || 20,
    evaluatorRole: criteria?.evaluatorRole || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.evaluatorRole) {
      showNotification('Please fill in all required fields', 'danger');
      return;
    }

    const newCriteria = {
      id: criteria?.id || Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      categoryDisplay: getCategoryDisplay(formData.category),
      maxScore: parseInt(formData.maxScore),
      evaluatorRole: formData.evaluatorRole,
      evaluatorDisplay: getEvaluatorDisplay(formData.evaluatorRole),
      isActive: true,
    };

    onSave(newCriteria);
    
    if (isEditing) {
      showNotification(`Evaluation criteria "${formData.title}" has been updated!`, 'success');
    } else {
      showNotification(`Evaluation criteria "${formData.title}" has been created!`, 'success');
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
      <div className="modal">
        <h2>{isEditing ? 'Edit Evaluation Criteria' : 'Add Evaluation Criteria'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title <span className="required">*</span></label>
            <input 
              type="text" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Report Writing Quality" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this criteria evaluates..."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select 
                name="category" 
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Max Score <span className="required">*</span></label>
              <input 
                type="number" 
                name="maxScore" 
                value={formData.maxScore}
                onChange={handleChange}
                min="1" 
                max="100" 
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Evaluator Role <span className="required">*</span></label>
            <select 
              name="evaluatorRole" 
              value={formData.evaluatorRole}
              onChange={handleChange}
              required
            >
              <option value="">Select Evaluator</option>
              {evaluatorRoleOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">{isEditing ? 'Update Criteria' : 'Save Criteria'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

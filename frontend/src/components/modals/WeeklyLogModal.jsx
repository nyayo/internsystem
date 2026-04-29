import React, { useState, useEffect, useMemo } from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  getCurrentWeekNumber, 
  getTotalWeeks,
  formatDate 
} from '../../data/studentDashboardData';
import { validateWeeklyLogEntry } from '../../services/studentFormService';
import './StudentFormStyles.css';

export default function WeeklyLogModal({ log, placement, onClose, onSubmit, onSaveDraft }) {
  const { weeklyLogDraft, saveWeeklyLogDraft, clearWeeklyLogDraft, weeklyLogs } = useStudent();
  
  const currentWeekNumber = getCurrentWeekNumber(placement.startDate);
  const totalWeeks = getTotalWeeks(placement.startDate, placement.endDate);
  
  // Get next available week number for new log
  const getNextAvailableWeek = () => {
    const existingWeeks = weeklyLogs.map(l => l.weekNumber);
    for (let i = 1; i <= totalWeeks; i++) {
      if (!existingWeeks.includes(i)) return i;
    }
    return currentWeekNumber;
  };
  
  // Calculate week dates based on week number
  const getWeekDates = (weekNum) => {
    const start = new Date(placement.startDate);
    start.setDate(start.getDate() + (weekNum - 1) * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    return {
      weekStartDate: start.toISOString().split('T')[0],
      weekEndDate: end.toISOString().split('T')[0],
    };
  };
  
  const getInitialData = () => {
    if (log) {
      return log;
    }
    if (weeklyLogDraft) {
      return weeklyLogDraft;
    }
    const weekNum = getNextAvailableWeek();
    const dates = getWeekDates(weekNum);
    return {
      weekNumber: weekNum,
      ...dates,
      activitiesPerformed: '',
      skillsGained: '',
      challengesFaced: '',
      studentRemarks: '',
    };
  };
  
  const [formData, setFormData] = useState(getInitialData);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const isViewOnly = log && !['draft', 'resubmit'].includes(log.status);
  const isResubmit = log && log.status === 'resubmit';
  
  // Auto-save draft on form changes (debounced)
  // useEffect(() => {
  //   if (!isDirty || isViewOnly) return;
    
  //   const timeout = setTimeout(() => {
  //     saveWeeklyLogDraft(formData);
  //   }, 1000);
    
  //   return () => clearTimeout(timeout);
  // }, [formData, isDirty, isViewOnly, saveWeeklyLogDraft]);
  
  const handleChange = (field, value) => {
    if (field === "weekNumber" && !log) {
      const dates = getWeekDates(value);
      setFormData((previousData) => ({
        ...previousData,
        weekNumber: value,
        ...dates,
      }));
    } else {
      setFormData((previousData) => ({ ...previousData, [field]: value }));
    }
    setIsDirty(true);
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = validateWeeklyLogEntry(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    onSubmit(formData);
    clearWeeklyLogDraft();
  };
  
  const handleSaveDraft = () => {
    onSaveDraft(formData);
    console.log(formData)
  };
  
  // Available weeks for selection
  const availableWeeks = useMemo(() => {
    const weeks = [];
    const existingWeeks = weeklyLogs.map(l => l.weekNumber);
    
    for (let i = 1; i <= totalWeeks; i++) {
      const exists = existingWeeks.includes(i);
      const isCurrentLog = log && log.weekNumber === i;
      
      if (!exists || isCurrentLog) {
        weeks.push({
          number: i,
          label: `Week ${i}`,
          isCurrent: i === currentWeekNumber,
        });
      }
    }
    
    return weeks;
  }, [weeklyLogs, totalWeeks, currentWeekNumber, log]);
  
  return (
    <div className="student-modal-overlay" onClick={onClose}>
      <div className="student-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>
              {log ? `Week ${log.weekNumber} Log` : 'New Weekly Log'}
            </h2>
            <p className="modal-subtitle">
              {isViewOnly 
                ? `View your log for ${formatDate(formData.weekStartDate)} - ${formatDate(formData.weekEndDate)}`
                : isResubmit
                  ? 'Please update and resubmit this log'
                  : 'Document your weekly activities and learning'
              }
            </p>
          </div>
          <button className="btn-close" onClick={onClose}>
            <span className="material-icons-sharp">close</span>
          </button>
        </div>
        
        {isResubmit && log.workplaceComment && (
          <div className="resubmit-notice">
            <span className="material-icons-sharp">info</span>
            <div>
              <strong>Supervisor feedback:</strong>
              <p>{log.workplaceComment}</p>
            </div>
          </div>
        )}
        
        {weeklyLogDraft && !isViewOnly && !log && (
          <div className="draft-notice">
            <span className="material-icons-sharp">save</span>
            Draft saved automatically
          </div>
        )}
        
        <form className="form-content" onSubmit={handleSubmit}>
          {/* Week Selection */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">date_range</span>
              Week Information
            </h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Week Number *</label>
                <select
                  value={formData.weekNumber}
                  onChange={(e) => handleChange('weekNumber', Number(e.target.value))}
                  disabled={isViewOnly || log}
                >
                  {availableWeeks.map(week => (
                    <option key={week.number} value={week.number}>
                      {week.label} {week.isCurrent ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Period</label>
                <div className="date-range-display">
                  <span>{formatDate(formData.weekStartDate)}</span>
                  <span className="separator">→</span>
                  <span>{formatDate(formData.weekEndDate)}</span>
                </div>
              </div>
            </div>
          </section>
          
          {/* Activities */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">task_alt</span>
              Activities Performed
            </h3>
            
            <div className="form-group full-width">
              <label>Describe the activities you performed this week *</label>
              <textarea
                value={formData.activitiesPerformed}
                onChange={(e) => handleChange('activitiesPerformed', e.target.value)}
                placeholder="Describe the tasks, projects, and activities you worked on during this week..."
                rows={4}
                disabled={isViewOnly}
                className={errors.activitiesPerformed ? 'error' : ''}
              />
              {errors.activitiesPerformed && <span className="error-text">{errors.activitiesPerformed}</span>}
              <span className="char-count">{formData.activitiesPerformed.length} characters</span>
            </div>
          </section>
          
          {/* Skills Gained */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">psychology</span>
              Skills Gained
            </h3>
            
            <div className="form-group full-width">
              <label>What new skills did you learn this week? *</label>
              <textarea
                value={formData.skillsGained}
                onChange={(e) => handleChange('skillsGained', e.target.value)}
                placeholder="List the technical and soft skills you developed or improved..."
                rows={3}
                disabled={isViewOnly}
                className={errors.skillsGained ? 'error' : ''}
              />
              {errors.skillsGained && <span className="error-text">{errors.skillsGained}</span>}
            </div>
          </section>
          
          {/* Challenges */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">warning</span>
              Challenges Faced
            </h3>
            
            <div className="form-group full-width">
              <label>What challenges did you encounter? *</label>
              <textarea
                value={formData.challengesFaced}
                onChange={(e) => handleChange('challengesFaced', e.target.value)}
                placeholder="Describe any difficulties or obstacles you faced and how you addressed them..."
                rows={3}
                disabled={isViewOnly}
                className={errors.challengesFaced ? 'error' : ''}
              />
              {errors.challengesFaced && <span className="error-text">{errors.challengesFaced}</span>}
            </div>
          </section>
          
          {/* Supervisor Interactions */}
          {/* <section className="form-section">
            <h3>
              <span className="material-icons-sharp">groups</span>
              Supervisor Interactions
            </h3>
            
            <div className="form-group full-width">
              <label>Describe your interactions with supervisors *</label>
              <textarea
                value={formData.supervisorInteractions}
                onChange={(e) => handleChange('supervisorInteractions', e.target.value)}
                placeholder="Meetings, feedback sessions, guidance received..."
                rows={3}
                disabled={isViewOnly}
                className={errors.supervisorInteractions ? 'error' : ''}
              />
              {errors.supervisorInteractions && <span className="error-text">{errors.supervisorInteractions}</span>}
            </div>
          </section> */}
          
          {/* Additional Remarks */}
          <section className="form-section">
            <h3>
              <span className="material-icons-sharp">comment</span>
              Additional Remarks
            </h3>
            
            <div className="form-group full-width">
              <label>Any other comments or observations?</label>
              <textarea
                value={formData.studentRemarks}
                onChange={(e) => handleChange('studentRemarks', e.target.value)}
                placeholder="Optional: Add any additional thoughts, reflections, or comments..."
                rows={2}
                disabled={isViewOnly}
              />
            </div>
          </section>
          
          {/* Supervisor Feedback (View Only) */}
          {isViewOnly && (log.workplaceComment || log.academicComment) && (
            <section className="form-section feedback-section">
              <h3>
                <span className="material-icons-sharp">rate_review</span>
                Supervisor Feedback
              </h3>
              
              {log.workplaceComment && (
                <div className="feedback-item">
                  <div className="feedback-header">
                    <span className="material-icons-sharp">work</span>
                    <strong>Workplace Supervisor</strong>
                    {log.workplaceEndorsedAt && (
                      <span className="feedback-date">{formatDate(log.workplaceEndorsedAt)}</span>
                    )}
                  </div>
                  <p>{log.workplaceComment}</p>
                </div>
              )}
              
              {log.academicComment && (
                <div className="feedback-item">
                  <div className="feedback-header">
                    <span className="material-icons-sharp">school</span>
                    <strong>Academic Supervisor</strong>
                    {log.academicAssessedAt && (
                      <span className="feedback-date">{formatDate(log.academicAssessedAt)}</span>
                    )}
                    {log.academicGrade && (
                      <span className="grade-badge">{log.academicGrade}%</span>
                    )}
                  </div>
                  <p>{log.academicComment}</p>
                </div>
              )}
            </section>
          )}
          
          {/* Actions */}
          {!isViewOnly && (
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleSaveDraft}>
                <span className="material-icons-sharp">save</span>
                Save as Draft
              </button>
              <button type="submit" className="btn-primary">
                <span className="material-icons-sharp">send</span>
                {isResubmit ? 'Resubmit Log' : 'Submit Log'}
              </button>
            </div>
          )}
          
          {isViewOnly && (
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

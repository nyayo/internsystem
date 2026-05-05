import React, { useState } from "react";
import "./MainPanel.css";
import StudentDetailsModal from "../modals/StudentDetailsModal";
import PlacementDetailsModal from "../modals/PlacementDetailsModal";
import CriteriaModal from "../modals/CriteriaModal";

export default function MainPanel({ 
  stats, 
  applications, 
  criteria, 
  onUpdateApplication, 
  onAddCriteria,
  onUpdateCriteria 
}) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const truncateDescription = (value, max = 90) => {
    const text = String(value ?? "");
    if (text.length <= max) return text;
    return `${text.slice(0, max).trimEnd()}...`;
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const activeInternships = applications.filter(app => app.status === 'active');
  const completedThisSemester = applications.filter(app => app.status === 'completed' && new Date(app.completedAt) >= new Date(new Date().setMonth(new Date().getMonth() - 6))).length;

  const handleUpdateApplication = (updatedApp) => {
      onUpdateApplication(updatedApp);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const handleSaveStudent = (updatedStudent) => {
    onUpdateApplication(updatedStudent);
    setSelectedStudent(null);
  };

  const handleAddCriteria = () => {
    setEditingCriteria(null);
    setShowCriteriaModal(true);
  };

  const handleEditCriteria = (criteriaItem) => {
    setEditingCriteria(criteriaItem);
    setShowCriteriaModal(true);
  };

  const handleSaveCriteria = (criteriaData) => {
    if (editingCriteria) {
      onUpdateCriteria(criteriaData);
    } else {
      onAddCriteria(criteriaData);
    }
    setShowCriteriaModal(false);
    setEditingCriteria(null);
  };

  return (
    <main>
      <h1>Internship Dashboard</h1>
      <p className="welcome-text">
        Welcome back! Here's an overview of internship activities.
      </p>
      <div className="date">
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      
      {/* Insight Cards */}
      <div className="insights">
        <div className="pending">
          <span className="material-icons-sharp">hourglass_empty</span>
          <div className="middle">
            <div className="left">
              <h3>Pending Applications</h3>
              <h1>{pendingApplications.length}</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>{Math.round((pendingApplications.length / Math.max(applications.length, 1)) * 100)}%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Awaiting Review</small>
        </div>

        <div className="active">
          <span className="material-icons-sharp">work</span>
          <div className="middle">
            <div className="left">
              <h3>Active Internships</h3>
              <h1>{activeInternships.length}</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>{Math.round((activeInternships.length / Math.max(applications.length, 1)) * 100)}%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">Currently Running</small>
        </div>

        <div className="completed">
          <span className="material-icons-sharp">verified</span>
          <div className="middle">
            <div className="left">
              <h3>Completed</h3>
              <h1>{completedThisSemester}</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36"></circle>
              </svg>
              <div className="number">
                <p>{Math.round((completedThisSemester.length / Math.max(applications.length, 1)) * 100)}%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">This Semester</small>
        </div>
      </div>

      {/* Pending Approvals Table */}
      <div className="recent-orders">
        <h2>Pending Approvals</h2>
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Reg. Number</th>
              <th>Program</th>
              <th>Workplace Supervisor</th>
              <th>Academic Supervisor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.studentName}</td>
                <td>{app.regNumber}</td>
                <td>{app.program}</td>
                <td className={!app.workplaceSupervisor ? 'text-muted' : ''}>
                  {app.workplaceSupervisor || 'Not Assigned'}
                </td>
                <td className={!app.academicSupervisor ? 'text-muted' : ''}>
                  {app.academicSupervisor || 'Not Assigned'}
                </td>
                <td className={
                  app.status === 'pending' ? 'warning' : 
                  app.status === 'approved' ? 'success' : 'danger'
                }>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </td>
                <td>
                  <button 
                    className="btn-view"
                    onClick={() => handleViewDetails(app)}
                    disabled={app.status !== 'pending'}
                    style={app.status !== 'pending' ? { opacity: 0.5 } : {}}
                  >
                    {app.status === 'pending' ? 'View Details' : 'Processed'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="#">View All Applications</a>
      </div>

      {/* Evaluation Criteria */}
      <div className="evaluation-criteria">
        <div className="criteria-header">
          <h2>Evaluation Criteria</h2>
          <button className="btn-add-criteria" onClick={handleAddCriteria}>
            <span className="material-icons-sharp">add</span>
            Add Criteria
          </button>
        </div>
        <table className="criteria-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Max Score</th>
              <th>Evaluator</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="criteria-title">
                    <span className={`criteria-dot ${item.category.split('_')[0]}`}></span>
                    {item.title}
                  </div>
                  <small className="text-muted" title={item.description}>
                    {truncateDescription(item.description)}
                  </small>
                </td>
                <td>{item.categoryDisplay}</td>
                <td>
                  <span className="score-badge">{item.maxScore} pts</span>
                </td>
                <td>{item.evaluatorDisplay}</td>
                <td>
                  <span className={`status-badge ${item.isActive ? 'active' : ''}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditCriteria(item)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        // <PlacementDetailsModal
        //   student={selectedStudent}
        //   onClose={() => setSelectedStudent(null)}
        //   onSave={handleSaveStudent}
        // />
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSave={handleSaveStudent}
        />
      )}

      {/* Criteria Modal */}
      {showCriteriaModal && (
        <CriteriaModal
          criteria={editingCriteria}
          onClose={() => {
            setShowCriteriaModal(false);
            setEditingCriteria(null);
          }}
          onSave={handleSaveCriteria}
        />
      )}
    </main>
  );
}

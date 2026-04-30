import React, { useState } from 'react';
import { useSupervisor } from '../../../context/SupervisorContext';
import { formatDate } from '../../../data/supervisorData';
import EvaluationFormModal from '../../../components/modals/EvaluationFormModal';
import Pagination from '../../../components/Pagination';
import usePagination from '../../../hooks/usePagination';
import StatusFilterTabs from '../../../components/supervisor/shared/StatusFilterTabs';
import '../../../components/supervisor/shared/SupervisorStyles.css';

const WorkplaceEvaluationsPage = () => {
  const { evaluations, criteria, saveEvaluationDraft, submitEvaluation } = useSupervisor();
  const [activeFilter, setActiveFilter] = useState('pending');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const filteredEvaluations = evaluations.filter(eval_ => {
    switch (activeFilter) {
      case 'pending':
        return eval_.status === 'not_started' || eval_.status === 'in_progress';
      case 'submitted':
        return eval_.status === 'submitted';
      case 'acknowledged':
        return eval_.status === 'acknowledged';
      default:
        return true;
    }
  });

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedEvaluations,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
  } = usePagination(filteredEvaluations);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    resetPagination();
  };

  const handleSaveDraft = (evaluationId, scores, overallRemarks) => {
    saveEvaluationDraft(evaluationId, scores, overallRemarks);
    setSelectedEvaluation(null);
  };

  const handleSubmit = (evaluationId, scores, overallRemarks) => {
    submitEvaluation(evaluationId, scores, overallRemarks);
    setSelectedEvaluation(null);
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'acknowledged': return 'Acknowledged';
      default: return status;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const filterOptions = [
    {
      value: "pending",
      label: "Pending",
      count: evaluations.filter(
        (evaluation) =>
          evaluation.status === "not_started" || evaluation.status === "in_progress",
      ).length,
    },
    {
      value: "submitted",
      label: "Submitted",
      count: evaluations.filter((evaluation) => evaluation.status === "submitted").length,
    },
    {
      value: "acknowledged",
      label: "Done",
      count: evaluations.filter((evaluation) => evaluation.status === "acknowledged").length,
    },
    { value: "all", label: "All" },
  ];

  return (
    <main>
      <h1>Student Evaluations</h1>
      <p className="welcome-text">
        Complete evaluations for your students at midterm and final assessment points.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
          <h2>Evaluations</h2>
          <StatusFilterTabs
            activeFilter={activeFilter}
            options={filterOptions}
            onChange={handleFilterChange}
          />
        </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>Due Date</th>
              <th>Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEvaluations.length > 0 ? (
              paginatedEvaluations.map((evaluation) => (
                <tr key={evaluation.id}>
                  <td>
                    <div style={{ fontWeight: '500' }}>{evaluation.studentName}</div>
                    <small className="text-muted">{evaluation.programme}</small>
                  </td>
                  <td>
                    <span className={evaluation.evaluationType === 'midterm' ? 'primary' : ''}>
                      {evaluation.evaluationTypeDisplay}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: isOverdue(evaluation.dueDate) && evaluation.status !== 'acknowledged' && evaluation.status !== 'submitted'
                        ? 'var(--color-danger)' 
                        : 'inherit',
                      fontWeight: isOverdue(evaluation.dueDate) ? '500' : 'normal'
                    }}>
                      {formatDate(evaluation.dueDate)}
                      {isOverdue(evaluation.dueDate) && evaluation.status !== 'acknowledged' && evaluation.status !== 'submitted' && (
                        <small style={{ marginLeft: '0.25rem' }}>⚠</small>
                      )}
                    </span>
                  </td>
                  <td>
                    {evaluation.totalScore !== null ? (
                      <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                        {evaluation.totalScore}/120
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className={
                      evaluation.status === 'not_started' ? '' :
                      evaluation.status === 'in_progress' ? 'warning' :
                      evaluation.status === 'submitted' ? 'primary' : 'success'
                    }>
                      {getStatusDisplay(evaluation.status)}
                    </span>
                  </td>
                  <td>
                    {evaluation.status === 'not_started' && (
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedEvaluation(evaluation)}
                      >
                        Start
                      </button>
                    )}
                    {evaluation.status === 'in_progress' && (
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedEvaluation(evaluation)}
                      >
                        Continue
                      </button>
                    )}
                    {(evaluation.status === 'submitted' || evaluation.status === 'acknowledged') && (
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedEvaluation(evaluation)}
                        style={{ background: 'var(--color-light)', color: 'var(--color-dark)' }}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  <span className="material-icons-sharp" style={{ fontSize: '2rem', color: 'var(--color-success)', opacity: 0.7 }}>
                    {activeFilter === 'pending' ? 'task_alt' : 'rate_review'}
                  </span>
                  <p style={{ marginTop: '0.5rem' }}>
                    {activeFilter === 'pending' 
                      ? 'No pending evaluations.' 
                      : activeFilter === 'submitted'
                      ? 'No submitted evaluations.'
                      : activeFilter === 'acknowledged'
                      ? 'No acknowledged evaluations.'
                      : 'No evaluations available.'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {filteredEvaluations.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredEvaluations.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>

      {selectedEvaluation && (
        <EvaluationFormModal
          evaluation={selectedEvaluation}
          criteria={criteria}
          onClose={() => setSelectedEvaluation(null)}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          readOnly={selectedEvaluation.status === 'submitted' || selectedEvaluation.status === 'acknowledged'}
        />
      )}
    </main>
  );
};

export default WorkplaceEvaluationsPage;

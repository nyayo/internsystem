import React, { useState } from 'react';
import { useSupervisor } from '../../../context/SupervisorContext';
import { formatDateTime } from '../../../data/supervisorData';
import EvaluationReviewModal from '../../../components/modals/EvaluationReviewModal';
import Pagination from '../../../components/Pagination';
import usePagination from '../../../hooks/usePagination';
import StatusFilterTabs from '../../../components/supervisor/shared/StatusFilterTabs';
import '../../../components/supervisor/shared/SupervisorStyles.css';

const AcademicEvaluationsPage = () => {
  const { evaluations, acknowledgeEvaluation } = useSupervisor();
  const [activeFilter, setActiveFilter] = useState('pending');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const filteredEvaluations = evaluations.filter(eval_ => {
    switch (activeFilter) {
      case 'pending':
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

  const handleAcknowledge = (evaluationId, notes) => {
    acknowledgeEvaluation(evaluationId, notes);
    setSelectedEvaluation(null);
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'submitted': return 'Pending Review';
      case 'acknowledged': return 'Acknowledged';
      default: return status;
    }
  };

  const getScorePercentage = (score, max) => {
    return ((score / max) * 100).toFixed(0);
  };

  const getScoreColor = (score, max) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'var(--color-success)';
    if (percentage >= 60) return 'var(--color-primary)';
    if (percentage >= 40) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const filterOptions = [
    {
      value: "pending",
      label: "Pending",
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
        Review and acknowledge evaluations submitted by workplace supervisors.
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
              <th>Organization</th>
              <th>Type</th>
              <th>Submitted</th>
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
                    <div style={{ fontSize: '0.9rem' }}>{evaluation.organization}</div>
                    <small className="text-muted">{evaluation.workplaceSupervisor}</small>
                  </td>
                  <td>
                    <span className={evaluation.evaluationType === 'midterm' ? 'primary' : ''}>
                      {evaluation.evaluationTypeDisplay}
                    </span>
                  </td>
                  <td><small>{formatDateTime(evaluation.submittedAt)}</small></td>
                  <td>
                    <span style={{ 
                      fontWeight: '600', 
                      color: getScoreColor(evaluation.totalScore, evaluation.maxPossibleScore) 
                    }}>
                      {evaluation.totalScore}/{evaluation.maxPossibleScore}
                    </span>
                    <br />
                    <small className="text-muted">
                      {getScorePercentage(evaluation.totalScore, evaluation.maxPossibleScore)}%
                    </small>
                  </td>
                  <td>
                    <span className={evaluation.status === 'submitted' ? 'warning' : 'success'}>
                      {getStatusDisplay(evaluation.status)}
                    </span>
                  </td>
                  <td>
                    {evaluation.status === 'submitted' ? (
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedEvaluation(evaluation)}
                      >
                        Review
                      </button>
                    ) : (
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
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  <span className="material-icons-sharp" style={{ fontSize: '2rem', color: 'var(--color-success)', opacity: 0.7 }}>
                    {activeFilter === 'pending' ? 'task_alt' : 'fact_check'}
                  </span>
                  <p style={{ marginTop: '0.5rem' }}>
                    {activeFilter === 'pending' 
                      ? 'No evaluations pending acknowledgement.' 
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
        <EvaluationReviewModal
          evaluation={selectedEvaluation}
          onClose={() => setSelectedEvaluation(null)}
          onAcknowledge={handleAcknowledge}
          readOnly={selectedEvaluation.status === 'acknowledged'}
        />
      )}
    </main>
  );
};

export default AcademicEvaluationsPage;

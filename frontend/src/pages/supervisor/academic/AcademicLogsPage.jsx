import React, { useState } from 'react';
import { useSupervisor } from '../../../context/SupervisorContext';
import { formatDate, formatDateTime } from '../../../data/supervisorData';
import LogAssessmentModal from '../../../components/modals/LogAssessmentModal';
import Pagination from '../../../components/Pagination';
import usePagination from '../../../hooks/usePagination';
import StatusFilterTabs from '../../../components/supervisor/shared/StatusFilterTabs';
import '../../../components/supervisor/shared/SupervisorStyles.css';

const AcademicLogsPage = () => {
  const { logs, assessLog } = useSupervisor();
  const [activeFilter, setActiveFilter] = useState('pending');
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = logs.filter(log => {
    switch (activeFilter) {
      case 'pending':
        return log.status === 'endorsed';
      case 'assessed':
        return log.status === 'assessed' || log.status === 'closed';
      default:
        return true;
    }
  });

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedLogs,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
  } = usePagination(filteredLogs);
  console.log("Logs Page", paginatedLogs)

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    resetPagination();
  };

  const handleAssess = (logId, grade, comment) => {
    assessLog(logId, grade, comment);
    setSelectedLog(null);
  };

  const getGradeColor = (grade) => {
    if (grade >= 80) return 'var(--color-success)';
    if (grade >= 60) return 'var(--color-primary)';
    if (grade >= 40) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const filterOptions = [
    { value: "pending", label: "Pending", count: logs.filter((log) => log.status === "endorsed").length },
    {
      value: "assessed",
      label: "Assessed",
      count: logs.filter((log) => log.status === "assessed" || log.status === "closed").length,
    },
    { value: "all", label: "All" },
  ];

  return (
    <main>
      <h1>Weekly Logs</h1>
      <p className="welcome-text">
        Review endorsed logs and assign grades to your students.
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
          <h2>Log Entries</h2>
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
              <th>Week</th>
              <th>Endorsed</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div style={{ fontWeight: '500' }}>{log.student.name}</div>
                    <small className="text-muted">{log.student.programme}</small>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>{log.student.organisation}</div>
                    <small className="text-muted">{log.workplaceEndorsedByName}</small>
                  </td>
                  <td>
                    <span style={{ fontWeight: '500' }}>Week {log.weekNumber}</span>
                    <br />
                    <small className="text-muted">{formatDate(log.weekStartDate)}</small>
                  </td>
                  <td><small>{formatDateTime(log.workplaceEndorsedAt)}</small></td>
                  <td>
                    {log.academicGrade ? (
                      <span style={{ fontWeight: '600', color: getGradeColor(log.academicGrade) }}>
                        {log.academicGrade}%
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className={
                      log.status === 'endorsed' ? 'primary' :
                      log.status === 'assessed' ? 'success' : ''
                    }>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {log.status === 'endorsed' ? (
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedLog(log)}
                      >
                        Grade
                      </button>
                    ) : (
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedLog(log)}
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
                    {activeFilter === 'pending' ? 'task_alt' : 'grading'}
                  </span>
                  <p style={{ marginTop: '0.5rem' }}>
                    {activeFilter === 'pending' 
                      ? 'No logs pending assessment.' 
                      : activeFilter === 'assessed'
                      ? 'No assessed logs yet.'
                      : 'No weekly logs available.'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {filteredLogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredLogs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>

      {selectedLog && (
        <LogAssessmentModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          onAssess={handleAssess}
          readOnly={selectedLog.status !== 'endorsed'}
        />
      )}
    </main>
  );
};

export default AcademicLogsPage;

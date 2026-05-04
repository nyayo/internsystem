import React, { useState } from 'react';
import { useSupervisor } from '../../../context/SupervisorContext';
import { formatDate, formatDateTime } from '../../../data/supervisorData';
import LogEndorsementModal from '../../../components/modals/LogEndorsementModal';
import Pagination from '../../../components/Pagination';
import usePagination from '../../../hooks/usePagination';
import StatusFilterTabs from '../../../components/supervisor/shared/StatusFilterTabs';
import '../../../components/supervisor/shared/SupervisorStyles.css';

const WorkplaceLogsPage = () => {
  const { logs, endorseLog } = useSupervisor();
  const [activeFilter, setActiveFilter] = useState('pending');
  const [selectedLog, setSelectedLog] = useState(null);
  console.log("Logs", logs)

  const filteredLogs = logs.filter(log => {
    switch (activeFilter) {
      case 'pending':
        return log.status === 'submitted';
      case 'endorsed':
        return log.status === 'endorsed';
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

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    resetPagination();
  };

  const handleEndorse = (logId, comment) => {
    endorseLog(logId, comment);
    setSelectedLog(null);
  };

  const filterOptions = [
    { value: "pending", label: "Pending", count: logs.filter((log) => log.status === "submitted").length },
    { value: "endorsed", label: "Endorsed", count: logs.filter((log) => log.status === "endorsed").length },
    { value: "all", label: "All" },
  ];

  return (
    <main>
      <h1>Weekly Logs</h1>
      <p className="welcome-text">
        Review and endorse weekly logs submitted by your students.
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
              <th>Week</th>
              <th>Period</th>
              <th>Submitted</th>
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
                    <span style={{ fontWeight: '500' }}>Week {log.weekNumber}</span>
                  </td>
                  <td>
                    <small>{formatDate(log.weekStartDate)} - {formatDate(log.weekEndDate)}</small>
                  </td>
                  <td><small>{formatDateTime(log.submittedAt)}</small></td>
                  <td>
                    <span className={
                      log.status === 'submitted' ? 'warning' :
                      log.status === 'endorsed' ? 'primary' :
                      log.status === 'assessed' ? 'success' : ''
                    }>
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {log.status === 'submitted' ? (
                      <button 
                        className="btn-view"
                        onClick={() => setSelectedLog(log)}
                      >
                        Endorse
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
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  <span className="material-icons-sharp" style={{ fontSize: '2rem', color: 'var(--color-success)', opacity: 0.7 }}>
                    {activeFilter === 'pending' ? 'task_alt' : 'description'}
                  </span>
                  <p style={{ marginTop: '0.5rem' }}>
                    {activeFilter === 'pending' 
                      ? 'No logs pending endorsement.' 
                      : activeFilter === 'endorsed'
                      ? 'No endorsed logs yet.'
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
        <LogEndorsementModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          onEndorse={handleEndorse}
          readOnly={selectedLog.status !== 'submitted'}
        />
      )}
    </main>
  );
};

export default WorkplaceLogsPage;

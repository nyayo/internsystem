import React, { useMemo } from 'react';
import Pagination from '../Pagination';
import { 
  formatDate, 
  getWeeklyLogStatusLabel, 
  getWeeklyLogStatusClass,
  getCurrentWeekNumber 
} from '../../data/studentDashboardData';
import usePagination from '../../hooks/usePagination';
import './WeeklyLogsTable.css';

export default function WeeklyLogsTable({ 
  weeklyLogs, 
  placement, 
  onNewLog, 
  onEditLog, 
  showTitle = true,
  limit = null 
}) {
  // Sort logs by week number descending (newest first)
  const sortedLogs = useMemo(() => {
    return [...weeklyLogs].sort((a, b) => b.weekNumber - a.weekNumber);
  }, [weeklyLogs]);
  
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(sortedLogs);
  const displayLogs = limit ? sortedLogs.slice(0, limit) : paginatedItems;
  const currentWeek = getCurrentWeekNumber(placement.startDate);
  
  const canEditLog = (log) => {
    return ['draft', 'resubmit'].includes(log.status);
  };
  
  const canViewLog = (log) => {
    return !['draft'].includes(log.status);
  };
  
  return (
    <div className="weekly-logs-table">
      {showTitle && (
        <div className="table-header">
          <div className="header-content">
            <h3>Weekly Logs</h3>
            <p className="subtitle">Your internship activity records</p>
          </div>
          <button className="btn-new-log" onClick={onNewLog}>
            <span className="material-icons-sharp">add</span>
            New Log
          </button>
        </div>
      )}
      
      {displayLogs.length === 0 ? (
        <div className="empty-logs">
          <span className="material-icons-sharp">edit_note</span>
          <h4>No Weekly Logs Yet</h4>
          <p>Start documenting your internship experience by creating your first weekly log.</p>
          <button className="btn-start" onClick={onNewLog}>
            <span className="material-icons-sharp">add</span>
            Create First Log
          </button>
        </div>
      ) : (
        <>
          <div className="logs-table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Period</th>
                  <th>Activities</th>
                  <th>Status</th>
                  <th>Grade</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayLogs.map(log => (
                  <tr key={log.id} className={log.status === 'resubmit' ? 'requires-action' : ''}>
                    <td className="week-cell">
                      <div className="week-number">
                        <span className="number">{log.weekNumber}</span>
                        {log.weekNumber === currentWeek && (
                          <span className="current-badge">Current</span>
                        )}
                      </div>
                    </td>
                    <td className="period-cell">
                      <span>{formatDate(log.weekStartDate)}</span>
                      <span className="period-separator">→</span>
                      <span>{formatDate(log.weekEndDate)}</span>
                    </td>
                    <td className="activities-cell">
                      <p className="activities-preview">
                        {log.activitiesPerformed.length > 80 
                          ? log.activitiesPerformed.substring(0, 80) + '...' 
                          : log.activitiesPerformed}
                      </p>
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${getWeeklyLogStatusClass(log.status)}`}>
                        {getWeeklyLogStatusLabel(log.status)}
                      </span>
                    </td>
                    <td className="grade-cell">
                      {log.academicGrade ? (
                        <span className="grade">{log.academicGrade}%</span>
                      ) : (
                        <span className="no-grade">-</span>
                      )}
                    </td>
                    <td className="action-cell">
                      {canEditLog(log) && (
                        <button 
                          className="btn-action edit"
                          onClick={() => onEditLog(log)}
                          title="Edit & Submit"
                        >
                          <span className="material-icons-sharp">edit</span>
                        </button>
                      )}
                      {canViewLog(log) && (
                        <button 
                          className="btn-action view"
                          onClick={() => onEditLog(log)}
                          title="View Details"
                        >
                          <span className="material-icons-sharp">visibility</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {!limit && sortedLogs.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
          
          {limit && sortedLogs.length > limit && (
            <div className="view-all-link">
              <span>Showing {limit} of {sortedLogs.length} logs</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import React from 'react';
import { useSupervisor } from '../../../context/SupervisorContext';
import { formatDate } from '../../../data/supervisorData';
import Pagination from '../../../components/Pagination';
import usePagination from '../../../hooks/usePagination';
import '../../../components/supervisor/shared/SupervisorStyles.css';

const WorkplaceStudentsPage = () => {
  const { students } = useSupervisor();
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedStudents,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(students);

  const getProgressPercentage = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <main>
      <h1>My Students</h1>
      <p className="welcome-text">
        You have {students.length} student{students.length !== 1 ? 's' : ''} assigned to your supervision.
      </p>

      <h2 style={{marginBottom: '1rem', marginTop: '1rem'}}>Assigned Students</h2>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Programme</th>
              <th>Duration</th>
              <th>Progress</th>
              <th>Pending Logs</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--color-primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}>
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{student.firstName} {student.lastName}</div>
                      <small className="text-muted">{student.studentId}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{student.programme}</div>
                  <small className="text-muted">Year {student.year}</small>
                </td>
                <td>
                  <div>{formatDate(student.startDate)}</div>
                  <small className="text-muted">to {formatDate(student.endDate)}</small>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '80px',
                      height: '6px',
                      background: 'var(--color-light)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${getProgressPercentage(student.completedWeeks, student.totalWeeks)}%`,
                        height: '100%',
                        background: 'var(--color-primary)',
                        borderRadius: '3px'
                      }} />
                    </div>
                    <small className="text-muted">
                      {student.completedWeeks}/{student.totalWeeks}
                    </small>
                  </div>
                </td>
                <td>
                  {student.pendingLogs > 0 ? (
                    <span className="warning">{student.pendingLogs} pending</span>
                  ) : (
                    <span className="success">None</span>
                  )}
                </td>
                <td>
                  <span className={student.status === 'active' ? 'success' : ''}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  <span className="material-icons-sharp" style={{ fontSize: '2rem', color: 'var(--color-dark)', opacity: 0.5 }}>person_off</span>
                  <p style={{ marginTop: '0.5rem' }}>No students assigned yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {students.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={students.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </main>
  );
};

export default WorkplaceStudentsPage;

import React from 'react';
import { useSupervisor } from '../../../context/SupervisorContext';
import Pagination from '../../../components/Pagination';
import usePagination from '../../../hooks/usePagination';
import '../../../components/supervisor/shared/SupervisorStyles.css';

const AcademicStudentsPage = () => {
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

  const getGradeColor = (grade) => {
    if (grade >= 80) return 'var(--color-success)';
    if (grade >= 60) return 'var(--color-primary)';
    if (grade >= 40) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <main>
      <h1>My Students</h1>
      <p className="welcome-text">
        You have {students.length} student{students.length !== 1 ? 's' : ''} assigned to your academic supervision.
      </p>

      <h2 style={{ marginTop: '1rem', marginBottom: '1rem' }}>Assigned Students</h2>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Programme</th>
              <th>Organization</th>
              <th>Progress</th>
              <th>Avg. Grade</th>
              <th>Pending</th>
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
                  <div style={{ fontSize: '0.9rem' }}>{student.organization}</div>
                  <small className="text-muted">{student.workplaceSupervisor}</small>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '60px',
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
                  <span style={{ 
                    fontWeight: '600', 
                    color: getGradeColor(student.averageGrade) 
                  }}>
                    {student.averageGrade?.toFixed(0) || '-'}%
                  </span>
                </td>
                <td>
                  {student.pendingAssessment > 0 ? (
                    <span className="warning">{student.pendingAssessment} log{student.pendingAssessment > 1 ? 's' : ''}</span>
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
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
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

export default AcademicStudentsPage;

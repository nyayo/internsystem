import React, { useMemo } from 'react';
import { useSupervisor } from '../../../context/SupervisorContext';
import Pagination from '../../../components/Pagination';
import usePagination from '../../../hooks/usePagination';
import '../../../components/supervisor/shared/SupervisorStyles.css';

const AcademicStudentsPage = () => {
  const { students, logs } = useSupervisor();
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedStudents,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(students);
  const getProgressPercentage = (completed, total) => {
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  };

  const getGradeColor = (grade) => {
    if (grade >= 80) return 'var(--color-success)';
    if (grade >= 60) return 'var(--color-primary)';
    if (grade >= 40) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const weeksBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const [startY, startM, startD] = String(startDate).split('T')[0].split('-').map(Number);
    const [endY, endM, endD] = String(endDate).split('T')[0].split('-').map(Number);
    const start = new Date(Date.UTC(startY, (startM ?? 1) - 1, startD ?? 1));
    const end = new Date(Date.UTC(endY, (endM ?? 1) - 1, endD ?? 1));
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    const diffDays = Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
    return Math.floor(diffDays / 7);
  };

  const studentProgressMap = useMemo(() => {
    const map = new Map();

    logs.forEach((log) => {
      const regNumber = log.student?.regNumber;
      if (!regNumber) return;

      const current = map.get(regNumber) ?? {
        totalAssessable: 0,
        assessedWeeks: 0,
        pendingAssessment: 0,
        grades: [],
      };

      if (log.status !== 'draft') {
        current.totalAssessable += 1;
      }
      if (['assessed', 'closed'].includes(log.status)) {
        current.assessedWeeks += 1;
      }
      if (log.status === 'endorsed') {
        current.pendingAssessment += 1;
      }
      if (log.academicGrade !== null && log.academicGrade !== undefined && !Number.isNaN(Number(log.academicGrade))) {
        current.grades.push(Number(log.academicGrade));
      }

      map.set(regNumber, current);
    });

    return map;
  }, [logs]);

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
              <th>Organisation</th>
              <th>Progress</th>
              <th>Avg. Grade</th>
              <th>Pending</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => {
              const progress = studentProgressMap.get(student.regNumber) ?? {
                totalAssessable: 0,
                assessedWeeks: 0,
                pendingAssessment: 0,
                grades: [],
              };
              const expectedWeeks = weeksBetween(student.startDate, student.endDate);
              const totalWeeks =
                expectedWeeks > 0
                  ? expectedWeeks
                  : progress.totalAssessable;
              const assessedWeeks =
                totalWeeks > 0
                  ? Math.min(progress.assessedWeeks, totalWeeks)
                  : 0;
              const averageGrade = progress.grades.length
                ? progress.grades.reduce((sum, grade) => sum + grade, 0) / progress.grades.length
                : null;

              return (
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
                      <small className="text-muted">{student.studentId ?? student.regNumber}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{student.programme}</div>
                  <small className="text-muted">Year {student.year}</small>
                </td>
                <td>
                  <div style={{ fontSize: '0.9rem' }}>{student.organisation}</div>
                  <small className="text-muted">{student.department}</small>
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
                        width: `${getProgressPercentage(assessedWeeks, totalWeeks)}%`,
                        height: '100%',
                        background: 'var(--color-primary)',
                        borderRadius: '3px'
                      }} />
                    </div>
                    <small className="text-muted">
                      {assessedWeeks}/{totalWeeks}
                    </small>
                  </div>
                </td>
                <td>
                  <span style={{ 
                    fontWeight: '600', 
                    color: getGradeColor(averageGrade ?? 0) 
                  }}>
                    {averageGrade !== null ? `${averageGrade.toFixed(0)}%` : '-'}
                  </span>
                </td>
                <td>
                  {progress.pendingAssessment > 0 ? (
                    <span className="warning">{progress.pendingAssessment} log{progress.pendingAssessment > 1 ? 's' : ''}</span>
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
              );
            })}
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

import React, { useState, useMemo } from 'react';
import './StudentsPage.css';
import Pagination from '../../components/Pagination';
import usePagination from '../../hooks/usePagination';
import { 
  formatDate, 
  getOrganisationTypeLabel, 
  getStatusLabel,
  organisationTypes,
  calculateDurationWeeks
} from '../../data/dashboardData';

export default function ActiveInternshipsPage({ placements }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'active',
    organisationType: '',
    workplaceSupervisor: '',
  });

  // Filter only active/approved/completed placements
  const relevantPlacements = useMemo(() => {
    return placements.filter(p => ['active', 'approved', 'completed'].includes(p.status));
  }, [placements]);

  // Apply search and filters
  const filteredPlacements = useMemo(() => {
    return relevantPlacements.filter(placement => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        placement.student.name.toLowerCase().includes(searchLower) ||
        placement.student.regNumber.toLowerCase().includes(searchLower) ||
        placement.organisationName.toLowerCase().includes(searchLower);

      const matchesStatus = !filters.status || placement.status === filters.status;
      const matchesOrgType = !filters.organisationType || placement.organisationType === filters.organisationType;
      const matchesSupervisor = !filters.workplaceSupervisor || 
        placement.workplaceSupervisor === Number(filters.workplaceSupervisor);

      return matchesSearch && matchesStatus && matchesOrgType && matchesSupervisor;
    });
  }, [relevantPlacements, searchTerm, filters]);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedPlacements,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
  } = usePagination(filteredPlacements);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const clearFilters = () => {
    setFilters({ status: '', organisationType: '', workplaceSupervisor: '' });
    setSearchTerm('');
    resetPagination();
  };

  const hasActiveFilters = filters.organisationType || filters.workplaceSupervisor;

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'approved': return 'info';
      case 'completed': return 'muted';
      default: return '';
    }
  };

  const activeCount = relevantPlacements.filter(p => p.status === 'active').length;
  const completedCount = relevantPlacements.filter(p => p.status === 'completed').length;

  return (
    <div className="internships-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Active Internships</h1>
          <p className="subtitle">Monitor ongoing and completed internship placements</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="material-icons-sharp">work</span>
            <span className="stat-value">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-badge secondary">
            <span className="material-icons-sharp">verified</span>
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="material-icons-sharp">search</span>
          <input
            type="text"
            placeholder="Search by student name, reg. number, organisation..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); resetPagination(); }}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <span className="material-icons-sharp">close</span>
            </button>
          )}
        </div>
        
        <div className="toolbar-actions">
          <button 
            className={`btn-filter ${filterOpen ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <span className="material-icons-sharp">filter_list</span>
            Filter
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="approved">Approved (Not Started)</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Organisation Type</label>
            <select 
              value={filters.organisationType}
              onChange={(e) => handleFilterChange('organisationType', e.target.value)}
            >
              <option value="">All Types</option>
              {organisationTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Workplace Supervisor</label>
            <select 
              value={filters.workplaceSupervisor}
              onChange={(e) => handleFilterChange('workplaceSupervisor', e.target.value)}
            >
              <option value="">All Supervisors</option>
              {workplaceSupervisors.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.name}</option>
              ))}
            </select>
          </div>
          
          {hasActiveFilters && (
            <button className="btn-clear-filters" onClick={clearFilters}>
              <span className="material-icons-sharp">clear_all</span>
              Clear
            </button>
          )}
        </div>
      )}

      {/* Results Info */}
      <div className="results-info">
        Showing {paginatedPlacements.length} of {filteredPlacements.length} internships
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Organisation</th>
              <th>Department</th>
              <th>Duration</th>
              <th>Supervisors</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlacements.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-results">
                  <span className="material-icons-sharp">search_off</span>
                  <p>No internships found</p>
                  {(searchTerm || hasActiveFilters) && (
                    <button onClick={clearFilters}>Clear filters</button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedPlacements.map(placement => {
                const weeks = calculateDurationWeeks(placement.startDate, placement.endDate);
                
                return (
                  <tr key={placement.id}>
                    <td className="name-cell">
                      <div className="name-info">
                        <span className="full-name">{placement.student.name}</span>
                        <span className="email">{placement.student.regNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div className="org-info">
                        <span className="org-name">{placement.organisationName}</span>
                        <span className="org-type">{getOrganisationTypeLabel(placement.organisationType)}</span>
                      </div>
                    </td>
                    <td>{placement.department}</td>
                    <td>
                      <div className="duration-info">
                        <span>{formatDate(placement.startDate)} - {formatDate(placement.endDate)}</span>
                        <span className="duration-weeks">{weeks} weeks</span>
                      </div>
                    </td>
                    <td>
                      <div className="supervisors-cell">
                        <span className="wp-sup" title="Workplace Supervisor">
                          <span className="material-icons-sharp">work</span>
                          {placement.workplaceSupervisorName || 'Not assigned'}
                        </span>
                        <span className="ac-sup" title="Academic Supervisor">
                          <span className="material-icons-sharp">school</span>
                          {placement.academicSupervisorName || 'Not assigned'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(placement.status)}`}>
                        {getStatusLabel(placement.status)}
                      </span>
                    </td>
                    <td>
                      <button className="btn-action">
                        <span className="material-icons-sharp">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPlacements.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}

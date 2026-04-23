import React, { useState, useMemo } from 'react';
import { accountStatusChoices } from '../../data/dashboardData';

export default function SupervisorsPage({ workplaceSupervisors, academicSupervisors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    accountStatus: '',
  });

   // Combine all supervisors
  const allSupervisors = useMemo(() => {
    const wpSups = workplaceSupervisors.map(s => ({ ...s, role: 'workplace_supervisor' }));
    const acSups = academicSupervisors.map(s => ({ ...s, role: 'academic_supervisor' }));
    return [...wpSups, ...acSups];
  }, [workplaceSupervisors, academicSupervisors]);
  // Apply search and filters
  const filteredSupervisors = useMemo(() => {
    return allSupervisors.filter(supervisor => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${supervisor.firstName} ${supervisor.lastName}`.toLowerCase();
      const matchesSearch = !searchTerm || 
        fullName.includes(searchLower) ||
        supervisor.email.toLowerCase().includes(searchLower) ||
        (supervisor.organisation && supervisor.organisation.toLowerCase().includes(searchLower)) ||
        (supervisor.department && supervisor.department.toLowerCase().includes(searchLower));

      const matchesRole = !filters.role || supervisor.role === filters.role;
      const matchesStatus = !filters.accountStatus || supervisor.accountStatus === filters.accountStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allSupervisors, searchTerm, filters]);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedSupervisors,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
  } = usePagination(filteredSupervisors);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const clearFilters = () => {
    setFilters({ role: '', accountStatus: '' });
    setSearchTerm('');
    resetPagination();
  };

  const hasActiveFilters = filters.role || filters.accountStatus;

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'registered': return 'warning';
      case 'suspended': return 'danger';
      case 'deactivated': return 'muted';
      default: return '';
    }
  };

  const getRoleLabel = (role) => {
    return role === 'workplace_supervisor' ? 'Workplace' : 'Academic';
  };

  const getRoleClass = (role) => {
    return role === 'workplace_supervisor' ? 'info' : 'success';
  };

  return (
    <div className="supervisors-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Supervisors</h1>
          <p className="subtitle">Manage workplace and academic supervisors</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="material-icons-sharp">work</span>
            <span className="stat-value">{workplaceSupervisors.length}</span>
            <span className="stat-label">Workplace</span>
          </div>
          <div className="stat-badge secondary">
            <span className="material-icons-sharp">school</span>
            <span className="stat-value">{academicSupervisors.length}</span>
            <span className="stat-label">Academic</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="material-icons-sharp">search</span>
          <input
            type="text"
            placeholder="Search by name, email, organisation, department..."
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
            <label>Supervisor Type</label>
            <select 
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="workplace_supervisor">Workplace Supervisors</option>
              <option value="academic_supervisor">Academic Supervisors</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.accountStatus}
              onChange={(e) => handleFilterChange('accountStatus', e.target.value)}
            >
              <option value="">All Statuses</option>
              {accountStatusChoices.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
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
        Showing {paginatedSupervisors.length} of {filteredSupervisors.length} supervisors
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Supervisor</th>
              <th>Type</th>
              <th>Organisation/Department</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSupervisors.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  <span className="material-icons-sharp">search_off</span>
                  <p>No supervisors found</p>
                  {(searchTerm || hasActiveFilters) && (
                    <button onClick={clearFilters}>Clear filters</button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedSupervisors.map(supervisor => (
                <tr key={`${supervisor.role}-${supervisor.id}`}>
                  <td className="name-cell">
                    <div className="name-info">
                      <span className="full-name">{supervisor.firstName} {supervisor.lastName}</span>
                      <span className="email">{supervisor.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getRoleClass(supervisor.role)}`}>
                      {getRoleLabel(supervisor.role)}
                    </span>
                  </td>
                  <td>
                    <div className="supervisor-info">
                      <span className="supervisor-name">
                        {supervisor.organisation || supervisor.department}
                      </span>
                      <span className="supervisor-role">
                        {supervisor.jobTitle || supervisor.faculty}
                      </span>
                    </div>
                  </td>
                  <td className="contact-cell">{supervisor.phone}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(supervisor.accountStatus)}`}>
                      {accountStatusChoices.find(s => s.value === supervisor.accountStatus)?.label || supervisor.accountStatus}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action">
                      <span className="material-icons-sharp">visibility</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredSupervisors.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}

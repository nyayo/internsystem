import React, { useState, useMemo } from 'react';
import './PendingApprovals.css';
import PlacementDetailsModal from '../../components/modals/PlacementDetailsModal';
import Pagination from '../../components/Pagination';
import usePagination from '../../hooks/usePagination';
import { 
  getOrganisationTypeLabel, 
  getStatusLabel, 
  formatDate,
  organisationTypes,
  intakeCohorts 
} from '../../data/dashboardData';

export default function PendingApprovals({ placements, onUpdatePlacement }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    organisationType: '',
    intakeCohort: '',
    district: '',
  });
  const [selectedPlacement, setSelectedPlacement] = useState(null);

  // Get unique districts for filter
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(placements.map(p => p.organisationDistrict))];
    return uniqueDistricts.sort();
  }, [placements]);

  // Filter only pending placements
  const pendingPlacements = useMemo(() => {
    return placements.filter(p => p.status === 'pending_approval');
  }, [placements]);

  // Apply search and filters
  const filteredPlacements = useMemo(() => {
    return pendingPlacements.filter(placement => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        placement.student.name.toLowerCase().includes(searchLower) ||
        placement.student.regNumber.toLowerCase().includes(searchLower) ||
        placement.organisationName.toLowerCase().includes(searchLower) ||
        placement.department.toLowerCase().includes(searchLower);

      // Organisation type filter
      const matchesOrgType = !filters.organisationType || 
        placement.organisationType === filters.organisationType;

      // Intake cohort filter
      const matchesCohort = !filters.intakeCohort || 
        placement.intakeCohort === filters.intakeCohort;

      // District filter
      const matchesDistrict = !filters.district || 
        placement.organisationDistrict === filters.district;

      return matchesSearch && matchesOrgType && matchesCohort && matchesDistrict;
    });
  }, [pendingPlacements, searchTerm, filters]);

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
    setFilters({
      organisationType: '',
      intakeCohort: '',
      district: '',
    });
    setSearchTerm('');
    resetPagination();
  };

  const hasActiveFilters = filters.organisationType || filters.intakeCohort || filters.district;

  return (
    <div className="pending-approvals-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Pending Approvals</h1>
          <p className="subtitle">Review and process internship placement applications</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="material-icons-sharp">pending_actions</span>
            <span className="stat-value">{pendingPlacements.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="material-icons-sharp">search</span>
          <input
            type="text"
            placeholder="Search by student name, reg. number, organisation..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              resetPagination();
            }}
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
            {hasActiveFilters && <span className="filter-count">!</span>}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="filter-panel">
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
            <label>Intake Cohort</label>
            <select 
              value={filters.intakeCohort}
              onChange={(e) => handleFilterChange('intakeCohort', e.target.value)}
            >
              <option value="">All Cohorts</option>
              {intakeCohorts.map(cohort => (
                <option key={cohort.value} value={cohort.value}>{cohort.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>District</label>
            <select 
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
          
          {hasActiveFilters && (
            <button className="btn-clear-filters" onClick={clearFilters}>
              <span className="material-icons-sharp">clear_all</span>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Results Info */}
      <div className="results-info">
        Showing {filteredPlacements.length} of {pendingPlacements.length} pending applications
      </div>

      {/* Placements Table */}
      <div className="table-container">
        <table className="placements-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Organisation</th>
              <th>Department</th>
              <th>Duration</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPlacements.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-results">
                  <span className="material-icons-sharp">search_off</span>
                  <p>No pending applications found</p>
                  {(searchTerm || hasActiveFilters) && (
                    <button onClick={clearFilters}>Clear filters</button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedPlacements.map(placement => (
                <tr key={placement.id}>
                  <td className="student-cell">
                    <div className="student-info">
                      <span className="student-name">{placement.student.name}</span>
                      <span className="student-reg">{placement.student.regNumber}</span>
                      <span className="student-program">{placement.student.program}</span>
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
                      <span>{formatDate(placement.startDate)}</span>
                      <span className="duration-separator">→</span>
                      <span>{formatDate(placement.endDate)}</span>
                    </div>
                  </td>
                  <td className="date-cell">{formatDate(placement.createdAt)}</td>
                  <td>
                    <span className="status-badge pending">
                      {getStatusLabel(placement.status)}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-details"
                      onClick={() => setSelectedPlacement(placement)}
                    >
                      <span className="material-icons-sharp">visibility</span>
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filteredPlacements.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPlacements.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
          }}
        />
      )}
      </div>

      {/* Placement Details Modal */}
      {selectedPlacement && (
        <PlacementDetailsModal
          placement={selectedPlacement}
          onClose={() => setSelectedPlacement(null)}
          onSave={(updatedPlacement) => {
            onUpdatePlacement(updatedPlacement);
            setSelectedPlacement(null);
          }}
        />
      )}
    </div>
  );
}

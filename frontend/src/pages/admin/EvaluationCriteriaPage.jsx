import React, { useState, useMemo } from "react";
import "./StudentsPage.css";
import "./EvaluationCriteriaPage.css";
import Pagination from "../../components/Pagination";
import CriteriaModal from "../../components/modals/CriteriaModal";
import usePagination from "../../hooks/usePagination";
import {
  categoryOptions,
  evaluatorRoleOptions,
  getCategoryDisplay,
  getEvaluatorDisplay,
} from "../../data/dashboardData";

export default function EvaluationCriteriaPage({
  criteria,
  onAddCriteria,
  onUpdateCriteria,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    evaluatorRole: "",
    isActive: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const truncateDescription = (value, max = 110) => {
    const text = String(value ?? "");
    if (text.length <= max) return text;
    return `${text.slice(0, max).trimEnd()}...`;
  };

  // Apply search and filters
  const filteredCriteria = useMemo(() => {
    return criteria.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower);

      const matchesCategory =
        !filters.category || item.category === filters.category;
      const matchesEvaluator =
        !filters.evaluatorRole || item.evaluatorRole === filters.evaluatorRole;
      const matchesActive =
        filters.isActive === "" ||
        (filters.isActive === "true" ? item.isActive : !item.isActive);

      return (
        matchesSearch && matchesCategory && matchesEvaluator && matchesActive
      );
    });
  }, [criteria, searchTerm, filters]);

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedCriteria,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
  } = usePagination(filteredCriteria);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const clearFilters = () => {
    setFilters({ category: "", evaluatorRole: "", isActive: "" });
    setSearchTerm("");
    resetPagination();
  };

  const hasActiveFilters =
    filters.category || filters.evaluatorRole || filters.isActive !== "";

  const handleAddClick = () => {
    setEditingCriteria(null);
    setShowModal(true);
  };

  const handleEditClick = (item) => {
    setEditingCriteria(item);
    setShowModal(true);
  };

  const handleSaveCriteria = (criteriaData) => {
    if (editingCriteria) {
      onUpdateCriteria(criteriaData);
    } else {
      onAddCriteria(criteriaData);
    }
    setShowModal(false);
    setEditingCriteria(null);
  };

  const totalScore = criteria.reduce(
    (sum, c) => sum + (c.isActive ? c.maxScore : 0),
    0,
  );

  const getCategoryClass = (category) => {
    const classes = {
      professional_conduct: "professional",
      technical_skills: "technical",
      communication: "communication",
      initiative: "initiative",
      teamwork: "teamwork",
      punctuality: "punctuality",
    };
    return classes[category] || "";
  };

  return (
    <div className="criteria-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Evaluation Criteria</h1>
          <p className="subtitle">
            Define and manage internship assessment criteria
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="material-icons-sharp">fact_check</span>
            <span className="stat-value">
              {criteria.filter((c) => c.isActive).length}
            </span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-badge secondary">
            <span className="material-icons-sharp">score</span>
            <span className="stat-value">{totalScore}</span>
            <span className="stat-label">Total Points</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="material-icons-sharp">search</span>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              resetPagination();
            }}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <span className="material-icons-sharp">close</span>
            </button>
          )}
        </div>

        <div className="toolbar-actions">
          <button
            className={`btn-filter ${filterOpen ? "active" : ""} ${hasActiveFilters ? "has-filters" : ""}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <span className="material-icons-sharp">filter_list</span>
            Filter
          </button>
          <button className="btn-add" onClick={handleAddClick}>
            <span className="material-icons-sharp">add</span>
            Add Criteria
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">All Categories</option>
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Evaluator</label>
            <select
              value={filters.evaluatorRole}
              onChange={(e) =>
                handleFilterChange("evaluatorRole", e.target.value)
              }
            >
              <option value="">All Evaluators</option>
              {evaluatorRoleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange("isActive", e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
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
        Showing {paginatedCriteria.length} of {filteredCriteria.length} criteria
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Max Score</th>
              <th>Evaluator</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCriteria.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  <span className="material-icons-sharp">search_off</span>
                  <p>No criteria found</p>
                  {(searchTerm || hasActiveFilters) && (
                    <button onClick={clearFilters}>Clear filters</button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedCriteria.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="criteria-title-cell">
                      <span
                        className={`criteria-dot ${getCategoryClass(item.category)}`}
                      ></span>
                      <div className="criteria-info">
                        <span className="criteria-name">{item.title}</span>
                        <span
                          className="criteria-desc"
                          title={item.description}
                        >
                          {truncateDescription(item.description)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{getCategoryDisplay(item.category)}</td>
                  <td>
                    <span className="score-badge">{item.maxScore} pts</span>
                  </td>
                  <td>{getEvaluatorDisplay(item.evaluatorRole)}</td>
                  <td>
                    <span
                      className={`status-badge ${item.isActive ? "success" : "muted"}`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => handleEditClick(item)}
                    >
                      <span className="material-icons-sharp">edit</span>
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
          totalItems={filteredCriteria.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Criteria Modal */}
      {showModal && (
        <CriteriaModal
          criteria={editingCriteria}
          onClose={() => {
            setShowModal(false);
            setEditingCriteria(null);
          }}
          onSave={handleSaveCriteria}
        />
      )}
    </div>
  );
}

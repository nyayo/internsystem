import React, { useState, useMemo } from "react";
import "./StudentsPage.css";
import Pagination from "../../components/Pagination";
import { accountStatusChoices } from "../../data/dashboardData";
import usePagination from "../../hooks/usePagination";

export default function StudentsPage({ students }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    programme: "",
    yearOfStudy: "",
    accountStatus: "",
    university: "",
  });
  // Get unique values for filters
  const programmes = useMemo(
    () => [...new Set(students.map((s) => s.programme))].sort(),
    [students],
  );
  const faculties = useMemo(
    () => [...new Set(students.map((s) => s.university))].sort(),
    [students],
  );
  const yearsOfStudy = useMemo(
    () =>
      [...new Set(students.map((s) => s.yearOfStudy))].sort((a, b) => a - b),
    [students],
  );

  // Apply search and filters
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchLower) ||
        student.studentNumber.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.programme.toLowerCase().includes(searchLower);

      const matchesProgramme =
        !filters.programme || student.programme === filters.programme;
      const matchesYear =
        !filters.yearOfStudy ||
        student.yearOfStudy === Number(filters.yearOfStudy);
      const matchesStatus =
        !filters.accountStatus ||
        student.accountStatus === filters.accountStatus;
      const matchesFaculty =
        !filters.university || student.university === filters.university;

      return (
        matchesSearch &&
        matchesProgramme &&
        matchesYear &&
        matchesStatus &&
        matchesFaculty
      );
    });
  }, [students, searchTerm, filters]);
  console.log("Students", students)

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedStudents,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
  } = usePagination(filteredStudents);
  console.log("Paginated Students", paginatedStudents);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const clearFilters = () => {
    setFilters({
      programme: "",
      yearOfStudy: "",
      accountStatus: "",
      university: "",
    });
    setSearchTerm("");
    resetPagination();
  };

  const hasActiveFilters =
    filters.programme ||
    filters.yearOfStudy ||
    filters.accountStatus ||
    filters.university;

  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "registered":
        return "warning";
      case "suspended":
        return "danger";
      case "deactivated":
        return "muted";
      default:
        return "";
    }
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Students</h1>
          <p className="subtitle">
            Manage registered students in the internship program
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="material-icons-sharp">school</span>
            <span className="stat-value">{students.length}</span>
            <span className="stat-label">Total Students</span>
          </div>
        </div>
      </div>
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span className="material-icons-sharp">search</span>
          <input
            type="text"
            placeholder="Search by name, student number, email, programme..."
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
        </div>
      </div>
      {/* Filter Panel */}
      {filterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Programme</label>
            <select
              value={filters.programme}
              onChange={(e) => handleFilterChange("programme", e.target.value)}
            >
              <option value="">All Programmes</option>
              {programmes.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Year of Study</label>
            <select
              value={filters.yearOfStudy}
              onChange={(e) =>
                handleFilterChange("yearOfStudy", e.target.value)
              }
            >
              <option value="">All Years</option>
              {yearsOfStudy.map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>University</label>
            <select
              value={filters.university}
              onChange={(e) => handleFilterChange("university", e.target.value)}
            >
              <option value="">All Universities</option>
              {faculties.map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.accountStatus}
              onChange={(e) =>
                handleFilterChange("accountStatus", e.target.value)
              }
            >
              <option value="">All Statuses</option>
              {accountStatusChoices.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
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
        Showing {paginatedStudents.length} of {filteredStudents.length} students
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student No.</th>
              <th>Programme</th>
              <th>Year</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-results">
                  <span className="material-icons-sharp">search_off</span>
                  <p>No students found</p>
                  {(searchTerm || hasActiveFilters) && (
                    <button onClick={clearFilters}>Clear filters</button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => (
                <tr key={student.id}>
                  <td className="name-cell">
                    <div className="name-info">
                      <span className="full-name">
                        {student.firstName} {student.lastName}
                      </span>
                      <span className="email">{student.email}</span>
                    </div>
                  </td>
                  <td className="student-number">{student.studentName}</td>
                  <td>
                    <div className="programme-info">
                      <span className="programme">{student.programme}</span>
                      <span className="faculty">{student.university}</span>
                    </div>
                  </td>
                  <td className="year-cell">Year {student.yearOfStudy}</td>
                  <td className="contact-cell">{student.phone}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(student.accountStatus)}`}
                    >
                      {accountStatusChoices.find(
                        (s) => s.value === student.accountStatus,
                      )?.label || student.accountStatus}
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
          totalItems={filteredStudents.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
}

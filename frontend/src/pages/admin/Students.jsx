export default function StudentsPage({ students }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    programme: '',
    yearOfStudy: '',
    accountStatus: '',
    faculty: '',
  });
  // Get unique values for filters
  const programmes = useMemo(() => [...new Set(students.map(s => s.programme))].sort(), [students]);
  const faculties = useMemo(() => [...new Set(students.map(s => s.faculty))].sort(), [students]);
  const yearsOfStudy = useMemo(() => [...new Set(students.map(s => s.yearOfStudy))].sort((a, b) => a - b), [students]);

  // Apply search and filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchLower) ||
        student.studentNumber.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower) ||
        student.programme.toLowerCase().includes(searchLower);

      const matchesProgramme = !filters.programme || student.programme === filters.programme;
      const matchesYear = !filters.yearOfStudy || student.yearOfStudy === Number(filters.yearOfStudy);
      const matchesStatus = !filters.accountStatus || student.accountStatus === filters.accountStatus;
      const matchesFaculty = !filters.faculty || student.faculty === filters.faculty;

      return matchesSearch && matchesProgramme && matchesYear && matchesStatus && matchesFaculty;
    });
  }, [students, searchTerm, filters]);

const {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems: paginatedStudents,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
  } = usePagination(filteredStudents);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    resetPagination();
  };

  const clearFilters = () => {
    setFilters({ programme: '', yearOfStudy: '', accountStatus: '', faculty: '' });
    setSearchTerm('');
    resetPagination();
  };

  const hasActiveFilters = filters.programme || filters.yearOfStudy || filters.accountStatus || filters.faculty;

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'registered': return 'warning';
      case 'suspended': return 'danger';
      case 'deactivated': return 'muted';
      default: return '';
    }
  };

return (
    <div className="students-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Students</h1>
          <p className="subtitle">Manage registered students in the internship program</p>
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
            <label>Programme</label>
            <select 
              value={filters.programme}
              onChange={(e) => handleFilterChange('programme', e.target.value)}
            >
              <option value="">All Programmes</option>
              {programmes.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Year of Study</label>
            <select 
              value={filters.yearOfStudy}
              onChange={(e) => handleFilterChange('yearOfStudy', e.target.value)}
            >
              <option value="">All Years</option>
              {yearsOfStudy.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Faculty</label>
            <select 
              value={filters.faculty}
              onChange={(e) => handleFilterChange('faculty', e.target.value)}
            >
              <option value="">All Faculties</option>
              {faculties.map(fac => (
                <option key={fac} value={fac}>{fac}</option>
              ))}
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
 {/* Filter Panel */}
      {filterOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Programme</label>
            <select 
              value={filters.programme}
              onChange={(e) => handleFilterChange('programme', e.target.value)}
            >
              <option value="">All Programmes</option>
              {programmes.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Year of Study</label>
            <select 
              value={filters.yearOfStudy}
              onChange={(e) => handleFilterChange('yearOfStudy', e.target.value)}
            >
              <option value="">All Years</option>
              {yearsOfStudy.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Faculty</label>
            <select 
              value={filters.faculty}
              onChange={(e) => handleFilterChange('faculty', e.target.value)}
            >
              <option value="">All Faculties</option>
              {faculties.map(fac => (
                <option key={fac} value={fac}>{fac}</option>
              ))}
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

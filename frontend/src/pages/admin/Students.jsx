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
      
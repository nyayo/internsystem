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
      
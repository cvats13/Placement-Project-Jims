import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { LoginPage } from './pages/LoginPage';
import { Sidebar } from './components/Sidebar';
import { EnhancedTopBar } from './components/EnhancedTopBar';
import { StudentFilters } from './components/StudentFilters';
import { StudentTable } from './components/StudentTable';
import { SelectionActionBar } from './components/SelectionActionBar';
import { EmailModal } from './components/EmailModal';
import { StudentProfile } from './pages/StudentProfile';
import { AdminUploadPanel } from './pages/AdminUploadPanel';
import { BulkPasteModal } from './components/BulkPasteModal';
import { BulkSearchIndicator } from './components/BulkSearchIndicator';
import { FilterResultIndicator } from './components/ui/FilterResultIndicator';
import { EmptySearchState } from './components/ui/EmptySearchState';

// Mock student data
const generateMockStudents = () => {
  const branches = ['BCA', 'MCA', 'BBA'];
  const names = [
    'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh', 'Vikram Reddy',
    'Anjali Gupta', 'Karan Mehta', 'Pooja Verma', 'Arjun Nair', 'Divya Iyer',
    'Rohan Das', 'Neha Kapoor', 'Aditya Joshi', 'Kavya Rao', 'Siddharth Shah',
    'Riya Desai', 'Varun Agarwal', 'Tanvi Malhotra', 'Harsh Mishra', 'Ishita Saxena'
  ];
  
  const skills = [
    ['JavaScript', 'React', 'Node.jsx', 'MongoDB'],
    ['Python', 'Django', 'PostgreSQL', 'AWS'],
    ['Java', 'Spring Boot', 'MySQL', 'Microservices'],
    ['C++', 'Data Structures', 'Algorithms', 'Problem Solving'],
    ['HTML', 'CSS', 'TypeScript', 'Next.jsx'],
    ['Angular', 'Vue.jsx', 'Express', 'GraphQL'],
    ['Flutter', 'Dart', 'Firebase', 'Mobile Dev'],
    ['React Native', 'Redux', 'REST API', 'Git'],
  ];

  return names.map((name, i) => ({
    student_id: i + 1,
    roll_no: `2024${branches[i % 3]}${(i + 1).toString().padStart(3, '0')}`,
    name,
    branch: branches[i % 3],
    semester: Math.floor(Math.random() * 6) + 1,
    cgpa: parseFloat((Math.random() * 2 + 7).toFixed(2)),
    backlogs: Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0,
    phone: `+91 98765${String(i).padStart(5, '0')}`,
    email: `${name.toLowerCase().replace(' ', '.')}@college.edu`,
    skills: skills[i % skills.length],
    resume_url: `https://example.com/resumes/${name.toLowerCase().replace(' ', '-')}.pdf`,
    github: Math.random() > 0.5 ? `https://github.com/${name.toLowerCase().replace(' ', '')}` : undefined,
    leetcode: Math.random() > 0.5 ? `https://leetcode.com/${name.toLowerCase().replace(' ', '')}` : undefined,
    avgCIA: Math.floor(Math.random() * 30) + 70,
    avgMockTest: Math.floor(Math.random() * 30) + 70,
  }));
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [activeView, setActiveView] = useState('students');
  const [students, setStudents] = useState(generateMockStudents());
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTokens, setSearchTokens] = useState([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isBulkPasteModalOpen, setIsBulkPasteModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    course: 'all',
    ciaThreshold: 0,
    mockTestThreshold: 0,
    company: 'all',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/students');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        
        // Ensure skills are parsed if they come as string, though MySQL JSON should be objects
        const formattedData = data.map(s => ({
          ...s,
          skills: typeof s.skills === 'string' ? JSON.parse(s.skills) : (s.skills || [])
        }));

        setStudents(formattedData);
        setFilteredStudents(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.message);
        // Fallback to mock data if backend fails for now
        const mock = generateMockStudents();
        setStudents(mock);
        setFilteredStudents(mock);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    if (role === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('students');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setActiveView('students');
    setSelectedStudents([]);
    setSelectedStudent(null);
  };

  const handleApplyFilters = () => {
    let filtered = [...students];

    // Filter by course
    if (filters.course !== 'all') {
      filtered = filtered.filter(s => s.branch === filters.course);
    }

    // Filter by CIA threshold
    if (filters.ciaThreshold > 0) {
      filtered = filtered.filter(s => (s.avgCIA || 0) >= filters.ciaThreshold);
    }

    // Filter by mock test threshold
    if (filters.mockTestThreshold > 0) {
      filtered = filtered.filter(s => (s.avgMockTest || 0) >= filters.mockTestThreshold);
    }

    // Filter by search tokens (bulk search)
    if (searchTokens.length > 0) {
      filtered = filtered.filter(s => 
        searchTokens.some(token => 
          s.name.toLowerCase().includes(token.toLowerCase()) ||
          s.roll_no.toLowerCase().includes(token.toLowerCase())
        )
      );
    }

    setFilteredStudents(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      course: 'all',
      ciaThreshold: 0,
      mockTestThreshold: 0,
      company: 'all',
    });
    setSearchTokens([]);
    setFilteredStudents(students);
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = (selected) => {
    setSelectedStudents(selected ? filteredStudents.map(s => s.student_id) : []);
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  const handleSendToCompany = () => {
    setIsEmailModalOpen(true);
  };

  const handleDataUploaded = (newStudents) => {
    setStudents(prev => [...prev, ...newStudents]);
    setFilteredStudents(prev => [...prev, ...newStudents]);
  };

  // Handle search tokens change and auto-apply filters
  const handleSearchTokensChange = (tokens) => {
    setSearchTokens(tokens);
    
    // Auto-apply filters when tokens change
    let filtered = [...students];

    // Apply existing filters
    if (filters.course !== 'all') {
      filtered = filtered.filter(s => s.branch === filters.course);
    }
    if (filters.ciaThreshold > 0) {
      filtered = filtered.filter(s => (s.avgCIA || 0) >= filters.ciaThreshold);
    }
    if (filters.mockTestThreshold > 0) {
      filtered = filtered.filter(s => (s.avgMockTest || 0) >= filters.mockTestThreshold);
    }

    // Apply search tokens
    if (tokens.length > 0) {
      filtered = filtered.filter(s => 
        tokens.some(token => 
          s.name.toLowerCase().includes(token.toLowerCase()) ||
          s.roll_no.toLowerCase().includes(token.toLowerCase())
        )
      );
    }

    setFilteredStudents(filtered);
  };

  const handleBulkPasteApply = (names) => {
    handleSearchTokensChange([...searchTokens, ...names]);
  };

  const handleClearAllSearchTokens = () => {
    setSearchTokens([]);
    handleApplyFilters(); // Reapply other filters
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        onNavigate={setActiveView}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <EnhancedTopBar 
          searchTokens={searchTokens}
          onSearchTokensChange={handleSearchTokensChange}
          onBulkPasteClick={() => setIsBulkPasteModalOpen(true)}
          userRole={userRole}
          allStudents={students}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {selectedStudent ? (
            <StudentProfile 
              student={selectedStudent}
              onBack={handleBackToList}
            />
          ) : activeView === 'admin' ? (
            <AdminUploadPanel onDataUploaded={handleDataUploaded} />
          ) : activeView === 'students' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
                </div>
              </div>
              
              <BulkSearchIndicator 
                activeSearchCount={searchTokens.length}
                onClearAll={handleClearAllSearchTokens}
              />
              
              <StudentFilters
                filters={filters}
                onFilterChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
              
              <FilterResultIndicator
                matchedCount={filteredStudents.length}
                totalCount={students.length}
                searchTokenCount={searchTokens.length}
              />
              
              {filteredStudents.length === 0 && searchTokens.length > 0 ? (
                <EmptySearchState onClear={handleClearAllSearchTokens} />
              ) : (
                <StudentTable
                  students={filteredStudents}
                  selectedStudents={selectedStudents}
                  onSelectStudent={handleSelectStudent}
                  onSelectAll={handleSelectAll}
                  onViewProfile={handleViewProfile}
                  searchTokens={searchTokens}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
              </h2>
              <p className="text-gray-500 mt-2">This section is under development</p>
            </div>
          )}
        </main>
      </div>

      <SelectionActionBar
        selectedCount={selectedStudents.length}
        onSendToCompany={handleSendToCompany}
        onNotifyStudents={() => setIsEmailModalOpen(true)}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        selectedCount={selectedStudents.length}
      />

      <BulkPasteModal
        isOpen={isBulkPasteModalOpen}
        onClose={() => setIsBulkPasteModalOpen(false)}
        onApply={handleBulkPasteApply}
      />

      <Toaster />
    </div>
  );
}

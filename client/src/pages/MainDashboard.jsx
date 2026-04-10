import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from '../components/ui/sonner';
import { Sidebar } from '../components/Sidebar';
import { EnhancedTopBar } from '../components/EnhancedTopBar';
import { StudentFilters } from '../components/StudentFilters';
import { StudentTable } from '../components/StudentTable';
import { SelectionActionBar } from '../components/SelectionActionBar';
import { EmailModal } from '../components/EmailModal';
import { NotifyStudentsModal } from '../components/NotifyStudentsModal';
import { StudentProfile } from '../pages/StudentProfile';
import { AdminUploadPanel } from '../pages/AdminUploadPanel';
import { UserApproval } from '../pages/UserApproval';
import { BulkPasteModal } from '../components/BulkPasteModal';
import { BulkSearchIndicator } from '../components/BulkSearchIndicator';
import { FilterResultIndicator } from '../components/ui/FilterResultIndicator';
import { EmptySearchState } from '../components/ui/EmptySearchState';
import { Companies } from '../pages/Companies';
import useStudentStore from '../store/useStudentStore';
import useAuthStore from '../store/useAuthStore';

import { UserPending } from './UserPending';

export function MainDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const userRole = user?.role;


  const {
    students,
    filteredStudents,
    filters,
    searchTokens,
    isLoading,
    error,
    fetchStudents,
    setFilters,
    setSearchTokens,
    resetFilters,
  } = useStudentStore();

  const path = location.pathname.replace(/^\/+/, '');
  const activeView = path || (userRole === 'admin' ? 'admin' : 'students');

  useEffect(() => {
    if (location.pathname === '/') {
      const isValidRole = userRole === 'admin' || userRole === 'placement_officer' || userRole === 'user';
      if (!isValidRole) {
        logout(); // Force logout to clear invalid session and gracefully break infinite redirects
      } else {
        // Redirect to appropriate starting view
        const targetView = userRole === 'user' ? '/pending' : '/students';
        navigate(targetView, { replace: true });
      }
    }
  }, [location.pathname, navigate, userRole, logout]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Reset selected student when navigating between sidebar views
  useEffect(() => {
    setSelectedStudent(null);
  }, [location.pathname]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isBulkPasteModalOpen, setIsBulkPasteModalOpen] = useState(false);

  const handleNavigate = (view) => {
    navigate(`/${view}`);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Optimization: useMemo for calculations if needed, though Zustand handles most of it
  const matchedCount = filteredStudents.length;
  const totalCount = students.length;

  // Render Student's Pending View if role is student ('user')
  if (userRole === 'user') {
    return <UserPending />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userRole={userRole}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading && students.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error && students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-red-500 font-medium">{error}</p>
              <button 
                onClick={fetchStudents}
                className="mt-4 text-indigo-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : selectedStudent ? (
            <StudentProfile 
              student={selectedStudent}
              onBack={handleBackToList}
            />
          ) : activeView === 'admin' ? (
            <AdminUploadPanel />
          ) : activeView === 'students' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Student</h2>
                </div>
              </div>
              
              <BulkSearchIndicator 
                activeSearchCount={searchTokens.length}
                onClearAll={() => setSearchTokens([])}
              />
              
              <StudentFilters
                filters={filters}
                onFilterChange={setFilters}
                onApplyFilters={() => {}} // Store auto-applies
                onResetFilters={resetFilters}
                userRole={userRole}
                allStudents={students}
                searchTokens={searchTokens}
                onSearchTokensChange={setSearchTokens}
                onBulkPasteClick={() => setIsBulkPasteModalOpen(true)}
              />
              
              <FilterResultIndicator
                matchedCount={matchedCount}
                totalCount={totalCount}
                searchTokenCount={searchTokens.length}
              />
              
              {matchedCount === 0 && searchTokens.length > 0 ? (
                <EmptySearchState onClear={() => setSearchTokens([])} />
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
          ) : activeView === 'user-approval' ? (
            <UserApproval />
          ) : activeView === 'companies' ? (
            <Companies />
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
        onSendToCompany={() => setIsEmailModalOpen(true)}
        onNotifyStudents={() => setIsNotifyModalOpen(true)}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        selectedStudents={students.filter(s => selectedStudents.includes(s.student_id))}
      />

      <NotifyStudentsModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        selectedStudents={students.filter(s => selectedStudents.includes(s.student_id))}
      />

      <BulkPasteModal
        isOpen={isBulkPasteModalOpen}
        onClose={() => setIsBulkPasteModalOpen(false)}
        onApply={(names) => setSearchTokens([...searchTokens, ...names])}
      />

      <Toaster />
    </div>
  );
}

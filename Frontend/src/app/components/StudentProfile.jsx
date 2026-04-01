import { ArrowLeft, Github, Code, Mail, Phone, FileText, ExternalLink, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PlacementReadinessCard } from './PlacementReadinessCard';
import { SemesterAccordion } from './SemesterAccordion';
import { PerformanceCharts } from './PerformanceCharts';

// Generate comprehensive mock academic data
const generateMockAcademicData = (student) => {
  const subjects = {
    1: ['Programming Fundamentals', 'Mathematics I', 'Digital Logic', 'English Communication', 'Physics'],
    2: ['Data Structures', 'Mathematics II', 'Computer Organization', 'Database Management', 'Operating Systems'],
    3: ['Algorithms', 'Web Development', 'Software Engineering', 'Computer Networks', 'System Programming'],
    4: ['Machine Learning', 'Cloud Computing', 'Mobile App Dev', 'Information Security', 'Design Patterns'],
    5: ['AI & Deep Learning', 'Big Data Analytics', 'DevOps', 'Blockchain', 'IoT'],
    6: ['Advanced Topics', 'Capstone Project', 'Research Methods', 'Ethics in Tech', 'Industry Internship'],
  };

  const testTypes = ['Aptitude', 'Coding', 'Technical'];
  const semesters = [];

  for (let sem = 1; sem <= Math.min(student.semester, 6); sem++) {
    const semSubjects = subjects[sem] || subjects[3];
    
    // Generate CIA marks for each subject
    const ciaMarks = semSubjects.map(subject => {
      const cia1 = Math.floor(Math.random() * 5) + 15; // 15-20
      const cia2 = Math.floor(Math.random() * 5) + 15;
      const cia3 = Math.floor(Math.random() * 5) + 15;
      const cia4 = Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 15 : undefined;
      
      const scores = [cia1, cia2, cia3];
      if (cia4) scores.push(cia4);
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;

      return {
        subject,
        cia1,
        cia2,
        cia3,
        cia4,
        average,
      };
    });

    // Generate mock tests
    const numTests = Math.floor(Math.random() * 3) + 3; // 3-5 tests per semester
    const mockTests = [];
    
    for (let t = 1; t <= numTests; t++) {
      const testType = testTypes[Math.floor(Math.random() * testTypes.length)];
      const score = Math.floor(Math.random() * 30) + 65; // 65-95
      const percentile = Math.floor(Math.random() * 35) + 60; // 60-95
      
      const month = (sem - 1) * 2 + Math.floor(Math.random() * 2) + 1;
      const year = 2024;
      const day = Math.floor(Math.random() * 28) + 1;

      mockTests.push({
        testName: `Mock Test ${t}`,
        testType,
        score,
        percentile,
        date: `${day}/${month}/${year}`,
      });
    }

    const avgCIA = ciaMarks.reduce((sum, mark) => sum + mark.average, 0) / ciaMarks.length;
    const avgMockTest = mockTests.reduce((sum, test) => sum + test.score, 0) / mockTests.length;
    const sgpa = 7 + Math.random() * 2.5; // 7.0-9.5

    semesters.push({
      semesterNumber: sem,
      sgpa: parseFloat(sgpa.toFixed(2)),
      avgCIA: parseFloat(avgCIA.toFixed(1)),
      avgMockTest: parseFloat(avgMockTest.toFixed(1)),
      ciaMarks,
      mockTests,
    });
  }

  return semesters;
};

export function StudentProfile({ student, onBack }) {
  const academicData = generateMockAcademicData(student);
  
  const totalMockTests = academicData.reduce((sum, sem) => sum + sem.mockTests.length, 0);
  const avgMockScore = academicData.reduce((sum, sem) => 
    sum + sem.mockTests.reduce((s, t) => s + t.score, 0), 0
  ) / totalMockTests;
  
  // Calculate placement readiness score (weighted formula)
  const placementReadiness = Math.min(100, Math.round(
    student.cgpa * 10 + // 0-100 points
    (avgMockScore * 0.3) + // 0-30 points
    (student.backlogs === 0 ? 20 : 0) - // Bonus for no backlogs
    (student.backlogs * 10) // Penalty for backlogs
  ));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <p className="text-indigo-100 mt-1">{student.roll_no}</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
              {student.name.charAt(0)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Course</p>
              <Badge className="mt-1 bg-indigo-600">{student.branch}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Semester</p>
              <p className="font-semibold mt-1">{student.semester}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CGPA</p>
              <p className="font-semibold text-green-600 mt-1">{student.cgpa.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Backlogs</p>
              <p className={`font-semibold mt-1 ${student.backlogs === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {student.backlogs}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <span>{student.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4" />
              <span>{student.email}</span>
            </div>
            {student.github && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <a href={student.github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  GitHub Profile <ExternalLink className="w-3 h-3 inline" />
                </a>
              </div>
            )}
            {student.leetcode && (
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <a href={student.leetcode} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  LeetCode Profile <ExternalLink className="w-3 h-3 inline" />
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <a href={student.resume_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                Download Resume <ExternalLink className="w-3 h-3 inline" />
              </a>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placement Readiness Summary */}
      <PlacementReadinessCard
        cgpa={student.cgpa}
        totalMockTests={totalMockTests}
        avgMockScore={avgMockScore}
        readinessScore={placementReadiness}
      />

      {/* Academic Performance Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Academic Performance</h2>
        </div>

        {/* Performance Charts */}
        <PerformanceCharts semesters={academicData} />

        {/* Semester-wise Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Semester-wise Details</h3>
          <SemesterAccordion semesters={academicData} />
        </div>
      </div>
    </div>
  );
}

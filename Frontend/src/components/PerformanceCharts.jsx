import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import { TrendingUp, BarChart3, Target } from 'lucide-react';



export function PerformanceCharts({ semesters }) {
  // Prepare data for SGPA trend
  const sgpaData = semesters.map(sem => ({
    name: `Sem ${sem.semesterNumber}`,
    sgpa: sem.sgpa,
  }));

  // Prepare data for CIA distribution (aggregate by subject across semesters)
  const ciaBySubject = {};
  semesters.forEach(sem => {
    sem.ciaMarks.forEach(cia => {
      if (!ciaBySubject[cia.subject]) {
        ciaBySubject[cia.subject] = [];
      }
      ciaBySubject[cia.subject].push(cia.average);
    });
  });

  const ciaDistributionData = Object.entries(ciaBySubject).map(([subject, scores]) => ({
    subject: subject.length > 15 ? subject.substring(0, 15) + '...' : subject,
    average: scores.reduce((a, b) => a + b, 0) / scores.length,
  })).slice(0, 6); // Show top 6 subjects

  // Prepare data for mock test progress
  const mockTestData = [];
  semesters.forEach(sem => {
    sem.mockTests.forEach((test, idx) => {
      mockTestData.push({
        name: `${test.testName.substring(0, 10)}`,
        score: test.score,
        percentile: test.percentile,
      });
    });
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SGPA Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Semester SGPA Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sgpaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis domain={[0, 10]} fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sgpa" 
                stroke="#4f46e5" 
                strokeWidth={3}
                dot={{ fill: '#4f46e5', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CIA Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            CIA Avg by Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ciaDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="subject" fontSize={11} angle={-15} textAnchor="end" height={60} />
              <YAxis domain={[0, 20]} fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="average" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mock Test Progress */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Mock Test Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockTestData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={11} angle={-15} textAnchor="end" height={60} />
              <YAxis fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="score" fill="#4f46e5" name="Score" radius={[8, 8, 0, 0]} />
              <Bar dataKey="percentile" fill="#10b981" name="Percentile" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

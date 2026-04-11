import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { TrendingUp, BarChart3, Target } from 'lucide-react';

function cieMarkValue(cia) {
  if (cia.marks != null && cia.marks !== '') return parseFloat(cia.marks);
  if (cia.average != null && cia.average !== '') return parseFloat(cia.average);
  return NaN;
}

export function PerformanceCharts({ semesters }) {
  const sgpaData = semesters.map(sem => ({
    name: `Sem ${sem.semesterNumber}`,
    sgpa: sem.sgpa,
  }));

  // Aggregate by subject across semesters (mean of imported marks per subject)
  const ciaBySubject = {};
  semesters.forEach(sem => {
    sem.ciaMarks.forEach(cia => {
      const v = cieMarkValue(cia);
      if (!Number.isFinite(v)) return;
      if (!ciaBySubject[cia.subject]) {
        ciaBySubject[cia.subject] = [];
      }
      ciaBySubject[cia.subject].push(v);
    });
  });

  const ciaDistributionData = Object.entries(ciaBySubject)
    .map(([subject, scores]) => ({
      subject: subject.length > 15 ? `${subject.substring(0, 15)}…` : subject,
      marks: scores.reduce((a, b) => a + b, 0) / scores.length,
    }))
    .slice(0, 6);

  const mockTestData = [];
  semesters.forEach(sem => {
    sem.mockTests.forEach((test) => {
      const score = parseFloat(test.score ?? test.marks ?? 0);
      if (!Number.isFinite(score)) return;
      const rawName = test.testName || test.test_name || 'Test';
      mockTestData.push({
        name: rawName.length > 14 ? `${rawName.substring(0, 14)}…` : rawName,
        score,
      });
    });
  });

  const mockMax = mockTestData.length
    ? Math.max(...mockTestData.map(d => d.score), 100)
    : 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Semester SGPA (Semester Grade Point Average) Trend
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
                  fontSize: '12px',
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            CIE marks by subject
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
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="marks" name="Marks (out of 20)" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Mock test scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockTestData.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={11} angle={-15} textAnchor="end" height={60} />
              <YAxis domain={[0, mockMax]} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="score" name="Score" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

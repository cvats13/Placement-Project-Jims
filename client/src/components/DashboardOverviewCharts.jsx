import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

const PLACEMENT_COLORS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#6366f1'];

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function bucketFromCgpa(cgpa) {
  if (cgpa >= 9) return '9.0-10';
  if (cgpa >= 8) return '8.0-8.9';
  if (cgpa >= 7) return '7.0-7.9';
  if (cgpa >= 6) return '6.0-6.9';
  return '< 6.0';
}

export function DashboardOverviewCharts({ students = [] }) {
  const courseDistribution = useMemo(() => {
    const counts = students.reduce((acc, student) => {
      const course = student.course || 'Unknown';
      acc[course] = (acc[course] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([course, count]) => ({ course, count }));
  }, [students]);

  const placementDistribution = useMemo(() => {
    const counts = students.reduce((acc, student) => {
      const status = student.placement_status || 'In-Process';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  const cgpaBuckets = useMemo(() => {
    const seed = {
      '9.0-10': 0,
      '8.0-8.9': 0,
      '7.0-7.9': 0,
      '6.0-6.9': 0,
      '< 6.0': 0,
    };

    students.forEach((student) => {
      const cgpa = toNumber(student.current_cgpa);
      seed[bucketFromCgpa(cgpa)] += 1;
    });

    return Object.entries(seed).map(([range, count]) => ({ range, count }));
  }, [students]);

  if (students.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No chart data available for the selected filters.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Students by course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={courseDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="course" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-indigo-600" />
            Placement status split
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={placementDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
              >
                {placementDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={PLACEMENT_COLORS[index % PLACEMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            CGPA band distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={cgpaBuckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

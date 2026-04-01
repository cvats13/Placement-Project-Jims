import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

import { Calendar } from 'lucide-react';



export function MockTestTable({ mockTests }) {
  if (mockTests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        No mock tests recorded for this semester
      </div>
    );
  }

  const getTestTypeBadgeColor = (type) => {
    switch (type) {
      case 'Aptitude':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Coding':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Technical':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Test Name</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="text-center font-semibold">Score</TableHead>
            <TableHead className="text-center font-semibold">Percentile</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTests.map((test, index) => (
            <TableRow key={index} className="hover:bg-indigo-50/50 transition-colors">
              <TableCell className="font-medium">{test.testName}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getTestTypeBadgeColor(test.testType)}>
                  {test.testType}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <span className={test.score >= 80 ? 'text-green-600 font-semibold' : 'font-medium'}>
                  {test.score}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className={test.percentile >= 70 ? 'text-green-600 font-semibold' : 'font-medium'}>
                  {test.percentile}%
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Calendar className="w-3.5 h-3.5" />
                  {test.date}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText } from 'lucide-react';
import { HighlightedText } from './ui/HighlightedText';

export function StudentTable({ students, selectedStudents, onSelectStudent, onSelectAll, onViewProfile, searchTokens = [] }) {
  const allSelected = students.length > 0 && selectedStudents.length === students.length;
  const hasFilters = searchTokens.length > 0;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <div className="flex flex-col items-center gap-1">
                <Checkbox 
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                />
                {hasFilters && students.length > 0 && (
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    All
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead>Enrollment No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>10th %</TableHead>
            <TableHead>12th %</TableHead>
            <TableHead>Grad %</TableHead>
            <TableHead>CGPA (Cumulative Grade Point Average)</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow 
              key={student.student_id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onViewProfile(student)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={selectedStudents.includes(student.student_id)}
                  onCheckedChange={() => onSelectStudent(student.student_id)}
                />
              </TableCell>
              <TableCell className="font-medium">{student.enrollment_no}</TableCell>
              <TableCell>
                <HighlightedText text={student.name} searchTokens={searchTokens} />
              </TableCell>
              <TableCell>
                <Badge variant="outline">{student.course || 'N/A'}</Badge>
              </TableCell>
              <TableCell className="text-sm">{student.percentage_10th ? `${student.percentage_10th}%` : '---'}</TableCell>
              <TableCell className="text-sm">{student.percentage_12th ? `${student.percentage_12th}%` : '---'}</TableCell>
              <TableCell className="text-sm font-medium text-indigo-600">
                {student.aggregate_percentage ? `${student.aggregate_percentage}%` : '---'}
              </TableCell>
              <TableCell className="text-sm font-bold">
                {student.current_cgpa ? Number(student.current_cgpa).toFixed(2) : '---'}
              </TableCell>
              <TableCell>
                <span className="text-gray-600 font-medium">
                  {student.placed_company || '---'}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={student.placement_status === 'Placed' ? 'success' : 'secondary'}>
                  {student.placement_status || 'In-Process'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {students.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No students found matching the filters
        </div>
      )}
    </div>
  );
}

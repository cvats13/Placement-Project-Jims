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
            <TableHead>Aggregate %</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Action</TableHead>
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
                <Badge variant="outline">{student.branch || 'N/A'}</Badge>
              </TableCell>
              <TableCell>
                <span className={student.aggregate_percentage >= 75 ? 'text-green-600 font-medium' : ''}>
                  {student.aggregate_percentage ? `${student.aggregate_percentage}%` : 'N/A'}
                </span>
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
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {student.skills.slice(0, 2).map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {student.skills.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{student.skills.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewProfile(student)}
                >
                  View Profile
                </Button>
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

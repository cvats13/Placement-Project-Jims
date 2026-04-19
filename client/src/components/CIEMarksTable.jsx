import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function CIEMarksTable({ cieMarks = [] }) {
  if (!cieMarks || cieMarks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        No CIE marks recorded for this semester
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Subject</TableHead>
            <TableHead className="text-center font-semibold">Marks (out of 20)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cieMarks.map((mark, index) => {
            const m = Number(mark.marks ?? 0);
            return (
              <TableRow key={index} className="hover:bg-indigo-50/50 transition-colors">
                <TableCell className="font-medium">{mark.subject}</TableCell>
                <TableCell className="text-center">
                  <span className={m >= 18 ? 'text-green-600 font-semibold' : 'font-medium text-gray-900'}>
                    {Number.isFinite(m) ? m : '—'}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

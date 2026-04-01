import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function CIAMarksTable({ ciaMarks }) {
  if (ciaMarks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        No CIA marks recorded for this semester
      </div>
    );
  }

  const hasCIA4 = ciaMarks.some(mark => mark.cia4 !== undefined && mark.cia4 !== null);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Subject</TableHead>
            <TableHead className="text-center font-semibold">CIA 1</TableHead>
            <TableHead className="text-center font-semibold">CIA 2</TableHead>
            <TableHead className="text-center font-semibold">CIA 3</TableHead>
            {hasCIA4 && <TableHead className="text-center font-semibold">CIA 4</TableHead>}
            <TableHead className="text-center font-semibold">Average</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ciaMarks.map((mark, index) => (
            <TableRow key={index} className="hover:bg-indigo-50/50 transition-colors">
              <TableCell className="font-medium">{mark.subject}</TableCell>
              <TableCell className="text-center">
                <span className={mark.cia1 >= 18 ? 'text-green-600 font-medium' : ''}>
                  {mark.cia1}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className={mark.cia2 >= 18 ? 'text-green-600 font-medium' : ''}>
                  {mark.cia2}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className={mark.cia3 >= 18 ? 'text-green-600 font-medium' : ''}>
                  {mark.cia3}
                </span>
              </TableCell>
              {hasCIA4 && (
                <TableCell className="text-center">
                  {mark.cia4 ? (
                    <span className={mark.cia4 >= 18 ? 'text-green-600 font-medium' : ''}>
                      {mark.cia4}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
              )}
              <TableCell className="text-center">
                <span className={`font-semibold ${mark.average >= 18 ? 'text-green-600' : 'text-indigo-600'}`}>
                  {mark.average.toFixed(1)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

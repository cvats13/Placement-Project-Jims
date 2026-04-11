import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function MockTestTable({ mockTests }) {
  if (mockTests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        No mock tests recorded for this semester
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Test name</TableHead>
            <TableHead className="text-center font-semibold">Marks / score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTests.map((test, index) => {
            const s = Number(test.score ?? 0);
            return (
              <TableRow key={index} className="hover:bg-indigo-50/50 transition-colors">
                <TableCell className="font-medium">{test.testName}</TableCell>
                <TableCell className="text-center">
                  <span className={s >= 80 ? 'text-green-600 font-semibold' : 'font-medium text-gray-900'}>
                    {Number.isFinite(s) ? s : '—'}
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

import { AlertTriangle, TrendingDown, Users, ChevronRight, UserMinus } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import useCompanyStore from '../../store/useCompanyStore';

export function NonApplicants() {
  const { nonApplicants, isLoadingNonApplicants: isLoading } = useCompanyStore();

  const getParticipationBadge = (status) => {
    switch (status) {
      case 'Not Applied': return 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200';
      case 'Low Participation': return 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200';
      case 'Active': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-rose-100 rounded-3xl shadow-sm bg-white overflow-hidden">
        <CardHeader className="px-8 py-7 border-b border-rose-50 bg-rose-50/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-rose-600 p-2.5 rounded-2xl shadow-lg shadow-rose-200 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight text-gray-900">Participation Analytics</CardTitle>
                <CardDescription className="text-sm font-medium text-rose-600/80 mt-0.5">
                  Identifying students with low application frequency or zero participation.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-gray-50">
                <TableHead className="pl-8 py-4 font-semibold text-gray-600">Student Name</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600">Course</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600 text-center">Eligible Opportunities</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600 text-center">Actual Applications</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600 text-center">Participation Level</TableHead>
                <TableHead className="w-[140px] text-right pr-8 py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nonApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                       <div className="bg-emerald-50 p-4 rounded-full">
                         <Users className="w-8 h-8 text-emerald-400" />
                       </div>
                       <div className="space-y-1">
                         <p className="text-gray-900 font-semibold tracking-tight">Everyone is actively participating!</p>
                         <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                           No students listed under low participation. The entire cohort is engaged in the recruitment cycle.
                         </p>
                       </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                nonApplicants.map((row) => (
                  <TableRow key={row.student_id} className="group border-gray-50 hover:bg-rose-50/10 transition-colors">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100 font-bold text-rose-600 text-xs shadow-sm">
                           {row.student_name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900">{row.student_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 font-medium text-gray-600">{row.course}</TableCell>
                    <TableCell className="py-5 text-center">
                       <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-gray-50 border border-gray-100 font-bold text-gray-500 text-xs">
                         {row.eligible_companies}
                       </div>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                       <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-rose-50 border border-rose-100 font-black text-rose-700 text-xs shadow-sm shadow-rose-100/50">
                         {row.applied_companies}
                       </div>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <Badge variant="outline" className={`rounded-full px-4 py-1 border-2 text-[11px] font-extrabold shadow-sm ${getParticipationBadge(row.participation_status)}`}>
                        {row.participation_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 py-5">
                      <Button variant="ghost" size="sm" className="h-9 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl gap-2 font-bold transition-all">
                        Counsel Student
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

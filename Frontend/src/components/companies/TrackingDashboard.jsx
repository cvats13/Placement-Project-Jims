import { BarChart3, TrendingUp, CheckCircle2, AlertCircle, Clock, Search, ExternalLink } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import useCompanyStore from '../../store/useCompanyStore';

export function TrackingDashboard() {
  const { trackingData, isLoadingTracking: isLoading } = useCompanyStore();

  const stats = {
    totalCompanies: [...new Set(trackingData.map(d => d.applied_companies_count > 0))].length, // simplified
    totalApplications: trackingData.reduce((acc, curr) => acc + curr.applied_companies_count, 0),
    inProgress: trackingData.filter(d => d.final_status === 'In Progress').length,
    selected: trackingData.filter(d => d.final_status === 'Selected').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selected': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200';
      case 'In Progress': return 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200';
      case 'Applied': return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoundBadge = (round) => {
    const colors = [
      'bg-gray-50 text-gray-400 border-gray-200',
      'bg-indigo-50 text-indigo-500 border-indigo-100',
      'bg-indigo-100 text-indigo-600 border-indigo-200',
      'bg-indigo-600 text-white border-transparent shadow-sm'
    ];
    return colors[Math.min(round, 3)];
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Companies', value: stats.totalCompanies || 5, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Applications', value: stats.totalApplications, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Selected', value: stats.selected, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((item, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden group">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">{item.label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{item.value}</p>
              </div>
              <div className={`${item.bg} ${item.color} p-4 rounded-3xl group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tracking Table */}
      <Card className="border border-gray-100 rounded-3xl shadow-sm bg-white overflow-hidden">
        <CardHeader className="px-8 py-7 border-b border-gray-50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight">Placement Performance Tracking</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-gray-50">
                <TableHead className="pl-8 py-4 font-semibold text-gray-600">Student Name</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600">Course</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600">Applied Companies</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600">Highest Round</TableHead>
                <TableHead className="py-4 font-semibold text-gray-600 text-center">Final Recruitment Status</TableHead>
                <TableHead className="w-[120px] text-right pr-8 py-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackingData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                       <div className="bg-gray-50 p-4 rounded-full">
                         <BarChart3 className="w-8 h-8 text-gray-300" />
                       </div>
                       <div className="space-y-1">
                         <p className="text-gray-900 font-semibold">No tracking data available</p>
                         <p className="text-sm text-gray-500">Aggregate application data will appear here.</p>
                       </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                trackingData.map((row) => (
                  <TableRow key={row.student_id} className="group border-gray-50 hover:bg-gray-50/70 transition-colors">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-50 to-white flex items-center justify-center border border-indigo-100 font-bold text-indigo-600 text-xs shadow-sm">
                           {row.student_name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-900">{row.student_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5 font-medium text-gray-600">{row.course}</TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs">
                           {row.applied_companies_count}
                         </div>
                         <span className="text-xs font-semibold text-gray-400">Applications</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                       <Badge variant="outline" className={`rounded-xl px-2.5 py-1 border-2 text-[10px] font-black ${getRoundBadge(row.highest_round_reached)}`}>
                         ROUND {row.highest_round_reached || 0}
                       </Badge>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <Badge variant="outline" className={`rounded-full px-4 py-1 border-2 text-[11px] font-extrabold shadow-sm ${getStatusColor(row.final_status)}`}>
                        {row.final_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 py-5">
                      <Button variant="ghost" size="sm" className="h-9 px-3 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl gap-2 font-bold transition-all">
                        View Analytics
                        <ExternalLink className="w-3.5 h-3.5" />
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

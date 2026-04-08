import { useState, useMemo } from 'react';
import { Mail, Search, Filter, MoreHorizontal, Download, ChevronDown } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Card, CardContent } from '../ui/card';
import useCompanyStore from '../../store/useCompanyStore';
import { MassMailModal } from './MassMailModal';

export function CompanyList() {
  const { companies, isLoadingCompanies: isLoading, error } = useCompanyStore();
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [filters, setFilters] = useState({ course: 'all', status: 'all' });
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchCourse = filters.course === 'all' || company.course === filters.course;
      const matchStatus = filters.status === 'all' || company.status === filters.status;
      return matchCourse && matchStatus;
    });
  }, [companies, filters]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCompanies(filteredCompanies.map(c => c.id));
    } else {
      setSelectedCompanies([]);
    }
  };

  const handleSelectCompany = (id, checked) => {
    if (checked) {
      setSelectedCompanies(prev => [...prev, id]);
    } else {
      setSelectedCompanies(prev => prev.filter(compId => compId !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200';
      case 'Closed': return 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200';
      case 'Upcoming': return 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading && companies.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium tracking-tight">Fetching company ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Area */}
      <Card className="border-none shadow-sm bg-indigo-50/30 overflow-hidden">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-48">
              <Select 
                value={filters.course} 
                onValueChange={(val) => setFilters(prev => ({ ...prev, course: val }))}
              >
                <SelectTrigger className="bg-white border-none shadow-sm h-11 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-indigo-400" />
                    <SelectValue placeholder="All Courses" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="MCA">MCA</SelectItem>
                  <SelectItem value="BCA">BCA</SelectItem>
                  <SelectItem value="BBA">BBA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 md:w-48">
              <Select 
                value={filters.status} 
                onValueChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
              >
                <SelectTrigger className="bg-white border-none shadow-sm h-11 rounded-xl">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button 
               variant="outline" 
               className="bg-white border-none shadow-sm h-11 px-5 rounded-xl text-gray-600 gap-2 hover:bg-gray-50 flex-1 md:flex-none"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
               onClick={() => setIsMailModalOpen(true)}
               disabled={selectedCompanies.length === 0}
               className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl shadow-md gap-2 flex-1 md:flex-none"
            >
              <Mail className="w-4 h-4" />
              Send Mail
              {selectedCompanies.length > 0 && (
                <span className="bg-indigo-400/30 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                  {selectedCompanies.length}
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Area */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="w-[50px] pl-6 py-4">
                <Checkbox 
                  checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="rounded-md border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 focus-visible:ring-indigo-600 shadow-none border-2"
                />
              </TableHead>
              <TableHead className="py-4 font-semibold text-gray-600">Company Name</TableHead>
              <TableHead className="py-4 font-semibold text-gray-600">Target Course</TableHead>
              <TableHead className="py-4 font-semibold text-gray-600">Job Role</TableHead>
              <TableHead className="py-4 font-semibold text-gray-600">Package (LPA)</TableHead>
              <TableHead className="py-4 font-semibold text-gray-600">Recruitment Status</TableHead>
              <TableHead className="py-4 font-semibold text-gray-600">Official Email</TableHead>
              <TableHead className="w-[80px] text-right pr-6 py-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="bg-gray-50 p-4 rounded-full">
                       <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-900 font-semibold tracking-tight">No companies found</p>
                      <p className="text-sm text-gray-500 max-w-[240px] mx-auto leading-relaxed">
                        Try adjusting your filters or search criteria to explore more opportunities.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((company) => (
                <TableRow key={company.id} className="group border-gray-100 hover:bg-indigo-50/20 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <Checkbox 
                      checked={selectedCompanies.includes(company.id)}
                      onCheckedChange={(checked) => handleSelectCompany(company.id, checked)}
                      className="rounded-md border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 focus-visible:ring-indigo-600 shadow-none border-2"
                    />
                  </TableCell>
                  <TableCell className="font-bold text-gray-900 py-4">{company.name}</TableCell>
                  <TableCell className="py-4 font-medium text-gray-600">{company.course}</TableCell>
                  <TableCell className="py-4 font-medium text-gray-600">{company.role}</TableCell>
                  <TableCell className="py-4 font-bold text-indigo-600">{company.package} LPA</TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className={`rounded-full px-3 py-0.5 border-2 text-[11px] font-bold ${getStatusColor(company.status)}`}>
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-gray-500 font-medium truncate max-w-[150px]">{company.email}</TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-100/50 rounded-lg transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MassMailModal 
        isOpen={isMailModalOpen} 
        onClose={() => setIsMailModalOpen(false)}
        selectedCount={selectedCompanies.length}
        recipientEmails={companies.filter(c => selectedCompanies.includes(c.id)).map(c => c.email)}
      />
    </div>
  );
}

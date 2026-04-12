import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CompanyList } from '../components/companies/CompanyList';
// import { TrackingDashboard } from '../components/companies/TrackingDashboard';
// import { NonApplicants } from '../components/companies/NonApplicants';
import useCompanyStore from '../store/useCompanyStore';

export function Companies() {
  const [activeTab, setActiveTab] = useState('list');
  const { fetchCompanies } = useCompanyStore();

  useEffect(() => {
    fetchCompanies();
    // fetchTrackingData();
    // fetchNonApplicants();
  }, [fetchCompanies]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Companies</h2>
        {/* <p className="text-sm text-gray-500">Track corporate relations, student applications, and participation.</p> */}
      </div>

      <Tabs defaultValue="list" className="w-full space-y-6" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
            <TabsTrigger value="list" className="flex items-center gap-2 rounded-lg py-2.5">
              <Building2 className="w-4 h-4" />
              Company List
            </TabsTrigger>
            {/* <TabsTrigger value="tracking" className="flex items-center gap-2 rounded-lg py-2.5">
              <BarChart3 className="w-4 h-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="non-applicants" className="flex items-center gap-2 rounded-lg py-2.5">
              <Users className="w-4 h-4" />
              Non-Applicants
            </TabsTrigger> */}
          </TabsList>

          {activeTab === 'list' && (
            <div className="flex items-center gap-3">
              {/* Optional: Add search bar here if needed beyond local table search */}
            </div>
          )}
        </div>

        <TabsContent value="list" className="space-y-6 outline-none">
          <CompanyList />
        </TabsContent>

        {/* <TabsContent value="tracking" className="space-y-6 outline-none">
          <TrackingDashboard />
        </TabsContent>

        <TabsContent value="non-applicants" className="space-y-6 outline-none">
          <NonApplicants />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}

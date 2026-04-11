import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Upload, CheckCircle, XCircle, AlertCircle, RefreshCw, ArrowRight, Building2, Plus, History } from 'lucide-react';
import { toast } from 'sonner';
import companyCsvService from '../services/companyCsvService';

const COURSES = ['MCA', 'BCA', 'BBA', 'MBA'];
const STATUSES = ['Upcoming', 'Ongoing', 'Completed'];

export function CompanyImportPanel() {
  const [tab, setTab] = useState('upload'); // upload | manual | history
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [importHistory, setImportHistory] = useState([]);
  const [step, setStep] = useState('upload'); // upload | results

  // Manual form state
  const [form, setForm] = useState({ name: '', course: '', job_role: '', package_lpa: '', status: 'Upcoming', official_email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
      toast.error('Please upload a .csv or .xlsx file');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const result = await companyCsvService.uploadFile(file);
      setUploadResult(result);
      setStep('results');
      toast.success('File parsed. Review the data before importing.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!uploadResult?.batchId) return;
    setIsProcessing(true);
    try {
      const result = await companyCsvService.confirmImport(uploadResult.batchId, uploadResult.preview);
      toast.success(`✅ Imported ${result.successCount} companies. ${result.failCount} failed.`);
      setStep('upload');
      setFile(null);
      setUploadResult(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.course) { toast.error('Company name and course are required'); return; }
    setIsSubmitting(true);
    try {
      await companyCsvService.createCompany(form);
      toast.success(`Company "${form.name}" added successfully`);
      setForm({ name: '', course: '', job_role: '', package_lpa: '', status: 'Upcoming', official_email: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchHistory = async () => {
    setIsProcessing(true);
    try {
      const data = await companyCsvService.getImportHistory();
      setImportHistory(data);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setIsProcessing(false);
    }
  };

  const validRows = uploadResult?.preview?.filter(r => r.status === 'valid') || [];
  const invalidRows = uploadResult?.preview?.filter(r => r.status === 'invalid') || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Import</h2>
          <p className="text-sm text-gray-500">Upload CSV or add companies manually</p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {[
          { id: 'upload', label: 'Upload CSV', icon: Upload },
          { id: 'manual', label: 'Add Manually', icon: Plus },
          { id: 'history', label: 'History', icon: History },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); if (id === 'history') fetchHistory(); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {tab === 'upload' && step === 'upload' && (
        <Card className="border-2 border-indigo-100 shadow-xl">
          <CardHeader className="bg-indigo-50 border-b border-indigo-100">
            <CardTitle className="text-xl text-indigo-900">Upload Companies CSV</CardTitle>
            <p className="text-sm text-indigo-600 font-mono mt-1">
              Required columns: Company Name, Target Course, Job Role, Package (LPA), Recruitment Status, Official Email
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="border-2 border-dashed border-indigo-200 rounded-2xl bg-white p-12 text-center hover:border-indigo-400 transition-all cursor-pointer group">
              <input type="file" id="company-file" className="hidden" onChange={handleFileChange} accept=".csv,.xlsx" />
              <label htmlFor="company-file" className="cursor-pointer">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                {file ? (
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-700">Click to choose a file</p>
                    <p className="text-sm text-gray-400">Supports .csv and .xlsx (Max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleUpload} disabled={!file || isProcessing} size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-10 rounded-xl">
                {isProcessing ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <>Analyze & Validate <ArrowRight className="ml-2 w-4 h-4" /></>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Step */}
      {tab === 'upload' && step === 'results' && uploadResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-gray-400"><CardContent className="pt-5"><p className="text-sm text-gray-500">Total Rows</p><p className="text-3xl font-bold">{uploadResult.totalRows}</p></CardContent></Card>
            <Card className="border-l-4 border-l-green-500"><CardContent className="pt-5"><p className="text-sm text-green-600">Valid</p><p className="text-3xl font-bold text-green-700">{validRows.length}</p></CardContent></Card>
            <Card className="border-l-4 border-l-red-500"><CardContent className="pt-5"><p className="text-sm text-red-600">Invalid</p><p className="text-3xl font-bold text-red-700">{invalidRows.length}</p></CardContent></Card>
          </div>

          {/* Errors */}
          {invalidRows.length > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-lg text-red-800">Validation Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Row</TableHead><TableHead>Company Name</TableHead><TableHead>Issue</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {invalidRows.map((r, i) => (
                      <TableRow key={i}><TableCell className="font-bold text-red-700">{r.row_number}</TableCell><TableCell>{r.data['Company Name'] || '—'}</TableCell><TableCell className="text-red-600">{r.error}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          <Card>
            <CardHeader className="border-b pb-3"><CardTitle className="text-lg">Preview ({validRows.length} valid rows)</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader className="bg-gray-50 sticky top-0">
                    <TableRow>
                      <TableHead>Company Name</TableHead><TableHead>Course</TableHead><TableHead>Job Role</TableHead>
                      <TableHead>Package</TableHead><TableHead>Status</TableHead><TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validRows.slice(0, 15).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-semibold">{r.data['Company Name']}</TableCell>
                        <TableCell>{r.data['Target Course']}</TableCell>
                        <TableCell>{r.data['Job Role'] || '—'}</TableCell>
                        <TableCell>{r.data['Package (LPA)'] ? `${r.data['Package (LPA)']} LPA` : '—'}</TableCell>
                        <TableCell><Badge variant="outline">{r.data['Recruitment Status'] || 'Upcoming'}</Badge></TableCell>
                        <TableCell className="text-gray-500 text-xs">{r.data['Official Email'] || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pb-6">
            <Button variant="ghost" onClick={() => { setStep('upload'); setFile(null); setUploadResult(null); }}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={validRows.length === 0 || isProcessing} className="bg-green-600 hover:bg-green-700 h-12 px-10 rounded-xl">
              {isProcessing ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Importing...</> : <><CheckCircle className="w-4 h-4 mr-2" />Import {validRows.length} Companies</>}
            </Button>
          </div>
        </div>
      )}

      {/* Manual Add Tab */}
      {tab === 'manual' && (
        <Card className="border-2 border-gray-100 shadow-lg">
          <CardHeader className="border-b"><CardTitle className="text-lg flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-600" />Add Company Manually</CardTitle></CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Company Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. TCS" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Target Course *</label>
                <select value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
                  <option value="">Select course</option>
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Job Role</label>
                <input value={form.job_role} onChange={e => setForm(p => ({ ...p, job_role: e.target.value }))} placeholder="e.g. Software Engineer" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Package (LPA)</label>
                <input type="number" step="0.01" value={form.package_lpa} onChange={e => setForm(p => ({ ...p, package_lpa: e.target.value }))} placeholder="e.g. 6.5" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Recruitment Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Official Email</label>
                <input type="email" value={form.official_email} onChange={e => setForm(p => ({ ...p, official_email: e.target.value }))} placeholder="hr@company.com" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 h-10 px-8 rounded-lg">
                  {isSubmitting ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><Plus className="w-4 h-4 mr-2" />Add Company</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">Company Import History</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50"><TableRow><TableHead>File Name</TableHead><TableHead className="text-center">Total</TableHead><TableHead className="text-center">Success</TableHead><TableHead className="text-center">Failed</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {importHistory.length > 0 ? importHistory.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.file_name}</TableCell>
                    <TableCell className="text-center">{log.total_rows}</TableCell>
                    <TableCell className="text-center text-green-600 font-bold">{log.success_rows}</TableCell>
                    <TableCell className="text-center text-red-600 font-bold">{log.failed_rows}</TableCell>
                    <TableCell><Badge className={log.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>{log.status.toUpperCase()}</Badge></TableCell>
                    <TableCell className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-gray-400">No import history yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

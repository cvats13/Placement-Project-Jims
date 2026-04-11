import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Upload, CheckCircle, XCircle, AlertCircle, RefreshCw, ArrowRight, FileText, History } from 'lucide-react';
import { toast } from 'sonner';
import ciaCsvService from '../services/ciaCsvService';

export function CiaMarksImportPanel() {
  const [tab, setTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [importHistory, setImportHistory] = useState([]);
  const [step, setStep] = useState('upload');

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith('.csv') && !f.name.endsWith('.xlsx')) { toast.error('Please upload a .csv or .xlsx file'); return; }
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const result = await ciaCsvService.uploadFile(file);
      setUploadResult(result);
      setStep('results');
      toast.success('File parsed. Review before importing.');
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
      const result = await ciaCsvService.confirmImport(uploadResult.batchId, uploadResult.preview);
      toast.success(`✅ Imported ${result.successCount} CIA mark entries. ${result.failCount} failed.`);
      setStep('upload'); setFile(null); setUploadResult(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchHistory = async () => {
    setIsProcessing(true);
    try { const data = await ciaCsvService.getImportHistory(); setImportHistory(data); }
    catch { toast.error('Failed to load history'); }
    finally { setIsProcessing(false); }
  };

  const validRows = uploadResult?.preview?.filter(r => r.status === 'valid') || [];
  const invalidRows = uploadResult?.preview?.filter(r => r.status === 'invalid') || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CIA Marks Import</h2>
          <p className="text-sm text-gray-500">Upload CIA marks linked to student semesters</p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2 border-b border-gray-200">
        {[{ id: 'upload', label: 'Upload CSV', icon: Upload }, { id: 'history', label: 'History', icon: History }].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setTab(id); if (id === 'history') fetchHistory(); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Upload */}
      {tab === 'upload' && step === 'upload' && (
        <Card className="border-2 border-blue-100 shadow-xl">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-xl text-blue-900">Upload CIA Marks CSV</CardTitle>
            <p className="text-sm text-blue-600 font-mono mt-1">
              Required columns: Enrollment No., Semester Number, Subject, Marks
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="border-2 border-dashed border-blue-200 rounded-2xl bg-white p-12 text-center hover:border-blue-400 transition-all group cursor-pointer">
              <input type="file" id="cia-file" className="hidden" onChange={handleFileChange} accept=".csv,.xlsx" />
              <label htmlFor="cia-file" className="cursor-pointer">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                {file ? (
                  <div><p className="font-bold text-gray-900">{file.name}</p><p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p></div>
                ) : (
                  <div><p className="font-semibold text-gray-700">Click to choose a file</p><p className="text-sm text-gray-400">Supports .csv and .xlsx (Max 5MB)</p></div>
                )}
              </label>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleUpload} disabled={!file || isProcessing} size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-10 rounded-xl">
                {isProcessing ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : <>Analyze & Validate <ArrowRight className="ml-2 w-4 h-4" /></>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {tab === 'upload' && step === 'results' && uploadResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-gray-400"><CardContent className="pt-5"><p className="text-sm text-gray-500">Total Rows</p><p className="text-3xl font-bold">{uploadResult.totalRows}</p></CardContent></Card>
            <Card className="border-l-4 border-l-green-500"><CardContent className="pt-5"><p className="text-sm text-green-600">Valid</p><p className="text-3xl font-bold text-green-700">{validRows.length}</p></CardContent></Card>
            <Card className="border-l-4 border-l-red-500"><CardContent className="pt-5"><p className="text-sm text-red-600">Invalid</p><p className="text-3xl font-bold text-red-700">{invalidRows.length}</p></CardContent></Card>
          </div>

          {invalidRows.length > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <AlertCircle className="w-5 h-5 text-red-600" /><CardTitle className="text-lg text-red-800">Errors ({invalidRows.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Row</TableHead><TableHead>Enrollment No.</TableHead><TableHead>Semester</TableHead><TableHead>Subject</TableHead><TableHead>Issue</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {invalidRows.slice(0, 10).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-bold text-red-700">{r.row_number}</TableCell>
                        <TableCell>{r.data['Enrollment No.'] || '—'}</TableCell>
                        <TableCell>{r.data['Semester Number'] || '—'}</TableCell>
                        <TableCell>{r.data['Subject'] || '—'}</TableCell>
                        <TableCell className="text-red-600 text-xs">{r.error}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="border-b pb-3"><CardTitle className="text-lg">Preview — Valid Rows ({validRows.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader className="bg-gray-50 sticky top-0">
                    <TableRow><TableHead>Enrollment No.</TableHead><TableHead>Semester</TableHead><TableHead>Subject</TableHead><TableHead>Marks</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {validRows.length > 0 ? validRows.slice(0, 15).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-sm font-semibold">{r.data['Enrollment No.']}</TableCell>
                        <TableCell>Sem {r.data['Semester Number']}</TableCell>
                        <TableCell>{r.data['Subject']}</TableCell>
                        <TableCell className="font-bold text-indigo-600">{r.data['Marks']}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-400">No valid rows found.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pb-6">
            <Button variant="ghost" onClick={() => { setStep('upload'); setFile(null); setUploadResult(null); }}>Cancel</Button>
            <Button onClick={handleConfirm} disabled={validRows.length === 0 || isProcessing} className="bg-green-600 hover:bg-green-700 h-12 px-10 rounded-xl">
              {isProcessing ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Importing...</> : <><CheckCircle className="w-4 h-4 mr-2" />Import {validRows.length} Records</>}
            </Button>
          </div>
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">CIA Marks Import History</CardTitle></CardHeader>
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

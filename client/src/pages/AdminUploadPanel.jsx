import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { toast } from 'sonner';

import useStudentStore from '../store/useStudentStore';

export function AdminUploadPanel() {
  const [previewData, setPreviewData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [missingHeaders, setMissingHeaders] = useState([]);
  const { uploadStudents, isLoading } = useStudentStore();

  const REQUIRED_HEADERS = [
    'Student Name', 'College Shift', 'Enrollment No.', 'Course', 'Primary Email ID', 
    'Mobile Number', 'Student JIMS Email Id', 'Gender', 'Date of Birth (DD/MM/YYYY Format Only)'
  ];

  const OPTIONAL_HEADERS = [
    'LinkedIn Profile Link', 'GitHub Profile Link', 'Technical Skills', 
    '10th Board Name', '10th passing Year', '10th %', '12th Board Name', '12th Passing Year', '12th %', '12th Stream', 
    'Graduation College/ Institute Name', 'Graduation Stream', 'Graduation Passing Year', 'Graduation %',
    'Sem 1 SGPA', 'Sem 2 SGPA', 'Sem 3 SGPA', 'Sem 4 SGPA', 'Sem 5 SGPA', 'Sem 6 SGPA',
    'Any Gap', 'Reason of Gap ( if no gap , write NA)', 'Open to Pan India Location',
    'Fathers Name', 'Father Occupation', 'Fathers Email ID', 'Father Mobile No.', 
    'Mothers Name', 'Mothers Mobile Number', 'Mothers Email ID',
    'Student Residence / Belong to', 'Permanent Address', 'Current Address',
    'Any previous work Experience', 'Internship /Project Details ( otherwise write NA)', 'What you have done',
    'Any Previous campus selection/ offer in Graduation.', 'Current Placement Status', 'Placed Company Name'
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
          toast.error("CSV file is empty or missing data rows");
          return;
        }

        // Better CSV parsing regex to handle quoted values (e.g., "Java, React, SQL")
        const parseCSVLine = (line) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const headers = parseCSVLine(lines[0]);
        
        // Validate required headers
        const missing = REQUIRED_HEADERS.filter(h => !headers.includes(h));
        if (missing.length > 0) {
          setMissingHeaders(missing);
          toast.error("Missing required headers!");
          return;
        }

        setMissingHeaders([]);

        // Parse rows
        const data = lines.slice(1).map(line => {
          const values = parseCSVLine(line);
          const obj = {};
          headers.forEach((header, index) => {
            // Remove surround quotes if present
            let val = values[index] || '';
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.substring(1, val.length - 1);
            }
            obj[header] = val;
          });
          return obj;
        });

        setPreviewData(data);
        toast.success(`CSV loaded with ${data.length} student records!`);
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmUpload = async () => {
    try {
      await uploadStudents(previewData);
      setIsUploaded(true);
      toast.success(`${previewData.length} students uploaded successfully!`);
      setTimeout(() => {
        setPreviewData([]);
        setIsUploaded(false);
      }, 3000);
    } catch (error) {
      toast.error(error.message || 'Failed to upload data');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mega-CSV Student Importer</CardTitle>
          <p className="text-sm text-gray-500">
            Sync student data across all tables using your master Excel sheet.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Validation Warnings */}
          {missingHeaders.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-bold text-red-800 flex items-center gap-2 mb-2">
                <X className="w-4 h-4" /> Missing Required Headers:
              </h4>
              <ul className="text-xs text-red-700 list-disc list-inside grid grid-cols-2 gap-1">
                {missingHeaders.map(h => <li key={h}>{h}</li>)}
              </ul>
              <p className="text-xs text-red-600 mt-2 font-medium">Please correct the column names in your CSV file and try again.</p>
            </div>
          )}

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-500 transition-colors bg-gray-50/50">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <label className="cursor-pointer">
              <span className="text-indigo-600 hover:text-indigo-700 font-bold text-lg">
                Choose CSV File
              </span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">Upload your master placement spreadsheet (.csv)</p>
          </div>

          {/* Expected Data Structure */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Required Column Logic
            </h4>
            <div className="text-xs text-indigo-800 space-y-2">
              <p><strong>Mandatory:</strong> Student Name, Enrollment No., College Shift, Course, Email, Mobile, DOB (DD/MM/YYYY)</p>
              <p><strong>Optional:</strong> Father/Mother details, Address, Gaps, Experience, Semester SGPAs (Sem 1 SGPA, etc.)</p>
            </div>
          </div>

          {/* Preview Table */}
          {previewData.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900">Previewing {previewData.length} Students</h4>
                {isUploaded && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">Sync Complete!</span>
                  </div>
                )}
              </div>

              <div className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold">Enrollment No.</TableHead>
                      <TableHead className="font-bold">Student Name</TableHead>
                      <TableHead className="font-bold">Course</TableHead>
                      <TableHead className="font-bold">10th %</TableHead>
                      <TableHead className="font-bold">12th %</TableHead>
                      <TableHead className="font-bold">Grad %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 5).map((student, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{student['Enrollment No.']}</TableCell>
                        <TableCell>{student['Student Name']}</TableCell>
                        <TableCell>{student['Course']}</TableCell>
                        <TableCell>{student['10th %'] || 'N/A'}</TableCell>
                        <TableCell>{student['12th %'] || 'N/A'}</TableCell>
                        <TableCell>{student['Graduation %'] || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                    {previewData.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-400 text-xs py-4 bg-gray-50/50">
                          ... and {previewData.length - 5} more records
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewData([])}
                  disabled={isLoading}
                >
                  Clear
                </Button>
                <Button 
                  onClick={handleConfirmUpload}
                  className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8"
                  disabled={isUploaded || isLoading}
                >
                  {isLoading ? 'Processing...' : 'Sync to Database'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="border-l-4 border-l-amber-400">
        <CardHeader>
          <CardTitle className="text-lg">CSV Preparation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
              <span><strong>Header Names:</strong> Use the exact names like `Fathers Name` or `12th %`. The system is sensitive to typos in the header row.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
              <span><strong>Date Format:</strong> Ensure Date of Birth is in <code>DD/MM/YYYY</code> format.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
              <span><strong>Empty Values:</strong> If data is missing for optional fields (like Gap Reason), leave the cell empty or write <code>NA</code>.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
              <span><strong>Enrollment No.:</strong> This is the unique key. Uploading a student with an existing Enrollment No. will <strong>update</strong> their profile with the new data.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


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
  const { uploadStudents, isLoading } = useStudentStore();

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock CSV parsing logic for demonstration
      const mockData = Array.from({ length: 5 }, (_, i) => ({
        student_id: Date.now() + i,
        roll_no: `2024BCA${(i + 1).toString().padStart(3, '0')}`,
        name: `Student ${i + 1}`,
        branch: ['BCA', 'MCA', 'BBA'][i % 3],
        semester: Math.floor(Math.random() * 6) + 1,
        cgpa: (Math.random() * 2 + 7).toFixed(2),
        backlogs: Math.floor(Math.random() * 3),
        phone: `+91 98765${String(i).padStart(5, '0')}`,
        email: `student${i + 1}@college.edu`,
        skills: ['JavaScript', 'React', 'Python', 'Java'].slice(0, Math.floor(Math.random() * 3) + 2),
        resume_url: `https://example.com/resume${i + 1}.pdf`,
      }));
      
      setPreviewData(mockData);
      toast.success('CSV file loaded successfully!');
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
      }, 2000);
    } catch (error) {
      toast.error('Failed to upload data');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Student Data</CardTitle>
          <p className="text-sm text-gray-500">
            Upload a CSV file containing student information
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-500 transition-colors">
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <label className="cursor-pointer">
              <span className="text-indigo-600 hover:text-indigo-700 font-medium">
                Click to upload
              </span>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">CSV file (MAX. 10MB)</p>
          </div>

          {/* Expected Data Structure */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Expected CSV Format
            </h4>
            <div className="text-sm text-gray-600 space-y-1 font-mono">
              <p>student_id, roll_no, name, branch, semester, cgpa, backlogs,</p>
              <p>phone, email, skills, resume_url</p>
            </div>
          </div>

          {/* Preview Table */}
          {previewData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Preview Data ({previewData.length} records)</h4>
                {isUploaded && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Upload Successful!</span>
                  </div>
                )}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>CGPA</TableHead>
                      <TableHead>Backlogs</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((student) => (
                      <TableRow key={student.student_id}>
                        <TableCell>{student.roll_no}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.branch}</TableCell>
                        <TableCell>{student.semester}</TableCell>
                        <TableCell>{student.cgpa}</TableCell>
                        <TableCell>{student.backlogs}</TableCell>
                        <TableCell>{student.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewData([])}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmUpload}
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={isUploaded}
                >
                  {isUploaded ? 'Uploaded' : 'Confirm Upload'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-medium">1.</span>
              <span>Ensure your CSV file has all required columns in the correct order</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-medium">2.</span>
              <span>Skills should be comma-separated within quotes (e.g., "Java,Python,React")</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-medium">3.</span>
              <span>Resume URL should be a valid link to the student's resume</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-medium">4.</span>
              <span>Review the preview table before confirming the upload</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

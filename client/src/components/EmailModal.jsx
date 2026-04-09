import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import axiosInstance from '../api/axiosInstance';

export function EmailModal({ isOpen, onClose, selectedStudents = [] }) {
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    subject: '',
    message: '',
  });

  const selectedCount = selectedStudents.length;

  // Generate preview when modal opens
  useEffect(() => {
    if (isOpen && selectedStudents.length > 0) {
      const studentDetails = selectedStudents.map((s, index) => (
        `${index + 1}. ${s.name}\n   Enrollment: ${s.enrollment_no}\n   Email: ${s.student_email || s.primary_email}\n   Course: ${s.course}\n   CGPA: ${s.current_cgpa || 'N/A'}\n`
      )).join('\n');

      setFormData(prev => ({
        ...prev,
        subject: `Student Profiles for Placement - ${selectedCount} Students`,
        message: `Dear Hiring Manager,\n\nWe are pleased to share the profiles of our talented students for your consideration:\n\n${studentDetails}\n\nPlease find the detailed resumes attached (if applicable) or contact us for more information.\n\nBest regards,\nPlacement Officer\nJIMS`
      }));
    }
  }, [isOpen, selectedStudents, selectedCount]);

  const handleSend = async () => {
    if (!formData.companyEmail || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSending(true);
    try {
      await axiosInstance.post('/students/send-to-company', {
        companyEmail: formData.companyEmail,
        subject: formData.subject,
        message: formData.message
      });

      toast.success(`Email sent successfully to ${formData.companyEmail}!`, {
        description: `${selectedCount} student profiles have been shared.`,
      });
      
      setFormData({
        companyName: '',
        companyEmail: '',
        subject: '',
        message: '',
      });
      onClose();
    } catch (err) {
      console.error('Failed to send email:', err);
      toast.error(err.response?.data?.error || 'Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Students to Company</DialogTitle>
          <p className="text-sm text-gray-500">
            Sending {selectedCount} student {selectedCount === 1 ? 'profile' : 'profiles'} to company
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email <span className="text-red-500">*</span></Label>
              <Input
                id="companyEmail"
                type="email"
                placeholder="hr@company.com"
                value={formData.companyEmail}
                onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject <span className="text-red-500">*</span></Label>
            <Input
              id="subject"
              placeholder="Student profiles for your consideration"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="message">Email Content (Preview & Edit) <span className="text-red-500">*</span></Label>
              <span className="text-xs text-indigo-600 font-medium italic">You can edit the details below</span>
            </div>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              rows={12}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="font-mono text-sm"
              required
            />
          </div>
        </div>

        <DialogFooter className="sticky bottom-0 bg-white pt-2 border-t mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
            disabled={isSending}
          >
            {isSending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              'Send Email'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

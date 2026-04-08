import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

export function EmailModal({ isOpen, onClose, selectedCount }) {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    subject: '',
    message: '',
  });

  const handleSend = () => {
    if (!formData.companyName || !formData.companyEmail || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success(`Email sent successfully to ${formData.companyName}!`, {
      description: `${selectedCount} student profiles have been shared.`,
    });
    
    setFormData({
      companyName: '',
      companyEmail: '',
      subject: '',
      message: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Students to Company</DialogTitle>
          <p className="text-sm text-gray-500">
            Sending {selectedCount} student {selectedCount === 1 ? 'profile' : 'profiles'} to company
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Enter company name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyEmail">Company Email</Label>
            <Input
              id="companyEmail"
              type="email"
              placeholder="hr@company.com"
              value={formData.companyEmail}
              onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              placeholder="Student profiles for your consideration"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Email Message</Label>
            <Textarea
              id="message"
              placeholder="Dear Hiring Manager,&#10;&#10;We are pleased to share the profiles of our talented students..."
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-700">
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

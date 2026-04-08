import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Mail, Send, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import useCompanyStore from '../../store/useCompanyStore';
import { toast } from 'sonner';

export function MassMailModal({ isOpen, onClose, selectedCount, recipientEmails }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { sendMassMail } = useCompanyStore();

  const handleSend = async () => {
    if (!subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSending(true);
    try {
      await sendMassMail({
        recipient_emails: recipientEmails,
        subject,
        message
      });
      toast.success(`Email successfully dispatched to ${selectedCount} companies`);
      onClose();
      setSubject('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send mass email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 border-none bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-indigo-600 px-8 py-10 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
               <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Mass Communication</DialogTitle>
              <DialogDescription className="text-indigo-100 mt-1">
                Broadcasting professional outreach to {selectedCount} selected recruitment partners.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-indigo-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
             </div>
             <div className="text-sm">
                <span className="text-gray-500">Recipients:</span> 
                <span className="font-bold text-gray-900 ml-1.5">{recipientEmails?.join(', ') || 'None selected'}</span>
             </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2.5">
              <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 ml-1">Email Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Campus Placement Drive 2024 - JIMS Rohini"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-12 border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all rounded-xl shadow-none"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700 ml-1">Message Body</Label>
              <Textarea
                id="message"
                placeholder="Write your professional proposal or coordination message here..."
                className="min-h-[220px] resize-none border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all rounded-xl p-5 leading-relaxed shadow-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 pb-8 pt-0 flex sm:justify-between items-center bg-white border-t border-gray-50 flex-row gap-4">
           <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" />
              Standard branding will be appended.
           </div>
           <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={onClose} 
                className="h-11 px-6 rounded-xl text-gray-500 hover:bg-gray-50 font-medium"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={isSending}
                className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8 rounded-xl shadow-md gap-2 font-bold min-w-[140px]"
              >
                {isSending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSending ? 'Transmitting...' : 'Send Now'}
              </Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

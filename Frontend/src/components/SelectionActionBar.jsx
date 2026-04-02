import { Button } from './ui/button';
import { Send } from 'lucide-react';



export function SelectionActionBar({ selectedCount, onSendToCompany, onNotifyStudents }) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="font-semibold text-indigo-600">{selectedCount}</span>
          </div>
          <span className="font-medium text-gray-900">
            {selectedCount} {selectedCount === 1 ? 'Student' : 'Students'} Selected
          </span>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={onNotifyStudents}
            variant="outline"
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            Notify Students
          </Button>
          <Button
            onClick={onSendToCompany}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          >
            <Send className="w-4 h-4" />
            Send to Company
          </Button>
        </div>
      </div>
    </div>
  );
}

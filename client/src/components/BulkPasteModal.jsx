import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Users } from 'lucide-react';

export function BulkPasteModal({ isOpen, onClose, onApply }) {
  const [text, setText] = useState('');

  const handleApply = () => {
    if (!text.trim()) return;
    
    // Parse names by line breaks, commas, or multiple spaces
    const names = text
      .split(/[\n,]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    onApply(names);
    setText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Student Search
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            Paste multiple student names below. Names can be separated by line breaks or commas.
          </p>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="Paste student names here&#10;Example:&#10;&#10;Rahul Sharma&#10;Priya Singh&#10;Ankit Verma"
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="font-mono text-sm"
          />
          

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={!text.trim()}
          >
            Apply Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

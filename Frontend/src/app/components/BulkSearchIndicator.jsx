import { Button } from './ui/button';
import { X } from 'lucide-react';

export function BulkSearchIndicator({ activeSearchCount, onClearAll }) {
  if (activeSearchCount === 0) return null;

  return (
    <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
        <span className="font-medium text-indigo-900">
          Bulk Search Active • {activeSearchCount} {activeSearchCount === 1 ? 'Name' : 'Names'}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100"
      >
        <X className="w-4 h-4 mr-1" />
        Clear All
      </Button>
    </div>
  );
}

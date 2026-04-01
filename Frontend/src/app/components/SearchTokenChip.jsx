import { X, User } from 'lucide-react';
import { Badge } from './ui/badge';

export function SearchTokenChip({ name, onRemove }) {
  return (
    <Badge 
      variant="secondary" 
      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 pl-2 pr-1 py-1 gap-1.5 text-sm font-medium"
    >
      <User className="w-3.5 h-3.5" />
      <span>{name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 hover:bg-indigo-300 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  );
}

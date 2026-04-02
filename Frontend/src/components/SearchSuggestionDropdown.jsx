import { Badge } from './ui/badge';

export function SearchSuggestionDropdown({ suggestions, onSelect, isVisible }) {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
      {suggestions.map((student) => (
        <button
          key={student.student_id}
          onClick={() => onSelect(student)}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{student.name}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span>Roll No: {student.roll_no}</span>
                <span>•</span>
                <Badge variant="outline" className="text-xs">{student.branch}</Badge>
                <span>•</span>
                <span>CGPA: {student.cgpa.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

import { Users } from 'lucide-react';



export function FilterResultIndicator({ matchedCount, totalCount, searchTokenCount }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
      <Users className="w-4 h-4" />
      <span>
        Showing <span className="font-semibold text-gray-900">{matchedCount}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalCount}</span> students
        {searchTokenCount > 0 && (
          <span className="ml-1">
            matching <span className="font-semibold text-indigo-600">{searchTokenCount}</span>{' '}
            {searchTokenCount === 1 ? 'name' : 'names'}
          </span>
        )}
      </span>
    </div>
  );
}

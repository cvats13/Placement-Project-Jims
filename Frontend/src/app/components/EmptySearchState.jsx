import { SearchX } from 'lucide-react';
import { Button } from './ui/button';



export function EmptySearchState({ onClear }) {
  return (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No students matched the search
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Try adjusting the search names or filters to find the students you're looking for.
      </p>
      <Button onClick={onClear} variant="outline">
        Clear Search
      </Button>
    </div>
  );
}

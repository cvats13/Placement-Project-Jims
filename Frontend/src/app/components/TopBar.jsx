import { Search, User } from 'lucide-react';
import { Input } from './ui/input';



export function TopBar({ searchQuery, onSearchChange, userRole }) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search student by name or roll number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {userRole === 'admin' ? 'Admin' : 'Placement Officer'}
          </p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <User className="w-5 h-5 text-indigo-600" />
        </div>
      </div>
    </div>
  );
}

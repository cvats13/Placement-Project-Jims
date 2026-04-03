import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Slider } from './ui/slider';



export function StudentFilters({ filters, onFilterChange, onApplyFilters, onResetFilters }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-6">
      <h3 className="font-semibold text-gray-900">Filter Students</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Course Filter */}
        <div className="space-y-2">
          <Label>Course</Label>
          <Select 
            value={filters.course} 
            onValueChange={(value) => onFilterChange({ ...filters, course: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="BCA">BCA</SelectItem>
              <SelectItem value="MCA">MCA</SelectItem>
              <SelectItem value="BBA">BBA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Company Filter */}
        <div className="space-y-2">
          <Label>Company</Label>
          <Select 
            value={filters.company} 
            onValueChange={(value) => onFilterChange({ ...filters, company: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="TCS">TCS</SelectItem>
              <SelectItem value="Infosys">Infosys</SelectItem>
              <SelectItem value="Wipro">Wipro</SelectItem>
              <SelectItem value="Cognizant">Cognizant</SelectItem>
              <SelectItem value="Accenture">Accenture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CIE Marks Threshold */}
        <div className="space-y-3">
          <Label>CIE Marks Threshold: {filters.ciaThreshold}</Label>
          <Slider
            value={[filters.ciaThreshold]}
            onValueChange={([value]) => onFilterChange({ ...filters, ciaThreshold: value })}
            max={100}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Mock Test Threshold */}
        <div className="space-y-3">
          <Label>Mock Test Threshold: {filters.mockTestThreshold}</Label>
          <Slider
            value={[filters.mockTestThreshold]}
            onValueChange={([value]) => onFilterChange({ ...filters, mockTestThreshold: value })}
            max={100}
            step={5}
            className="mt-2"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onApplyFilters} className="bg-indigo-600 hover:bg-indigo-700">
          Apply Filters
        </Button>
        <Button onClick={onResetFilters} variant="outline">
          Reset Filters
        </Button>
      </div>
    </div>
  );
}

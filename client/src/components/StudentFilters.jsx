import { useEffect, useRef, useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { SearchTokenChip } from './ui/SearchTokenChip';
import { SearchSuggestionDropdown } from './SearchSuggestionDropdown';
import { useDebounce } from '../hooks/useDebounce';



export function StudentFilters({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters,
  userRole,
  allStudents = [],
  searchTokens = [],
  onSearchTokensChange,
  onBulkPasteClick,
  allSkills = [],
}) {
  const showPasteNameSearch = typeof onSearchTokensChange === 'function';
  const [inputValue, setInputValue] = useState('');
  const debouncedInput = useDebounce(inputValue, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!showPasteNameSearch) return;

    if (debouncedInput.trim().length > 0) {
      const filtered = allStudents
        .filter(student =>
          student.name.toLowerCase().includes(debouncedInput.toLowerCase()) ||
          student.roll_no.toLowerCase().includes(debouncedInput.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedInput, allStudents, showPasteNameSearch]);

  const addToken = (name) => {
    if (!name || searchTokens.includes(name)) return;
    onSearchTokensChange([...searchTokens, name]);
  };

  const removeToken = (index) => {
    onSearchTokensChange(searchTokens.filter((_, i) => i !== index));
  };

  const handleBulkAdd = (text) => {
    const names = text
      .split(/[\n,]+/)
      .flatMap(line => line.trim().split(/\s{2,}/))
      .map(name => name.trim())
      .filter(name => name.length > 0 && !searchTokens.includes(name));

    if (names.length > 0) {
      onSearchTokensChange([...searchTokens, ...names]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.includes(',') || value.includes('\n')) {
      handleBulkAdd(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addToken(inputValue.trim());
      setInputValue('');
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && !inputValue && searchTokens.length > 0) {
      onSearchTokensChange(searchTokens.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.includes(',') || pastedText.includes('\n') || pastedText.split(' ').length > 2) {
      e.preventDefault();
      handleBulkAdd(pastedText);
    }
  };

  const handleSuggestionSelect = (student) => {
    addToken(student.name);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-6">
      <h3 className="font-semibold text-gray-900">Filter Students</h3>

      {showPasteNameSearch && (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="relative">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 min-h-[44px] flex-wrap focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                  <Search className="w-5 h-5 text-gray-400 ml-1" />

                  {searchTokens.map((token, index) => (
                    <SearchTokenChip
                      key={index}
                      name={token}
                      onRemove={() => removeToken(index)}
                    />
                  ))}

                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={searchTokens.length === 0 
                      ? "Search students" 
                      : "Add more names..."}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onFocus={() => inputValue && setShowSuggestions(true)}
                    className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
                  />
                </div>

                <SearchSuggestionDropdown
                  suggestions={suggestions}
                  onSelect={handleSuggestionSelect}
                  isVisible={showSuggestions}
                />
              </div>


            </div>

            {typeof onBulkPasteClick === 'function' && (
              <Button
                variant="outline"
                onClick={onBulkPasteClick}
                className="gap-2 whitespace-nowrap"
              >
                <FileText className="w-4 h-4" />
                Paste Names
              </Button>
            )}
          </div>
        </div>
      )}
      
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

        {/* 10th Percentage Threshold */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex justify-between">
            <span>Min 10th Score</span>
            <span className="text-indigo-600">{filters.min10th}%</span>
          </Label>
          <Slider
            value={[filters.min10th]}
            onValueChange={([value]) => onFilterChange({ ...filters, min10th: value })}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>

        {/* 12th Percentage Threshold */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex justify-between">
            <span>Min 12th Score</span>
            <span className="text-indigo-600">{filters.min12th}%</span>
          </Label>
          <Slider
            value={[filters.min12th]}
            onValueChange={([value]) => onFilterChange({ ...filters, min12th: value })}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Graduation Percentage Threshold */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex justify-between">
            <span>Min Graduation</span>
            <span className="text-indigo-600">{filters.minGrad}%</span>
          </Label>
          <Slider
            value={[filters.minGrad]}
            onValueChange={([value]) => onFilterChange({ ...filters, minGrad: value })}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Current CGPA Threshold */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex justify-between">
            <span>Min CGPA (Cumulative Grade Point Average)</span>
            <span className="text-indigo-600">{filters.minCGPA}</span>
          </Label>
          <Slider
            value={[filters.minCGPA]}
            onValueChange={([value]) => onFilterChange({ ...filters, minCGPA: value })}
            max={10}
            step={0.1}
            className="mt-2"
          />
        </div>

        {/* Skills Filter */}
        <div className="space-y-2 lg:col-span-2">
          <Label>Skills Dashboard</Label>
          <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg min-h-[44px]">
            {filters.skills.split(',')
              .map(s => s.trim())
              .filter(s => s !== '')
              .map((skill, idx) => (
                <SearchTokenChip 
                  key={idx} 
                  name={skill} 
                  onRemove={() => {
                    const newSkills = filters.skills.split(',')
                      .map(s => s.trim())
                      .filter(s => s.toLowerCase() !== skill.toLowerCase())
                      .join(', ');
                    onFilterChange({ ...filters, skills: newSkills });
                  }}
                />
              ))}
            
            <Select 
              value="" 
              onValueChange={(value) => {
                if (!value || value === 'all') return;
                const currentSkills = filters.skills.split(',').map(s => s.trim().toLowerCase());
                if (currentSkills.includes(value.toLowerCase())) return;
                
                const newSkills = filters.skills 
                  ? `${filters.skills}, ${value}` 
                  : value;
                onFilterChange({ ...filters, skills: newSkills });
              }}
            >
              <SelectTrigger className="w-[180px] h-8 border-none bg-transparent shadow-none focus:ring-0">
                <SelectValue placeholder="+ Add Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" disabled>Select to add...</SelectItem>
                {allSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-[10px] text-gray-400">Add skills from the database to filter students</p>
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

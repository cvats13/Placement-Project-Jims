import { useState, useRef, useEffect } from 'react';
import { Search, User, FileText } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SearchTokenChip } from './ui/SearchTokenChip';
import { SearchSuggestionDropdown } from './SearchSuggestionDropdown';
import { useDebounce } from '../hooks/useDebounce';

export function EnhancedTopBar({ 
  searchTokens, 
  onSearchTokensChange, 
  onBulkPasteClick, 
  userRole,
  allStudents 
}) {
  const showStudentSearchInTopBar = userRole !== 'placement_officer';
  const [inputValue, setInputValue] = useState('');
  const debouncedInput = useDebounce(inputValue, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (debouncedInput.trim().length > 0) {
      const filtered = allStudents.filter(student =>
        student.name.toLowerCase().includes(debouncedInput.toLowerCase()) ||
        student.roll_no.toLowerCase().includes(debouncedInput.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedInput, allStudents]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Check for paste or separators
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
      // Remove last token if input is empty
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

  const addToken = (name) => {
    if (name && !searchTokens.includes(name)) {
      onSearchTokensChange([...searchTokens, name]);
    }
  };

  const removeToken = (index) => {
    onSearchTokensChange(searchTokens.filter((_, i) => i !== index));
  };

  const handleSuggestionSelect = (student) => {
    addToken(student.name);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {showStudentSearchInTopBar ? (
          <>
            {/* Search Area */}
            <div className="flex-1 max-w-3xl">
              <div className="relative">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2 min-h-[44px] flex-wrap focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                  <Search className="w-5 h-5 text-gray-400 ml-1" />
                  
                  {/* Token Chips */}
                  {searchTokens.map((token, index) => (
                    <SearchTokenChip
                      key={index}
                      name={token}
                      onRemove={() => removeToken(index)}
                    />
                  ))}
                  
                  {/* Input Field */}
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={searchTokens.length === 0 
                      ? "Search students (paste multiple names separated by space, comma, or line break)" 
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

                {/* Suggestions Dropdown */}
                <SearchSuggestionDropdown
                  suggestions={suggestions}
                  onSelect={handleSuggestionSelect}
                  isVisible={showSuggestions}
                />
              </div>

              <p className="text-xs text-gray-500 mt-1.5 ml-1">
                Example: Rahul Priya Aman or paste multiple names at once
              </p>
            </div>

            {/* Bulk Paste Button */}
            <Button
              variant="outline"
              onClick={onBulkPasteClick}
              className="gap-2 whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              Paste Names
            </Button>
          </>
        ) : (
          <div className="flex-1" />
        )}


      </div>
    </div>
  );
}

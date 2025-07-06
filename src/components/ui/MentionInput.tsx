/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface MentionSuggestion {
  username: string;
  displayName: string;
  avatar?: string;
  id: string;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  disabled?: boolean;
  suggestions?: MentionSuggestion[];
  onMentionSearch?: (query: string) => Promise<MentionSuggestion[]>;
  autoFocus?: boolean;
}

/**
 * Text input component with @mention autocomplete functionality
 */
export const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Write a reply...',
  className = '',
  maxLength = 2000,
  disabled = false,
  suggestions = [],
  onMentionSearch,
  autoFocus = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState<MentionSuggestion[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartPos, setMentionStartPos] = useState(-1);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle text changes and detect @mentions
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);
    
    // Check if we're typing an @mention
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@([a-zA-Z0-9_-]*)$/);
    
    if (mentionMatch) {
      const query = mentionMatch[1];
      const startPos = cursorPos - mentionMatch[0].length;
      
      setMentionQuery(query);
      setMentionStartPos(startPos);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
      
      // Fetch suggestions if callback provided
      if (onMentionSearch && query.length >= 1) {
        onMentionSearch(query).then(suggestions => {
          setMentionSuggestions(suggestions);
        });
      } else {
        // Filter static suggestions
        const filtered = suggestions.filter(s => 
          s.username.toLowerCase().includes(query.toLowerCase()) ||
          s.displayName.toLowerCase().includes(query.toLowerCase())
        );
        setMentionSuggestions(filtered);
      }
    } else {
      setShowSuggestions(false);
      setMentionSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }
  }, [onChange, onMentionSearch, suggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && mentionSuggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < mentionSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : mentionSuggestions.length - 1
          );
          break;
        case 'Enter':
        case 'Tab':
          if (selectedSuggestionIndex >= 0) {
            e.preventDefault();
            insertMention(mentionSuggestions[selectedSuggestionIndex]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          break;
      }
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      // Submit on Cmd/Ctrl + Enter
      onSubmit?.();
    }
  }, [showSuggestions, mentionSuggestions, selectedSuggestionIndex, onSubmit]);

  // Insert selected mention
  const insertMention = useCallback((suggestion: MentionSuggestion) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const beforeMention = value.slice(0, mentionStartPos);
    const afterMention = value.slice(textarea.selectionStart);
    const newValue = beforeMention + `@${suggestion.username} ` + afterMention;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    // Focus and position cursor after the mention
    setTimeout(() => {
      const newCursorPos = beforeMention.length + suggestion.username.length + 2; // +2 for @  and space
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, mentionStartPos, onChange]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [value]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className}`}
        style={{ minHeight: '80px' }}
      />
      
      {/* Character counter */}
      {maxLength && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {value.length}/{maxLength}
        </div>
      )}
      
      {/* Mention suggestions dropdown */}
      {showSuggestions && mentionSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {mentionSuggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${
                index === selectedSuggestionIndex 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => insertMention(suggestion)}
            >
              {suggestion.avatar && (
                <img
                  src={suggestion.avatar}
                  alt={suggestion.username}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="font-medium">@{suggestion.username}</div>
                {suggestion.displayName !== suggestion.username && (
                  <div className="text-sm text-gray-500">{suggestion.displayName}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Simpler mention input for basic use cases
 */
export const SimpleMentionInput: React.FC<Omit<MentionInputProps, 'suggestions' | 'onMentionSearch'>> = (props) => {
  return <MentionInput {...props} />;
};

export default MentionInput;
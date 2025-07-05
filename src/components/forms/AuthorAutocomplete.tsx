/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import { getAvatarByIdentifier } from '@/utils/avatarUtils';
import { getUserInitials } from '@/utils/usernameGenerator';

interface User {
  id: string;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  preferredAvatar?: string;
  authProvider: 'google' | 'anonymous';
}

interface AuthorAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function AuthorAutocomplete({ 
  value, 
  onChange, 
  onBlur,
  placeholder = "Author name", 
  className = "",
  autoFocus = false
}: AuthorAutocompleteProps) {
  const { user: currentUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update search term when value prop changes
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Search for users
  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 1) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/users/search?q=${encodeURIComponent(searchTerm)}&limit=8`);
        const data = await response.json();
        
        // Always include current user at the top if they match
        const users = data.users || [];
        const filteredUsers = users.filter((u: User) => 
          u.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Add current user suggestion if not already in results
        if (currentUser && 
            currentUser.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !filteredUsers.some((u: User) => u.id === currentUser.id)) {
          filteredUsers.unshift({
            id: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            profilePictureUrl: currentUser.profilePictureUrl,
            preferredAvatar: currentUser.preferredAvatar,
            authProvider: currentUser.authProvider
          });
        }

        setSuggestions(filteredUsers);
        setIsOpen(filteredUsers.length > 0);
        if (filteredUsers.length > 0) {
        }
        setHighlightedIndex(-1);
      } catch (error) {
        console.error('Error searching users:', error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 200);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, currentUser]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (user: User) => {
    
    // Immediately close dropdown and clear suggestions to prevent reopening
    setIsOpen(false);
    setHighlightedIndex(-1);
    setSuggestions([]); // Clear suggestions to prevent auto-opening
    
    // Update values
    setSearchTerm(user.username);
    onChange(user.username);
    
    // Blur input and trigger parent onBlur to exit editing mode
    setTimeout(() => {
      inputRef.current?.blur();
      onBlur?.();
    }, 10);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input focus
  const handleFocus = () => {
    // Don't auto-open on focus - only open when user starts typing
    // This prevents the dropdown from opening every time the field gets focus
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent) => {
    // Delay closing to allow clicking on suggestions
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        // Call the parent's onBlur if provided
        onBlur?.();
      }
    }, 150);
  };

  // Avatar component to handle different image types safely
  const UserAvatar = ({ user }: { user: User }) => {
    const [imageError, setImageError] = useState(false);
    const avatarSrc = user.preferredAvatar || user.profilePictureUrl || getAvatarByIdentifier(user.username);
    const userInitials = getUserInitials(user.username);
    
    // Check if it's a local avatar (safe for Next.js Image)
    const isLocalAvatar = avatarSrc.startsWith('/avatars/');
    
    if (imageError || !isLocalAvatar) {
      // Show initials for external URLs or failed images
      return (
        <div className="w-12 h-12 rounded-full bg-white border border-black/20 flex items-center justify-center">
          <span className="text-lg font-bold font-space-grotesk text-black">
            {userInitials}
          </span>
        </div>
      );
    }
    
    // Use Next.js Image for local avatars only
    return (
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <Image
          src={avatarSrc}
          alt={user.username}
          width={48}
          height={48}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  // Get provider badge color (legacy - keeping for compatibility)
  const getProviderColor = (authProvider: string) => {
    return authProvider === 'google' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  };

  // Get provider badge style following Synapsas design
  const getProviderBadgeStyle = (authProvider: string) => {
    return authProvider === 'google' 
      ? 'bg-[#51bd94] text-black'  // Green for Google (authenticated)
      : 'bg-[#f2e356] text-black';  // Yellow for Anonymous
  };

  // Handle clear button click
  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Handle "Me" button click
  const handleSelectMe = () => {
    if (currentUser?.username) {
      // Close dropdown and clear suggestions
      setIsOpen(false);
      setHighlightedIndex(-1);
      setSuggestions([]);
      
      // Update values
      setSearchTerm(currentUser.username);
      onChange(currentUser.username);
      
      // Blur input and trigger parent onBlur to exit editing mode
      setTimeout(() => {
        inputRef.current?.blur();
        onBlur?.();
      }, 10);
    }
  };

  return (
    <div 
      className="flex gap-2" 
      style={{ 
        zIndex: 10000000,
        isolation: 'isolate',
        transform: 'translateZ(0)'
      }}
    >
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full text-xs font-inter px-2 py-1 pr-8 border border-black focus:outline-none focus:ring-1 focus:ring-black/20 transition-all duration-200 ${
            isOpen && suggestions.length > 0 
              ? 'bg-yellow-50 border-yellow-500 ring-1 ring-yellow-200' 
              : 'bg-white'
          } ${className}`}
          autoComplete="off"
        />
        
        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-black/60 hover:text-black hover:bg-black/5 rounded-full transition-all duration-200 group"
            title="Clear"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Helper text when suggestions are available */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-yellow-100 border-l border-r border-yellow-500 px-4 py-2 text-xs font-inter text-yellow-800" style={{ zIndex: 99998 }}>
            💡 Click on a suggestion below to select that user
          </div>
        )}
      </div>
      
      {/* Me Button - only show when component is focused/active */}
      {currentUser?.username && autoFocus && (
        <button
          type="button"
          onClick={handleSelectMe}
          className="group relative px-2 py-1 border border-black bg-[#6bdbff] text-black hover:bg-[#5ac8ec] transition-all duration-200 font-space-grotesk font-medium text-xs overflow-hidden whitespace-nowrap"
          title={`Set author to: ${currentUser.username}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="relative">Me</span>
        </button>
      )}
      {/* Suggestions Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute bg-white border border-black max-h-80 overflow-y-auto shadow-2xl"
          style={{ 
            top: '100%',
            left: '0',
            right: currentUser?.username ? '80px' : '0', // Account for Me button width
            minWidth: '400px',
            width: 'max-content',
            maxWidth: '600px',
            zIndex: 99999,
            transform: 'translateZ(0)',
            isolation: 'isolate',
            position: 'absolute',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
          }}
        >
          {isLoading ? (
            <div className="p-8 text-center font-inter">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-black animate-bounce"></div>
              </div>
              <span className="text-base text-black/70 font-space-grotesk">Searching users...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((user, index) => (
              <button
                key={user.id}
                type="button"
                className={`group relative w-full text-left px-8 py-6 font-inter hover:bg-[#f0e3ff] focus:bg-[#f0e3ff] focus:outline-none border-b border-black/10 last:border-b-0 transition-all duration-200 overflow-hidden ${
                  index === highlightedIndex ? 'bg-[#f0e3ff]' : 'bg-white'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur event
                  handleSuggestionClick(user);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {/* Synapsas hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <div className="relative flex items-center space-x-6">
                  {/* Avatar - using the new avatar component */}
                  <div className="flex-shrink-0">
                    <UserAvatar user={user} />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="font-bold text-black truncate font-space-grotesk text-lg">
                        {user.username}
                      </span>
                      {user.id === currentUser?.id && (
                        <span className="px-3 py-1.5 text-sm bg-[#6bdbff] text-black border border-black font-inter font-medium">
                          You
                        </span>
                      )}
                      <span className={`px-3 py-1.5 text-sm border border-black font-inter font-medium ${getProviderBadgeStyle(user.authProvider)}`}>
                        {user.authProvider === 'google' ? 'Google' : 'Anonymous'}
                      </span>
                    </div>
                    {user.email && (
                      <div className="text-base text-black/60 truncate font-inter">
                        {user.email}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : searchTerm.length >= 1 ? (
            <div className="p-8 text-center font-inter">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-base text-black/70 font-space-grotesk">No users found</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
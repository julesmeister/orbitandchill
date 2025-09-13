/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useRef } from 'react';

interface UseDropdownStateProps {
  onDropdownToggle?: (isOpen: boolean) => void;
  editingPersonId?: string | null;
}

interface UseDropdownStateReturn {
  isOpen: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  setIsOpen: (isOpen: boolean) => void;
  handleToggleDropdown: () => void;
  closeDropdown: () => void;
}

export const useDropdownState = ({
  onDropdownToggle,
  editingPersonId
}: UseDropdownStateProps): UseDropdownStateReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = () => {
    setIsOpen(false);
    onDropdownToggle?.(false);
  };

  const handleToggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onDropdownToggle?.(newIsOpen);
  };

  // Close dropdown when clicking outside (completely disabled when editing)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close dropdown if someone is editing
      if (editingPersonId) return;
      
      if (isOpen && buttonRef.current && dropdownRef.current) {
        const target = event.target as Node;
        if (!buttonRef.current.contains(target) && !dropdownRef.current.contains(target)) {
          closeDropdown();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, editingPersonId, onDropdownToggle]);

  return {
    isOpen,
    buttonRef,
    dropdownRef,
    setIsOpen,
    handleToggleDropdown,
    closeDropdown
  };
};
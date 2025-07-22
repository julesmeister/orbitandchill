/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback } from 'react';

export interface UseCollapsibleSectionReturn {
  isCollapsed: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export function useCollapsibleSection(initialCollapsed: boolean = false): UseCollapsibleSectionReturn {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(initialCollapsed);

  const toggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
  }, []);

  return {
    isCollapsed,
    toggle,
    expand,
    collapse,
    setCollapsed
  };
}

// Multiple collapsible sections
export interface UseMultipleCollapsibleSectionsReturn {
  [key: string]: UseCollapsibleSectionReturn;
}

export function useMultipleCollapsibleSections(
  keys: string[], 
  initialStates?: Record<string, boolean>
): UseMultipleCollapsibleSectionsReturn {
  const sections: UseMultipleCollapsibleSectionsReturn = {};
  
  keys.forEach(key => {
    const initialCollapsed = initialStates?.[key] ?? false;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    sections[key] = useCollapsibleSection(initialCollapsed);
  });

  return sections;
}
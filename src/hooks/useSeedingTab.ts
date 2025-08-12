/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { GenerationSettings, SeedingResults } from '@/types/seeding';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';

interface UseSeedingTabReturn {
  // Tab management
  activeTab: 'generation' | 'management';
  setActiveTab: (tab: 'generation' | 'management') => void;
  
  // UI state
  isControlPanelCollapsed: boolean;
  setIsControlPanelCollapsed: (collapsed: boolean) => void;
  areConfigSectionsHidden: boolean;
  setAreConfigSectionsHidden: (hidden: boolean) => void;
  
  // Generation settings
  generationSettings: GenerationSettings;
  setGenerationSettings: (settings: GenerationSettings) => void;
  
  // User management
  selectedUsers: string[];
  setSelectedUsers: (users: string[]) => void;
  editingUser: string | null;
  setEditingUser: (userId: string | null) => void;
  personasExpanded: boolean;
  setPersonasExpanded: (expanded: boolean) => void;
  showPersonasCompleteMessage: boolean;
  setShowPersonasCompleteMessage: (show: boolean) => void;
  
  // Helper functions
  toggleUserSelection: (userId: string) => void;
  updateGenerationSetting: <K extends keyof GenerationSettings>(key: K, value: GenerationSettings[K]) => void;
}

export function useSeedingTab(): UseSeedingTabReturn {
  // Tab Management State
  const [activeTab, setActiveTab] = useState<'generation' | 'management'>('generation');
  
  // UI Collapsible sections state
  const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);
  const [areConfigSectionsHidden, setAreConfigSectionsHidden] = useState(false);

  // Generation Settings State
  const [generationSettings, setGenerationSettings] = useState<GenerationSettings>({
    discussionsToGenerate: 10,
    repliesPerDiscussion: { min: 5, max: 25 },
    maxNestingDepth: 4,
    contentVariation: 70
  });

  // User Management State
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    SEED_PERSONA_TEMPLATES.map(u => u.id)
  );
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [personasExpanded, setPersonasExpanded] = useState(false);
  const [showPersonasCompleteMessage, setShowPersonasCompleteMessage] = useState(false);

  // Helper function to toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Helper function to update generation settings
  const updateGenerationSetting = <K extends keyof GenerationSettings>(
    key: K, 
    value: GenerationSettings[K]
  ) => {
    setGenerationSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    // Tab management
    activeTab,
    setActiveTab,
    
    // UI state
    isControlPanelCollapsed,
    setIsControlPanelCollapsed,
    areConfigSectionsHidden,
    setAreConfigSectionsHidden,
    
    // Generation settings
    generationSettings,
    setGenerationSettings,
    
    // User management
    selectedUsers,
    setSelectedUsers,
    editingUser,
    setEditingUser,
    personasExpanded,
    setPersonasExpanded,
    showPersonasCompleteMessage,
    setShowPersonasCompleteMessage,
    
    // Helper functions
    toggleUserSelection,
    updateGenerationSetting
  };
}
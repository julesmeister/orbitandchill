/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { SEED_PERSONA_TEMPLATES, type SeedPersonaTemplate } from '@/data/seedPersonas';

interface UseSeedUsersReturn {
  // State
  seedUsersInitialized: boolean;
  seedUsersStatus: any;
  selectedUsers: string[];
  editingUser: string | null;
  
  // Actions
  initializeSeedUsers: (onResult: (result: any) => void) => Promise<void>;
  checkSeedUsersStatus: () => Promise<void>;
  toggleUserSelection: (userId: string) => void;
  setEditingUser: (userId: string | null) => void;
  
  // Data
  seedUsers: SeedPersonaTemplate[];
}

export const useSeedUsers = (): UseSeedUsersReturn => {
  const [seedUsersInitialized, setSeedUsersInitialized] = useState(false);
  const [seedUsersStatus, setSeedUsersStatus] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(SEED_PERSONA_TEMPLATES.map(u => u.id));
  const [editingUser, setEditingUser] = useState<string | null>(null);

  // Initialize seed users on mount
  useEffect(() => {
    checkSeedUsersStatus();
  }, []);

  const checkSeedUsersStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/seed-users/bulk-create');
      const result = await response.json();
      
      if (response.ok) {
        setSeedUsersStatus(result.status);
        setSeedUsersInitialized(result.status?.isReady || false);
      }
    } catch (error) {
      console.error('Error checking seed users status:', error);
    }
  }, []);

  const initializeSeedUsers = useCallback(async (onResult: (result: any) => void) => {
    try {
      const response = await fetch('/api/admin/seed-users/bulk-create', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setSeedUsersInitialized(true);
        onResult({
          success: true,
          message: `Successfully created ${result.created.users} seed users with configurations`
        });
        await checkSeedUsersStatus();
      } else {
        onResult({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      onResult({
        success: false,
        error: 'Failed to initialize seed users: ' + (error as Error).message
      });
    }
  }, [checkSeedUsersStatus]);

  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  return {
    // State
    seedUsersInitialized,
    seedUsersStatus,
    selectedUsers,
    editingUser,
    
    // Actions
    initializeSeedUsers,
    checkSeedUsersStatus,
    toggleUserSelection,
    setEditingUser,
    
    // Data
    seedUsers: SEED_PERSONA_TEMPLATES
  };
};
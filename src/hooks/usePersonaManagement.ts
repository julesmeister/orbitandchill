/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';

export const usePersonaManagement = (seedUsersInitialized: boolean) => {
  const [allPersonasComplete, setAllPersonasComplete] = useState(false);

  const checkPersonasStatus = async () => {
    try {
      const response = await fetch('/api/admin/seed-users/complete-all');
      const result = await response.json();
      
      if (result.success) {
        setAllPersonasComplete(result.isComplete);
      }
    } catch (error) {
      console.error('Failed to check personas status:', error);
    }
  };

  const createAllPersonas = async () => {
    try {
      const response = await fetch('/api/admin/seed-users/complete-all', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        await checkPersonasStatus();
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to complete personas: ' + (error as Error).message
      };
    }
  };

  // Check personas status when seed users are initialized
  useEffect(() => {
    if (seedUsersInitialized) {
      checkPersonasStatus();
    }
  }, [seedUsersInitialized]);

  return {
    // State
    allPersonasComplete,
    
    // Actions
    checkPersonasStatus,
    createAllPersonas,
  };
};
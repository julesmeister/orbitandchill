/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { useUserStore } from '../store/userStore';
import { detectStelliums } from '../utils/stelliumDetection';
import { NatalChartData } from '../utils/natalChart';

/**
 * Hook to sync stellium data from chart data to user profile
 * This ensures stelliums are populated when viewing chart interpretations
 * @param chartData - The natal chart data to sync from
 * @param isOwnChart - Whether this chart belongs to the current user (forces sync)
 */
export function useStelliumSync(chartData?: NatalChartData, isOwnChart: boolean = false) {
  const { user, updateUser } = useUserStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  
  // Use refs to store stable function references
  const updateUserRef = useRef(updateUser);
  const userRef = useRef(user);
  
  // Update refs when values change
  useEffect(() => {
    updateUserRef.current = updateUser;
    userRef.current = user;
  }, [updateUser, user]);

  useEffect(() => {
    // Only run once per component mount
    if (hasAttempted || !chartData || !userRef.current) return;

    // Check if user already has chart data (stelliums or sun sign)
    const currentUser = userRef.current;
    const hasChartData = (
      (currentUser.stelliumSigns && currentUser.stelliumSigns.length > 0) ||
      (currentUser.stelliumHouses && currentUser.stelliumHouses.length > 0) ||
      currentUser.sunSign
    );

    // If user already has chart data, don't need to sync UNLESS this is their own chart
    if (hasChartData && !isOwnChart) {
      setHasAttempted(true);
      return;
    }

    // Detect stelliums from chart data
    const syncStelliums = async () => {
      if (isUpdating) return;
      
      setIsUpdating(true);
      setHasAttempted(true);

      try {
        const stelliumResult = detectStelliums(chartData);
        
        // Prepare update data
        const updateData: any = { hasNatalChart: true };
        
        if (stelliumResult.signStelliums.length > 0) {
          updateData.stelliumSigns = stelliumResult.signStelliums;
        }
        
        if (stelliumResult.houseStelliums.length > 0) {
          updateData.stelliumHouses = stelliumResult.houseStelliums;
        }
        
        if (stelliumResult.sunSign) {
          updateData.sunSign = stelliumResult.sunSign;
        }
        
        if (stelliumResult.detailedStelliums && stelliumResult.detailedStelliums.length > 0) {
          updateData.detailedStelliums = stelliumResult.detailedStelliums;
        }
        
        
        // Update via API first (which will persist to database)
        const response = await fetch('/api/users/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.id,
            preferences: updateData,
          }),
        });

        if (response.ok) {
          // Update local user store
          await updateUserRef.current(updateData);
        } else {
          console.warn('⚠️ Failed to sync chart data via API, updating locally only');
          // Update local store even if API fails
          await updateUserRef.current(updateData);
        }
      } catch (error) {
        console.error('❌ Error syncing stelliums:', error);
      } finally {
        setIsUpdating(false);
      }
    };

    syncStelliums();
  }, [chartData, hasAttempted, isOwnChart]); // Include isOwnChart to force sync when viewing own chart

  return {
    isUpdating,
    hasAttempted,
  };
}
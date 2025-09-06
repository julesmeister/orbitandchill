/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const createUIActions = (set: any, get: any) => ({
  // UI state setters
  setShowCalendar: (show: boolean) => set({ showCalendar: show }),
  
  setCurrentDate: (date: Date) => set({ currentDate: date }),
  
  setSelectedType: (type: 'all' | 'benefic' | 'challenging' | 'neutral') => 
    set({ selectedType: type }),
  
  setSelectedPriorities: (priorities: string[]) => 
    set({ selectedPriorities: priorities }),
  
  togglePriority: (priorityId: string) => set((state: any) => ({
    selectedPriorities: state.selectedPriorities.includes(priorityId)
      ? state.selectedPriorities.filter((p: string) => p !== priorityId)
      : [...state.selectedPriorities, priorityId]
  })),
  
  setShowAddForm: (show: boolean) => set({ showAddForm: show }),
  
  setShowTimingOptions: (show: boolean) => set({ showTimingOptions: show }),
  
  setIsGenerating: (generating: boolean) => set({ isGenerating: generating }),
  
  resetForm: () => set({
    showAddForm: false,
    showTimingOptions: false,
    selectedPriorities: []
  }),
  
  setSelectedTab: (tab: 'all' | 'bookmarked' | 'manual') => set({ selectedTab: tab }),
  
  setHideChallengingDates: (hide: boolean) => set({ hideChallengingDates: hide }),
  
  setShowCombosOnly: (show: boolean) => set({ showCombosOnly: show }),
  
  setShowAspects: (show: boolean) => set({ showAspects: show }),
  
  setShowHousesOnly: (show: boolean) => set({ showHousesOnly: show }),
  
  setShowAspectsOnly: (show: boolean) => set({ showAspectsOnly: show }),
  
  setShowElectionalOnly: (show: boolean) => set({ showElectionalOnly: show }),

  // Error and loading state setters
  setError: (error: string | null) => set({ error }),
  
  setIsLoading: (loading: boolean) => set({ isLoading: loading })
});
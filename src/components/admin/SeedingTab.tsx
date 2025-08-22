"use client";

import React, { useState, useEffect } from 'react';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';
import { useSeedingPersistence } from '@/hooks/useSeedingPersistence';
import { useSeedingOperations } from '@/hooks/useSeedingOperations';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import { usePersonaManagement } from '@/hooks/usePersonaManagement';
import { useSeedingContent } from '@/hooks/useSeedingContent';
import { useReplyManagement } from '@/hooks/useReplyManagement';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAvatarPathsStatus } from '@/hooks/useAvatarPathsStatus';
import { useSeedingTab } from '@/hooks/useSeedingTab';

// New refactored components
import SeedingTabHeader from '@/components/admin/seeding/SeedingTabHeader';
import SeedingTabNavigation from '@/components/admin/seeding/SeedingTabNavigation';
import SeedingStatusSection from '@/components/admin/seeding/SeedingStatusSection';
import SeedingControlPanel from '@/components/admin/seeding/SeedingControlPanel';
import SeedingContentSection from '@/components/admin/seeding/SeedingContentSection';
import SeedingToastsContainer from '@/components/admin/seeding/SeedingToastsContainer';
import ManagementTabContent from '@/components/admin/seeding/ManagementTabContent';

// Remaining components
import PreviewContentDisplay from '@/components/admin/seeding/PreviewContentDisplay';
import ProcessSteps from '@/components/admin/seeding/ProcessSteps';
import PersonaSelector from '@/components/admin/seeding/PersonaSelector';
import LoadingSpinner from '@/components/reusable/LoadingSpinner';
import StickyScrollButtons from '@/components/reusable/StickyScrollButtons';

// New extracted hooks
import { useCommentProcessing } from '@/hooks/useCommentProcessing';
import { useAvatarPathsHandler } from '@/hooks/useAvatarPathsHandler';
import { useReplyHandlers } from '@/hooks/useReplyHandlers';

import { SeedingTabProps } from '@/types/seeding';

const SeedingTab: React.FC<SeedingTabProps> = ({ isLoading = false }) => {
  // Process steps configuration
  const processSteps = [
    {
      number: 1,
      title: "Paste Content",
      description: "Copy and paste Reddit discussions or any content",
      color: "#3b82f6" // blue-500
    },
    {
      number: 2,
      title: "AI Transform",
      description: "AI rephrases, reformats, and makes content unique",
      color: "#10b981" // green-500
    },
    {
      number: 3,
      title: "Generate Forum",
      description: "Create discussions with replies and voting patterns",
      color: "#8b5cf6" // purple-500
    }
  ];

  // Use custom hooks for state management
  const {
    pastedContent,
    scrapedContent,
    previewContent,
    seedingResults,
    aiProvider,
    aiModel,
    aiApiKey,
    temperature,
    activePersonas,
    setPastedContent,
    setScrapedContent,
    setPreviewContent,
    setSeedingResults,
    setAiModel,
    setActivePersonas,
    handleApiKeyChange,
    handleProviderChange,
    handleModelChange,
    handleTemperatureChange,
    togglePersonaActive,
    setAllPersonasActive,
    clearAllContent,
    clearAIConfiguration,
  } = useSeedingPersistence();

  const {
    seedingInProgress,
    seedingProgress,
    seedUsersInitialized,
    seedUsersStatus,
    generatingReplyForIndex,
    selectedMoodForIndex,
    expandedReplies,
    setSelectedMoodForIndex,
    setExpandedReplies,
  } = useSeedingOperations();

  const { getAiConfig } = useAIConfiguration();
  
  const { allPersonasComplete, createAllPersonas } = usePersonaManagement(seedUsersInitialized);
  
  const {
    processContentWrapper,
    processWithAIWrapper,
    executeSeedingWrapper,
    initializeSeedUsersWrapper,
    checkSeedUsersStatus,
    
    // Main seeding operation toast properties
    toastVisible: seedingToastVisible,
    toastTitle: seedingToastTitle,
    toastMessage: seedingToastMessage,
    toastStatus: seedingToastStatus,
    hideToast: hideSeedingToast,
  } = useSeedingContent();

  const {
    addReplyWithToast,
    deleteReplyWithToast,
    toastVisible: replyToastVisible,
    toastTitle: replyToastTitle,
    toastMessage: replyToastMessage,
    toastStatus: replyToastStatus,
    hideToast: hideReplyToast,
  } = useReplyManagement();

  // Additional toast notifications for main seeding operations
  const {
    showLoadingToast,
    showSuccessToast,
    showErrorToast,
    ...mainToastProps
  } = useToastNotifications();

  // Avatar paths status
  const { 
    totalUsers, 
    usersNeedingFix, 
    isLoading: avatarStatusLoading, 
    refetch: refetchAvatarStatus 
  } = useAvatarPathsStatus();

  // Use the custom tab hook
  const {
    activeTab,
    setActiveTab,
    isControlPanelCollapsed,
    setIsControlPanelCollapsed,
    areConfigSectionsHidden,
    setAreConfigSectionsHidden,
    generationSettings,
    selectedUsers,
    setSelectedUsers,
    editingUser,
    setEditingUser,
    personasExpanded,
    setPersonasExpanded,
    showPersonasCompleteMessage,
    setShowPersonasCompleteMessage,
    toggleUserSelection,
    updateGenerationSetting
  } = useSeedingTab();

  // Destructure generation settings for easier access
  const { discussionsToGenerate, repliesPerDiscussion, maxNestingDepth, contentVariation } = generationSettings;

  // Show message when personas are first completed
  useEffect(() => {
    if (seedUsersInitialized && allPersonasComplete) {
      setShowPersonasCompleteMessage(true);
    }
  }, [seedUsersInitialized, allPersonasComplete]);

  // Auto-hide personas complete message after 5 seconds
  useEffect(() => {
    if (seedUsersInitialized && allPersonasComplete && showPersonasCompleteMessage) {
      const timer = setTimeout(() => {
        setShowPersonasCompleteMessage(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [seedUsersInitialized, allPersonasComplete, showPersonasCompleteMessage]);

  // Wrapper functions for hook operations
  const handleProcessContentWrapper = async () => {
    const result = await processContentWrapper(pastedContent, discussionsToGenerate, setSeedingResults);
    if (result.success) {
      setScrapedContent(result.data);
    }
  };

  const handleProcessWithAIWrapper = async () => {
    // Show loading toast
    showLoadingToast('Transforming Content', 'AI is processing and rephrasing your content...');
    
    const result = await processWithAIWrapper(
      scrapedContent,
      aiProvider,
      aiModel,
      aiApiKey,
      temperature,
      generationSettings,
      setSeedingResults,
      setPreviewContent,
      setExpandedReplies
    );
    
    // Show error toast if AI transformation failed
    if (result && !result.success && result.error) {
      console.error('🔄 AI transformation failed, showing error toast:', result.error);
      
      // Extract clean error message for user display
      let userFriendlyError = result.error;
      if (result.error.includes('Developer instruction is not enabled')) {
        userFriendlyError = 'The selected AI model does not support system prompts. Please try a different model like Claude or GPT.';
      } else if (result.error.includes('OpenRouter API error')) {
        // Extract the actual API error message
        const match = result.error.match(/OpenRouter API error: \d+ .+ - (.+)/);
        if (match) {
          userFriendlyError = match[1];
        }
      }
      
      // Show error toast using the toast notification system
      showErrorToast('AI Transformation Failed', userFriendlyError);
    } else if (result && result.success) {
      // Show success toast when AI transformation succeeds
      showSuccessToast('AI Transformation Complete', 'Content has been successfully transformed and is ready for preview!');
    }
  };

  const handleExecuteSeedingWrapper = async () => {
    await executeSeedingWrapper(
      previewContent,
      seedingResults?.batchId,
      generationSettings,
      selectedUsers,
      setSeedingResults
    );
  };

  // Note: toggleUserSelection is now provided by useSeedingTab hook

  const handleInitializeSeedUsers = async () => {
    await initializeSeedUsersWrapper(setSeedingResults);
  };

  const handleCompleteAllPersonas = async () => {
    const result = await createAllPersonas();
    setSeedingResults(result);
    
    if (result.success) {
      await checkSeedUsersStatus();
    }
  };

  // Use avatar paths handler hook
  const { handleFixAvatarPaths } = useAvatarPathsHandler({
    setSeedingResults,
    refetchAvatarStatus,
    showLoadingToast,
    showSuccessToast,
    showErrorToast
  });

  // Use comment processing hook
  const { handleProcessComments } = useCommentProcessing({
    aiProvider,
    aiModel,
    aiApiKey,
    temperature,
    previewContent,
    setPreviewContent,
    setSeedingResults,
    showLoadingToast,
    showSuccessToast,
    showErrorToast
  });

  // Use reply handlers hook
  const {
    handleAddReplyWrapper,
    handleDeleteReply,
    handleClearReplies,
    handleUpdateReply,
    handleUpdateDiscussion
  } = useReplyHandlers({
    previewContent,
    selectedMoodForIndex,
    aiProvider,
    aiModel,
    aiApiKey,
    temperature,
    activePersonas,
    setPreviewContent,
    setSeedingResults,
    addReplyWithToast,
    deleteReplyWithToast
  });


  if (isLoading) {
    return (
      <LoadingSpinner
        variant="dots"
        size="lg"
        title="Loading Discussion Seeding Tools"
        subtitle="Preparing AI-powered content generation and discussion management interface..."
      />
    );
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="px-6 py-8">
        {/* Header */}
        <SeedingTabHeader activeTab={activeTab} />

        {/* Tab Navigation */}
        <SeedingTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Generation Tab */}
        {activeTab === 'generation' && (
          <React.Fragment>
            {/* Process Steps - Can be hidden/shown */}
            {!areConfigSectionsHidden && (
              <ProcessSteps steps={processSteps} className="mb-8" />
            )}

        {/* Status Sections */}
        <SeedingStatusSection
          seedUsersInitialized={seedUsersInitialized}
          allPersonasComplete={allPersonasComplete}
          showPersonasCompleteMessage={showPersonasCompleteMessage}
          usersNeedingFix={usersNeedingFix}
          totalUsers={totalUsers}
          avatarStatusLoading={avatarStatusLoading}
          seedingInProgress={seedingInProgress}
          onInitializeSeedUsers={handleInitializeSeedUsers}
          onCompleteAllPersonas={handleCompleteAllPersonas}
          onFixAvatarPaths={handleFixAvatarPaths}
        />

        {/* Control Panel */}
        <SeedingControlPanel
          isControlPanelCollapsed={isControlPanelCollapsed}
          onToggleCollapsed={() => setIsControlPanelCollapsed(!isControlPanelCollapsed)}
          seedingInProgress={seedingInProgress}
          seedingProgress={seedingProgress}
          seedingResults={seedingResults}
          pastedContent={pastedContent}
          scrapedContent={scrapedContent}
          previewContent={previewContent}
          aiApiKey={aiApiKey}
          seedUsersInitialized={seedUsersInitialized}
          areConfigSectionsHidden={areConfigSectionsHidden}
          onProcessContent={handleProcessContentWrapper}
          onProcessWithAI={handleProcessWithAIWrapper}
          onExecuteSeeding={handleExecuteSeedingWrapper}
          onClearAll={clearAllContent}
          onToggleConfigSections={() => setAreConfigSectionsHidden(!areConfigSectionsHidden)}
        />

        {/* Content Configuration Section */}
        <SeedingContentSection
          pastedContent={pastedContent}
          onContentChange={setPastedContent}
          onProcessComments={handleProcessComments}
          aiProvider={aiProvider}
          aiModel={aiModel}
          aiApiKey={aiApiKey}
          temperature={temperature}
          onProviderChange={handleProviderChange}
          onModelChange={handleModelChange}
          onApiKeyChange={handleApiKeyChange}
          onTemperatureChange={handleTemperatureChange}
          generationSettings={generationSettings}
          onUpdateGenerationSetting={updateGenerationSetting}
          selectedUsers={selectedUsers}
          personasExpanded={personasExpanded}
          editingUser={editingUser}
          onToggleUserSelection={toggleUserSelection}
          onTogglePersonasExpanded={() => setPersonasExpanded(!personasExpanded)}
          onEditUser={setEditingUser}
          areConfigSectionsHidden={areConfigSectionsHidden}
        />

        <PreviewContentDisplay
          previewContent={previewContent}
          selectedMoodForIndex={selectedMoodForIndex}
          generatingReplyForIndex={generatingReplyForIndex}
          expandedReplies={expandedReplies}
          aiApiKey={aiApiKey}
          onAddReply={handleAddReplyWrapper}
          onDeleteReply={handleDeleteReply}
          onClearReplies={handleClearReplies}
          onUpdateReply={handleUpdateReply}
          onUpdateDiscussion={handleUpdateDiscussion}
          onMoodSelect={(index, mood) => {
            setSelectedMoodForIndex(prev => {
              const newState = { ...prev, [index]: mood };
              return newState;
            });
          }}
          onToggleExpandReplies={(index) => setExpandedReplies(prev => ({ ...prev, [index]: !prev[index] }))}
        />

        {/* Active Reply Personas - Placed after content preview for better UX */}
        {!areConfigSectionsHidden && (
          <PersonaSelector
            activePersonas={activePersonas}
            onTogglePersona={togglePersonaActive}
            onSetAllActive={setAllPersonasActive}
            className="mb-8"
          />
        )}
          </React.Fragment>
        )}

        {/* Discussion Management Tab */}
        {activeTab === 'management' && (
          <ManagementTabContent
            showLoadingToast={showLoadingToast}
            showSuccessToast={showSuccessToast}
            showErrorToast={showErrorToast}
            aiProvider={aiProvider}
            aiModel={aiModel}
            aiApiKey={aiApiKey}
            temperature={temperature}
          />
        )}

        {/* Documentation Link - Only show in Content Generation tab */}
        {activeTab === 'generation' && !areConfigSectionsHidden && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800 font-open-sans">
              📄 For detailed technical specifications, see{' '}
              <code className="bg-blue-100 px-1 rounded">DISCUSSIONS_SEEDING_PLAN.md</code>
            </p>
          </div>
        )}

        {/* All Toasts Container */}
        <SeedingToastsContainer
          replyToastTitle={replyToastTitle}
          replyToastMessage={replyToastMessage}
          replyToastStatus={replyToastStatus}
          replyToastVisible={replyToastVisible}
          onHideReplyToast={hideReplyToast}
          seedingToastTitle={seedingToastTitle}
          seedingToastMessage={seedingToastMessage}
          seedingToastStatus={seedingToastStatus}
          seedingToastVisible={seedingToastVisible}
          onHideSeedingToast={hideSeedingToast}
          mainToastTitle={mainToastProps.toastTitle}
          mainToastMessage={mainToastProps.toastMessage}
          mainToastStatus={mainToastProps.toastStatus}
          mainToastVisible={mainToastProps.toastVisible}
          onHideMainToast={mainToastProps.hideToast}
        />
        

        {/* Sticky Scroll Buttons */}
        <StickyScrollButtons />
      </div>
    </div>
  );
};

export default SeedingTab;
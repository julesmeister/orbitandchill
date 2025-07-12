"use client";

import React, { useState, useEffect } from 'react';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';
import { useSeedingPersistence } from '@/hooks/useSeedingPersistence';
import { useSeedingOperations } from '@/hooks/useSeedingOperations';
import { useAIConfiguration } from '@/hooks/useAIConfiguration';
import AIConfigurationForm from '@/components/admin/seeding/AIConfigurationForm';
import ContentInputForm from '@/components/admin/seeding/ContentInputForm';
import UserPersonaManager from '@/components/admin/seeding/UserPersonaManager';
import GenerationSettings from '@/components/admin/seeding/GenerationSettings';
import PreviewContentDisplay from '@/components/admin/seeding/PreviewContentDisplay';
import ProcessSteps from '@/components/admin/seeding/ProcessSteps';
import SeedingActionButtons from '@/components/admin/seeding/SeedingActionButtons';
import LoadingSpinner from '@/components/reusable/LoadingSpinner';

interface SeedingTabProps {
  isLoading?: boolean;
}

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
    setPastedContent,
    setScrapedContent,
    setPreviewContent,
    setSeedingResults,
    setAiModel,
    handleApiKeyChange,
    handleProviderChange,
    handleTemperatureChange,
    clearAllContent,
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
    checkSeedUsersStatus,
    initializeSeedUsers,
    handleProcessPastedContent,
    handleProcessWithAI,
    handleExecuteSeeding,
    handleAddReply,
    handleDeleteReplyById,
  } = useSeedingOperations();

  const { getAiConfig } = useAIConfiguration();

  // Generation Settings State
  const [discussionsToGenerate, setDiscussionsToGenerate] = useState(10);
  const [repliesPerDiscussion, setRepliesPerDiscussion] = useState({ min: 5, max: 25 });
  const [maxNestingDepth, setMaxNestingDepth] = useState(4);
  const [contentVariation, setContentVariation] = useState(70);

  // User Management State
  const [selectedUsers, setSelectedUsers] = useState<string[]>(SEED_PERSONA_TEMPLATES.map(u => u.id));
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [personasExpanded, setPersonasExpanded] = useState(false);

  // Wrapper functions for hook operations
  const handleProcessContentWrapper = async () => {
    const result = await handleProcessPastedContent(pastedContent, discussionsToGenerate);
    setSeedingResults(result);
    if (result.success) {
      setScrapedContent(result.data);
    }
  };

  const handleProcessWithAIWrapper = async () => {
    try {
      console.log('🔄 Starting AI processing wrapper...');
      const aiConfig = getAiConfig(aiProvider, aiModel, aiApiKey, temperature);
      const generationSettings = {
        discussionsToGenerate,
        repliesPerDiscussion,
        maxNestingDepth,
        contentVariation
      };
      
      const result = await handleProcessWithAI(scrapedContent, aiConfig, generationSettings);
      console.log('🔄 AI processing result:', result);
      console.log('🔄 Result success:', result?.success);
      console.log('🔄 Result data type:', typeof result?.data);
      console.log('🔄 Result data length:', result?.data?.length);
      
      setSeedingResults(result);
      if (result && result.success && result.data) {
        console.log('🔄 AI processing successful, setting preview content:', result.data.length, 'discussions');
        if (result.data.length > 0) {
          console.log('🔄 First discussion from AI:', result.data[0]);
          console.log('🔄 First discussion title:', result.data[0]?.transformedTitle);
        }
        setPreviewContent(result.data);
        setExpandedReplies({});
      } else {
        console.error('🔄 AI processing failed or invalid result:', result?.error || 'Unknown error');
        console.error('🔄 Full result object:', result);
      }
    } catch (error) {
      console.error('🔄 AI processing wrapper error:', error);
      setSeedingResults({
        success: false,
        error: 'Failed to process AI result: ' + (error as Error).message
      });
    }
  };

  const handleExecuteSeedingWrapper = async () => {
    const generationSettings = {
      discussionsToGenerate,
      repliesPerDiscussion,
      maxNestingDepth,
      contentVariation
    };
    
    const result = await handleExecuteSeeding(previewContent, seedingResults?.batchId, generationSettings);
    
    // Add the selected users count to the result
    if (result.success && result.finalStats) {
      setSeedingResults({
        ...result,
        finalStats: {
          ...result.finalStats,
          usersCreated: selectedUsers.length
        }
      });
    } else {
      setSeedingResults(result);
    }
  };

  // User management functions
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInitializeSeedUsers = async () => {
    const result = await initializeSeedUsers();
    setSeedingResults(result);
  };

  // Reply management functions
  const handleAddReplyWrapper = async (discussionIndex: number) => {
    const aiConfig = getAiConfig(aiProvider, aiModel, aiApiKey, temperature);
    const result = await handleAddReply(discussionIndex, previewContent, aiConfig, setPreviewContent);
    setSeedingResults(result);
  };

  const handleDeleteReply = (discussionIndex: number, replyId: string) => {
    const result = handleDeleteReplyById(discussionIndex, replyId, setPreviewContent);
    setSeedingResults(result);
  };


  if (isLoading) {
    return (
      <LoadingSpinner
        variant="dots"
        size="md"
        title="Loading seeding tools..."
        subtitle="Preparing AI-powered discussion generation interface."
      />
    );
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-space-grotesk font-bold text-black mb-2">
            AI-Powered Discussion Seeding
          </h1>
          <p className="text-gray-600 font-open-sans">
            Paste Reddit content and let AI rephrase, reformat, and reorganize it into unique astrology forum discussions with user personas.
          </p>
        </div>

        {/* Process Steps */}
        <ProcessSteps steps={processSteps} className="mb-8" />

        {/* Seed Users Status */}
        {!seedUsersInitialized && (
          <div className="bg-yellow-50 border border-yellow-200 mb-8 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-space-grotesk font-semibold text-yellow-800 mb-2">
                  Seed Users Required
                </h3>
                <p className="text-yellow-700 font-open-sans">
                  You need to initialize the 5 AI personas before you can start seeding discussions.
                </p>
              </div>
              <button
                onClick={handleInitializeSeedUsers}
                disabled={seedingInProgress}
                className="px-6 py-3 bg-yellow-600 text-white font-space-grotesk font-semibold hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Initialize Seed Users
              </button>
            </div>
          </div>
        )}

        {/* Main Control Panel */}
        <div className="bg-white border border-black mb-8">
          <div className="p-6">
            <SeedingActionButtons
              seedingInProgress={seedingInProgress}
              seedingProgress={seedingProgress}
              pastedContent={pastedContent}
              scrapedContent={scrapedContent}
              previewContent={previewContent}
              aiApiKey={aiApiKey}
              seedUsersInitialized={seedUsersInitialized}
              onProcessContent={handleProcessContentWrapper}
              onProcessWithAI={handleProcessWithAIWrapper}
              onExecuteSeeding={handleExecuteSeedingWrapper}
              onClearAll={clearAllContent}
              className="mb-6"
            />

            {/* Progress Bar */}
            {seedingInProgress && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 border border-black h-4">
                  <div 
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${seedingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2 font-open-sans">
                  Progress: {Math.round(seedingProgress)}%
                </p>
              </div>
            )}

            {/* Results */}
            {seedingResults && (
              <div className={`p-4 border border-black mb-6 ${
                seedingResults.success ? 'bg-green-50' : 'bg-red-50'
              }`}>
                {seedingResults.restoredFromCache && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800 font-open-sans flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {seedingResults.restoredMessage || 'Data restored from previous session'}
                    </p>
                  </div>
                )}
                {seedingResults.success ? (
                  <div>
                    <h3 className="font-space-grotesk font-semibold text-green-800 mb-2">
                      ✅ {seedingResults.message}
                    </h3>
                    {seedingResults.finalStats && (
                      <ul className="text-sm text-green-700 font-open-sans space-y-1">
                        <li>• {seedingResults.finalStats.discussionsCreated} discussions created</li>
                        <li>• {seedingResults.finalStats.usersCreated} user personas activated</li>
                        <li>• {seedingResults.finalStats.repliesCreated} replies generated</li>
                        <li>• {seedingResults.finalStats.votesDistributed} votes distributed</li>
                      </ul>
                    )}
                    {seedingResults.scrapedPosts && (
                      <p className="text-sm text-green-700 font-open-sans">
                        • {seedingResults.scrapedPosts} posts scraped from Reddit
                      </p>
                    )}
                    {seedingResults.processedDiscussions && (
                      <ul className="text-sm text-green-700 font-open-sans space-y-1">
                        <li>• {seedingResults.processedDiscussions} discussions processed by AI</li>
                        <li>• {seedingResults.totalReplies || seedingResults.estimatedReplies || 0} replies generated</li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="font-space-grotesk font-semibold text-red-800 mb-2">
                      ❌ Process Failed
                    </h3>
                    <p className="text-sm text-red-700 font-open-sans">{seedingResults.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Input & AI Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ContentInputForm
            pastedContent={pastedContent}
            onContentChange={setPastedContent}
          />
          
          <AIConfigurationForm
            aiProvider={aiProvider}
            aiModel={aiModel}
            aiApiKey={aiApiKey}
            temperature={temperature}
            onProviderChange={handleProviderChange}
            onModelChange={setAiModel}
            onApiKeyChange={handleApiKeyChange}
            onTemperatureChange={handleTemperatureChange}
          />
        </div>

        <GenerationSettings
          discussionsToGenerate={discussionsToGenerate}
          repliesPerDiscussion={repliesPerDiscussion}
          maxNestingDepth={maxNestingDepth}
          contentVariation={contentVariation}
          onDiscussionsChange={setDiscussionsToGenerate}
          onMinRepliesChange={(value) => setRepliesPerDiscussion(prev => ({...prev, min: value}))}
          onMaxRepliesChange={(value) => setRepliesPerDiscussion(prev => ({...prev, max: value}))}
          onMaxNestingChange={setMaxNestingDepth}
          onContentVariationChange={setContentVariation}
        />

        <UserPersonaManager
          selectedUsers={selectedUsers}
          personasExpanded={personasExpanded}
          editingUser={editingUser}
          onToggleUserSelection={toggleUserSelection}
          onToggleExpanded={() => setPersonasExpanded(!personasExpanded)}
          onEditUser={setEditingUser}
        />

        <PreviewContentDisplay
          previewContent={previewContent}
          selectedMoodForIndex={selectedMoodForIndex}
          generatingReplyForIndex={generatingReplyForIndex}
          expandedReplies={expandedReplies}
          aiApiKey={aiApiKey}
          onAddReply={handleAddReplyWrapper}
          onDeleteReply={handleDeleteReply}
          onMoodSelect={(index, mood) => setSelectedMoodForIndex(prev => ({ ...prev, [index]: mood }))}
          onToggleExpandReplies={(index) => setExpandedReplies(prev => ({ ...prev, [index]: !prev[index] }))}
        />

        {/* Documentation Link */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800 font-open-sans">
            📄 For detailed technical specifications, see{' '}
            <code className="bg-blue-100 px-1 rounded">DISCUSSIONS_SEEDING_PLAN.md</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeedingTab;
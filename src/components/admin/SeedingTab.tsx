"use client";

import React, { useState, useEffect } from 'react';
import DiscussionContent from '@/components/discussions/DiscussionContent';
import { DiscussionTemp } from '@/types/threads';
import { SEED_PERSONA_TEMPLATES, getPersonaDistribution } from '@/data/seedPersonas';

interface SeedingTabProps {
  isLoading?: boolean;
}

// Reddit subreddit options for content scraping
const REDDIT_SOURCES = [
  { id: 'astrology', name: '/r/astrology', description: 'Main astrology discussions' },
  { id: 'askastrologers', name: '/r/AskAstrologers', description: 'Q&A format content' },
  { id: 'astrologymemes', name: '/r/astrologymemes', description: 'Lighter, casual content' },
  { id: 'psychic', name: '/r/Psychic', description: 'Spiritual discussions' },
  { id: 'tarot', name: '/r/tarot', description: 'Divination discussions' }
];

// AI provider options
const AI_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'] },
  { id: 'claude', name: 'Claude', models: ['claude-3-haiku', 'claude-3-sonnet'] },
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-pro', 'gemini-pro-vision'] },
  { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-r1-distill-llama-70b'] }
];

const SeedingTab: React.FC<SeedingTabProps> = ({ isLoading = false }) => {
  // AI Configuration State
  const [aiProvider, setAiProvider] = useState('deepseek');
  const [aiModel, setAiModel] = useState('deepseek-r1-distill-llama-70b');
  const [aiApiKey, setAiApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('seeding_ai_api_key');
    const savedProvider = localStorage.getItem('seeding_ai_provider');
    const savedTemperature = localStorage.getItem('seeding_ai_temperature');
    
    if (savedApiKey) {
      setAiApiKey(savedApiKey);
    }
    if (savedProvider && AI_PROVIDERS.find(p => p.id === savedProvider)) {
      setAiProvider(savedProvider);
      // Set default model for the saved provider
      const provider = AI_PROVIDERS.find(p => p.id === savedProvider);
      if (provider) {
        setAiModel(provider.models[0]);
      }
    }
    if (savedTemperature) {
      setTemperature(parseFloat(savedTemperature));
    }
  }, []);

  // Save settings to localStorage when they change
  const handleApiKeyChange = (newApiKey: string) => {
    setAiApiKey(newApiKey);
    if (newApiKey.trim()) {
      localStorage.setItem('seeding_ai_api_key', newApiKey);
    } else {
      localStorage.removeItem('seeding_ai_api_key');
    }
  };

  const handleProviderChange = (newProvider: string) => {
    setAiProvider(newProvider);
    localStorage.setItem('seeding_ai_provider', newProvider);
    
    // Set default model for the new provider
    const provider = AI_PROVIDERS.find(p => p.id === newProvider);
    if (provider) {
      setAiModel(provider.models[0]);
    }
  };

  const handleTemperatureChange = (newTemperature: number) => {
    setTemperature(newTemperature);
    localStorage.setItem('seeding_ai_temperature', newTemperature.toString());
  };

  // Seed Users State
  const [seedUsersInitialized, setSeedUsersInitialized] = useState(false);
  const [seedUsersStatus, setSeedUsersStatus] = useState<any>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  // Content Source State
  const [pastedContent, setPastedContent] = useState('');
  const [contentSource, setContentSource] = useState('reddit_paste'); // 'reddit_paste' or 'custom_text'

  // Generation Settings State
  const [discussionsToGenerate, setDiscussionsToGenerate] = useState(10);
  const [repliesPerDiscussion, setRepliesPerDiscussion] = useState({ min: 5, max: 25 });
  const [maxNestingDepth, setMaxNestingDepth] = useState(4);
  const [contentVariation, setContentVariation] = useState(70);

  // User Management State
  const [selectedUsers, setSelectedUsers] = useState<string[]>(SEED_PERSONA_TEMPLATES.map(u => u.id));
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [personasExpanded, setPersonasExpanded] = useState(false);

  // Process State
  const [seedingInProgress, setSeedingInProgress] = useState(false);
  const [seedingProgress, setSeedingProgress] = useState(0);
  const [seedingResults, setSeedingResults] = useState<any>(null);
  const [scrapedContent, setScrapedContent] = useState<any[]>([]);
  const [previewContent, setPreviewContent] = useState<any[]>([]);
  
  // Reply Generation State
  const [generatingReplyForIndex, setGeneratingReplyForIndex] = useState<number | null>(null);
  const [selectedMoodForIndex, setSelectedMoodForIndex] = useState<Record<number, string>>({});

  // Initialize seed users on component mount
  useEffect(() => {
    checkSeedUsersStatus();
  }, []);

  const checkSeedUsersStatus = async () => {
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
  };

  const initializeSeedUsers = async () => {
    try {
      const response = await fetch('/api/admin/seed-users/bulk-create', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setSeedUsersInitialized(true);
        setSeedingResults({
          success: true,
          message: `Successfully created ${result.created.users} seed users with configurations`
        });
        await checkSeedUsersStatus();
      } else {
        setSeedingResults({
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      setSeedingResults({
        success: false,
        error: 'Failed to initialize seed users: ' + (error as Error).message
      });
    }
  };

  const handleProcessPastedContent = async () => {
    if (!pastedContent.trim()) {
      setSeedingResults({
        success: false,
        error: 'Please paste some Reddit content first.'
      });
      return;
    }

    console.log('Frontend: Sending content length:', pastedContent.length);
    console.log('Frontend: First 200 chars:', pastedContent.substring(0, 200));

    setSeedingInProgress(true);
    setSeedingProgress(10);

    try {
      const response = await fetch('/api/admin/process-pasted-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: pastedContent,
          settings: {
            discussionsToGenerate
          }
        }),
      });

      const result = await response.json();
      setSeedingProgress(50);

      if (result.success) {
        setScrapedContent(result.data);
        setSeedingResults({ 
          success: true, 
          message: result.message,
          scrapedPosts: result.data.length,
          summary: result.summary
        });
      } else {
        setSeedingResults({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      setSeedingResults({
        success: false,
        error: 'Failed to parse pasted content: ' + (error as Error).message
      });
    } finally {
      setSeedingInProgress(false);
      setSeedingProgress(0);
    }
  };

  const handleProcessWithAI = async () => {
    if (scrapedContent.length === 0) {
      setSeedingResults({
        success: false,
        error: 'No content available. Please process pasted content first.'
      });
      return;
    }

    if (!aiApiKey.trim()) {
      setSeedingResults({
        success: false,
        error: 'AI API key is required for transformation.'
      });
      return;
    }

    setSeedingInProgress(true);
    setSeedingProgress(60);

    try {
      setSeedingProgress(65);
      const response = await fetch('/api/admin/transform-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parsedContent: scrapedContent,
          aiConfig: {
            provider: aiProvider,
            model: aiModel,
            apiKey: aiApiKey,
            temperature
          },
          generationSettings: {
            discussionsToGenerate,
            repliesPerDiscussion,
            maxNestingDepth,
            contentVariation
          }
        }),
      });

      setSeedingProgress(80);
      const result = await response.json();
      setSeedingProgress(100);

      if (result.success) {
        setPreviewContent(result.data);
        setExpandedReplies({}); // Clear expanded state for new content
        setSeedingResults({
          success: true,
          message: result.message,
          processedDiscussions: result.data.length,
          totalReplies: result.summary.totalReplies,
          batchId: result.batchId,
          summary: result.summary
        });
        
        // Auto-scroll to the AI processed content section
        setTimeout(() => {
          const previewSection = document.getElementById('ai-processed-content');
          if (previewSection) {
            previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        setSeedingResults({
          success: false,
          error: result.error || 'Failed to transform content with AI'
        });
      }

    } catch (error) {
      setSeedingResults({
        success: false,
        error: 'AI processing failed: ' + (error as Error).message
      });
    } finally {
      setSeedingInProgress(false);
    }
  };

  const handleExecuteSeeding = async () => {
    if (previewContent.length === 0) {
      setSeedingResults({
        success: false,
        error: 'No processed content available. Please process content with AI first.'
      });
      return;
    }

    if (!seedingResults?.batchId) {
      setSeedingResults({
        success: false,
        error: 'No batch ID available. Please process content with AI first.'
      });
      return;
    }

    setSeedingInProgress(true);
    setSeedingProgress(0);

    try {
      const response = await fetch('/api/admin/execute-seeding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchId: seedingResults.batchId,
          transformedContent: previewContent,
          generationSettings: {
            discussionsToGenerate,
            repliesPerDiscussion,
            maxNestingDepth,
            contentVariation
          }
        }),
      });

      const result = await response.json();
      setSeedingProgress(100);

      if (result.success) {
        setSeedingResults({
          success: true,
          message: result.message,
          finalStats: {
            discussionsCreated: result.results.discussionsCreated,
            usersCreated: selectedUsers.length,
            repliesCreated: result.results.repliesCreated,
            votesDistributed: result.results.votesCreated,
            errors: result.results.errors
          },
          batchId: result.batchId
        });
      } else {
        setSeedingResults({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      setSeedingResults({
        success: false,
        error: 'Seeding execution failed: ' + (error as Error).message
      });
    } finally {
      setSeedingInProgress(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleClearContent = () => {
    setPastedContent('');
    setScrapedContent([]);
    setPreviewContent([]);
    setSeedingResults(null);
  };

  // Define mood options with emojis
  const MOOD_OPTIONS = [
    { emoji: '😊', name: 'supportive', description: 'Positive & encouraging' },
    { emoji: '🤔', name: 'questioning', description: 'Curious & analytical' },
    { emoji: '😍', name: 'excited', description: 'Enthusiastic & energetic' },
    { emoji: '😌', name: 'wise', description: 'Calm & insightful' },
    { emoji: '😕', name: 'concerned', description: 'Worried or cautious' },
    { emoji: '🤗', name: 'empathetic', description: 'Understanding & caring' }
  ];

  const handleAddReply = async (discussionIndex: number) => {
    if (!aiApiKey.trim()) {
      setSeedingResults({
        success: false,
        error: 'AI API key is required for generating replies.'
      });
      return;
    }

    // Prevent multiple simultaneous requests
    if (generatingReplyForIndex !== null) {
      return;
    }

    setGeneratingReplyForIndex(discussionIndex);

    try {
      const discussionData = previewContent[discussionIndex];
      const currentReplyCount = discussionData.replies ? discussionData.replies.length : 0;

      const response = await fetch('/api/admin/generate-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          discussionData,
          aiConfig: {
            provider: aiProvider,
            model: aiModel,
            apiKey: aiApiKey,
            temperature
          },
          replyIndex: currentReplyCount,
          selectedMood: selectedMoodForIndex[discussionIndex] || 'supportive'
        }),
      });

      const result = await response.json();

      if (result.success) {
        const discussionData = previewContent[discussionIndex];
        const existingReplies = discussionData.replies || [];
        
        // Check for duplicate users (same user can't reply twice)
        const isDuplicateUser = existingReplies.some(reply => 
          reply.authorName === result.data.authorName
        );
        
        // Check for similar content (prevent very similar replies)
        const isDuplicateContent = existingReplies.some(reply => {
          const similarity = calculateSimilarity(reply.content || '', result.data.content || '');
          return similarity > 0.7; // 70% similarity threshold
        });
        
        if (isDuplicateUser) {
          setSeedingResults({
            success: false,
            error: `${result.data.authorName} has already replied to this discussion. Try generating again for a different user.`,
            lastAction: 'duplicate_user_prevented'
          });
          return;
        }
        
        if (isDuplicateContent) {
          setSeedingResults({
            success: false,
            error: `Very similar reply already exists. Try generating again for more variety.`,
            lastAction: 'duplicate_content_prevented'
          });
          return;
        }

        // Generate random timestamp between 1 hour and 7 days after discussion creation
        const discussionCreatedAt = new Date();
        const minDelayHours = 1;
        const maxDelayHours = 7 * 24; // 7 days
        const randomDelayHours = minDelayHours + Math.random() * (maxDelayHours - minDelayHours);
        const replyCreatedAt = new Date(discussionCreatedAt.getTime() + (randomDelayHours * 60 * 60 * 1000));

        // Add random timing to the reply data
        const replyWithTiming = {
          ...result.data,
          createdAt: replyCreatedAt.toISOString(),
          scheduledDelay: Math.round(randomDelayHours * 60), // minutes for display
          isTemporary: true // Mark as temporary until final generation
        };

        // Update the preview content with the new reply
        setPreviewContent(prev => prev.map((item, index) => {
          if (index === discussionIndex) {
            const updatedItem = { ...item };
            if (!updatedItem.replies) {
              updatedItem.replies = [];
            }
            
            // Double-check for duplicates before adding (extra safety)
            const isAlreadyAdded = updatedItem.replies.some(existingReply => 
              existingReply.id === replyWithTiming.id || 
              (existingReply.authorName === replyWithTiming.authorName && existingReply.content === replyWithTiming.content)
            );
            
            if (!isAlreadyAdded) {
              // Create new array instead of mutating existing one
              updatedItem.replies = [...updatedItem.replies, replyWithTiming];
              updatedItem.actualReplyCount = updatedItem.replies.length;
            }
            return updatedItem;
          }
          return item;
        }));

        setSeedingResults({
          success: true,
          message: `Successfully added reply by ${result.data.authorName} (scheduled ${Math.round(randomDelayHours)} hours after discussion)`,
          lastAction: 'reply_added'
        });
      } else {
        // Handle specific error cases
        let errorMessage = result.error || 'Failed to generate reply';
        
        if (errorMessage.includes('All available users have already replied')) {
          errorMessage = 'All 5 seed users have already replied! Delete some replies above to add more, or proceed to "Generate Forum" to save this discussion.';
        }
        
        setSeedingResults({
          success: false,
          error: errorMessage
        });
      }
    } catch (error) {
      setSeedingResults({
        success: false,
        error: 'Failed to generate reply: ' + (error as Error).message
      });
    } finally {
      setGeneratingReplyForIndex(null);
    }
  };

  const handleDeleteReply = (discussionIndex: number, replyIndex: number) => {
    setPreviewContent(prev => prev.map((item, index) => {
      if (index === discussionIndex) {
        const updatedItem = { ...item };
        if (updatedItem.replies) {
          // Create a new array instead of mutating the existing one
          const newReplies = [...updatedItem.replies];
          newReplies.splice(replyIndex, 1);
          updatedItem.replies = newReplies;
          updatedItem.actualReplyCount = newReplies.length;
        }
        return updatedItem;
      }
      return item;
    }));

    setSeedingResults({
      success: true,
      message: 'Reply removed from preview',
      lastAction: 'reply_deleted'
    });
  };

  const handleDeleteReplyById = (discussionIndex: number, replyId: string) => {
    setPreviewContent(prev => prev.map((item, index) => {
      if (index === discussionIndex) {
        const updatedItem = { ...item };
        if (updatedItem.replies) {
          // Filter out the reply with the specific ID
          const newReplies = updatedItem.replies.filter(reply => reply.id !== replyId);
          updatedItem.replies = newReplies;
          updatedItem.actualReplyCount = newReplies.length;
        }
        return updatedItem;
      }
      return item;
    }));

    setSeedingResults({
      success: true,
      message: 'Reply removed from preview',
      lastAction: 'reply_deleted'
    });
  };

  // Simple similarity calculation function
  const calculateSimilarity = (text1: string, text2: string): number => {
    if (!text1 || !text2) return 0;
    
    // Convert to lowercase and split into words
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    // Find common words
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  };

  const getSelectedAiProvider = () => AI_PROVIDERS.find(p => p.id === aiProvider);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-black p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">1</div>
              <h3 className="font-space-grotesk font-semibold">Paste Content</h3>
            </div>
            <p className="text-sm text-gray-600 font-open-sans">Copy and paste Reddit discussions or any content</p>
          </div>
          <div className="bg-white border border-black p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-3">2</div>
              <h3 className="font-space-grotesk font-semibold">AI Transform</h3>
            </div>
            <p className="text-sm text-gray-600 font-open-sans">AI rephrases, reformats, and makes content unique</p>
          </div>
          <div className="bg-white border border-black p-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mr-3">3</div>
              <h3 className="font-space-grotesk font-semibold">Generate Forum</h3>
            </div>
            <p className="text-sm text-gray-600 font-open-sans">Create discussions with replies and voting patterns</p>
          </div>
        </div>

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
                onClick={initializeSeedUsers}
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
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleProcessPastedContent}
                disabled={seedingInProgress || !pastedContent.trim() || !seedUsersInitialized}
                className="px-6 py-3 bg-blue-600 text-white font-space-grotesk font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {seedingInProgress && seedingProgress < 60 ? 'Processing Content...' : 'Process Pasted Content'}
              </button>
              
              <button
                onClick={handleProcessWithAI}
                disabled={seedingInProgress || scrapedContent.length === 0 || !aiApiKey || !seedUsersInitialized}
                className="px-6 py-3 bg-green-600 text-white font-space-grotesk font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {seedingInProgress && seedingProgress >= 60 ? 'AI Transforming...' : 'Transform with AI'}
              </button>
              
              <button
                onClick={handleExecuteSeeding}
                disabled={seedingInProgress || previewContent.length === 0 || !seedUsersInitialized}
                className="px-6 py-3 bg-purple-600 text-white font-space-grotesk font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {seedingInProgress && previewContent.length > 0 ? 'Creating Forum...' : 'Generate Forum'}
              </button>

              <button
                onClick={handleClearContent}
                disabled={seedingInProgress}
                className="px-6 py-3 bg-gray-600 text-white font-space-grotesk font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Clear All
              </button>
            </div>

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
          {/* Content Input */}
          <div className="bg-white border border-black">
            <div className="p-4 border-b border-black bg-blue-200">
              <h2 className="font-space-grotesk font-semibold text-black">
                Paste Reddit Content
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-space-grotesk font-semibold mb-2">
                    Content Input
                  </label>
                  <textarea
                    value={pastedContent}
                    onChange={(e) => setPastedContent(e.target.value)}
                    placeholder="Paste Reddit discussions or any content here...

Example:
Understanding Saturn Return

I'm 28 and hearing about Saturn return everywhere. Can someone explain what this means? I've been going through major life changes lately...

[More content can be pasted here]"
                    className="w-full h-64 p-3 border border-black font-open-sans text-sm resize-none"
                  />
                </div>
                <div className="text-sm text-gray-600 font-open-sans">
                  <p className="mb-2"><strong>Tips:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Paste entire Reddit threads or individual posts</li>
                    <li>Separate multiple discussions with double line breaks</li>
                    <li>Include titles, content, and comments if available</li>
                    <li>AI will automatically reorganize and rephrase</li>
                  </ul>
                </div>
                <div className="text-xs text-gray-500 font-open-sans">
                  Character count: {pastedContent.length}
                </div>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="bg-white border border-black">
            <div className="p-4 border-b border-black bg-purple-200">
              <h2 className="font-space-grotesk font-semibold text-black">
                AI Configuration
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-space-grotesk font-semibold mb-2">AI Provider</label>
                <select
                  value={aiProvider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full p-2 border border-black font-open-sans"
                >
                  {AI_PROVIDERS.map(provider => (
                    <option key={provider.id} value={provider.id}>{provider.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-space-grotesk font-semibold mb-2">Model</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full p-2 border border-black font-open-sans"
                >
                  {getSelectedAiProvider()?.models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-space-grotesk font-semibold mb-2">API Key</label>
                <input
                  type="password"
                  value={aiApiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your AI API key..."
                  className="w-full p-2 border border-black font-open-sans"
                />
                {!aiApiKey ? (
                  <p className="text-xs text-red-600 mt-1 font-open-sans">
                    API key required for AI transformation
                  </p>
                ) : (
                  <p className="text-xs text-green-600 mt-1 font-open-sans">
                    ✓ API key saved (will persist across sessions)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-space-grotesk font-semibold mb-2">
                  Creativity Level: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 border border-gray-300">
                <h4 className="text-sm font-space-grotesk font-semibold mb-2">AI Will:</h4>
                <ul className="text-xs text-gray-600 font-open-sans space-y-1">
                  <li>• Rephrase content to make it unique</li>
                  <li>• Reorganize thoughts for better flow</li>
                  <li>• Assign content to user personas</li>
                  <li>• Generate relevant categories and tags</li>
                  <li>• Create natural discussion threading</li>
                </ul>
                {aiProvider === 'deepseek' && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs text-blue-800 font-open-sans">
                      <strong>DeepSeek R1 Distill Llama 70B:</strong> Free tier available via OpenRouter. 
                      Get your API key at <span className="font-mono">openrouter.ai</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generation Settings */}
        <div className="bg-white border border-black mb-8">
          <div className="p-4 border-b border-black bg-green-200">
            <h2 className="font-space-grotesk font-semibold text-black">
              Generation Settings
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-space-grotesk font-semibold mb-2">Discussions</label>
                <input
                  type="number"
                  value={discussionsToGenerate}
                  onChange={(e) => setDiscussionsToGenerate(parseInt(e.target.value))}
                  className="w-full p-2 border border-black font-open-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-space-grotesk font-semibold mb-2">Min Replies</label>
                <input
                  type="number"
                  value={repliesPerDiscussion.min}
                  onChange={(e) => setRepliesPerDiscussion(prev => ({...prev, min: parseInt(e.target.value)}))}
                  className="w-full p-2 border border-black font-open-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-space-grotesk font-semibold mb-2">Max Replies</label>
                <input
                  type="number"
                  value={repliesPerDiscussion.max}
                  onChange={(e) => setRepliesPerDiscussion(prev => ({...prev, max: parseInt(e.target.value)}))}
                  className="w-full p-2 border border-black font-open-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-space-grotesk font-semibold mb-2">Max Nesting</label>
                <input
                  type="number"
                  value={maxNestingDepth}
                  onChange={(e) => setMaxNestingDepth(parseInt(e.target.value))}
                  className="w-full p-2 border border-black font-open-sans"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-space-grotesk font-semibold mb-2">
                Content Variation: {contentVariation}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={contentVariation}
                onChange={(e) => setContentVariation(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white border border-black mb-8">
          <div className="p-4 border-b border-black bg-yellow-200">
            <div className="flex items-center justify-between">
              <h2 className="font-space-grotesk font-semibold text-black">
                User Personas ({selectedUsers.length}/{SEED_PERSONA_TEMPLATES.length})
              </h2>
              <button
                onClick={() => setPersonasExpanded(!personasExpanded)}
                className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm font-semibold hover:bg-yellow-700 transition-colors"
              >
                {personasExpanded ? (
                  <>
                    <span>Hide Personas</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Show Personas</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            {!personasExpanded && (
              <div className="mt-2 text-sm text-gray-700">
                <div className="flex items-center gap-4">
                  <span>Selected: {selectedUsers.length} users</span>
                  <span>•</span>
                  <span>3 Experts, 5 Intermediate, 12 Beginners</span>
                </div>
              </div>
            )}
          </div>
          {personasExpanded && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SEED_PERSONA_TEMPLATES.map(user => (
                  <div key={user.id} className="border border-gray-300 p-3">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-space-grotesk font-semibold">{user.username}</span>
                          <span className={`px-2 py-1 text-xs font-open-sans font-semibold ${
                            user.subscriptionTier === 'premium' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.subscriptionTier}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 font-open-sans mb-2">{user.description}</p>
                        <div className="text-xs text-gray-500 font-open-sans space-y-1">
                          <div>Style: {user.writingStyle}</div>
                          <div>Reply Rate: {(user.replyProbability * 100).toFixed(0)}%</div>
                          <div>Expertise: {user.expertiseAreas.join(', ')}</div>
                        </div>
                        <button
                          onClick={() => setEditingUser(user.id)}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-open-sans"
                        >
                          Edit Persona
                        </button>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Preview */}
        {previewContent.length > 0 && (
          <div id="ai-processed-content" className="bg-white border border-black mb-8">
            <div className="p-4 border-b border-black bg-pink-200">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-space-grotesk font-semibold text-black">
                  AI-Processed Content Preview
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-black font-medium">PREVIEW MODE</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-300 rounded">
                <div className="flex items-start gap-2 text-sm text-yellow-800">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold">This is a temporary workspace</div>
                    <div className="mt-1">• Add/remove replies as needed • Replies scheduled with random delays (1h-7d) • Click "Generate Forum" to save to database</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-6">
              {previewContent.map((item, index) => {
                // Convert preview item to DiscussionTemp format for proper rendering
                const discussionForPreview: DiscussionTemp = {
                  id: `preview_${index}`,
                  title: item.transformedTitle,
                  excerpt: item.summary || item.transformedContent.substring(0, 200) + '...',
                  content: item.transformedContent,
                  author: item.assignedAuthor,
                  authorId: item.assignedAuthorId || 'unknown',
                  avatar: '/avatars/default.png',
                  category: item.category,
                  replies: item.actualReplyCount || 0,
                  views: Math.floor(Math.random() * 500) + 50, // Mock views for preview
                  lastActivity: new Date().toISOString(),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  isLocked: false,
                  isPinned: false,
                  tags: item.tags || [],
                  upvotes: Math.floor(Math.random() * 50) + 10,
                  downvotes: Math.floor(Math.random() * 5),
                  userVote: null,
                  isBlogPost: false
                };

                return (
                  <div key={index} className="border border-gray-300 bg-white">
                    {/* Preview Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">AI Generated</span>
                        <span className="text-xs text-gray-600">Original: {item.originalLength || 0} chars → Transformed: {item.contentLength || 0} chars</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.assignedAuthor} • {item.category} • {item.actualReplyCount || 0} replies
                      </div>
                    </div>

                    {/* Use DiscussionContent component for proper formatting */}
                    <DiscussionContent discussion={discussionForPreview} />
                    
                    {/* Add Reply Section with Mood Selection */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-gray-600">
                          <strong>Preview:</strong> This is how the discussion will appear on the forum
                        </div>
                        <button
                          onClick={() => handleAddReply(index)}
                          disabled={generatingReplyForIndex === index || !aiApiKey.trim()}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm px-4 py-2 rounded font-semibold transition-colors duration-200 flex items-center gap-2"
                        >
                          {generatingReplyForIndex === index ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                              Generating Reply...
                            </>
                          ) : (
                            <>
                              <span>+</span>
                              Add AI Reply
                            </>
                          )}
                        </button>
                      </div>
                      
                      {/* Mood Selection Tabs */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 font-semibold mr-2">Reply Mood:</span>
                        <div className="flex gap-1">
                          {MOOD_OPTIONS.map((mood) => (
                            <button
                              key={mood.name}
                              onClick={() => setSelectedMoodForIndex(prev => ({ ...prev, [index]: mood.name }))}
                              className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                                selectedMoodForIndex[index] === mood.name || (!selectedMoodForIndex[index] && mood.name === 'supportive')
                                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                              }`}
                              title={mood.description}
                            >
                              <span className="text-base">{mood.emoji}</span>
                              <span className="font-medium capitalize">{mood.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Display AI-generated replies */}
                    {item.replies && item.replies.length > 0 && (
                      <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-space-grotesk font-semibold text-sm text-blue-800">Generated Replies ({item.replies.length}):</h4>
                          {item.replies.length > 3 && (
                            <button
                              onClick={() => setExpandedReplies(prev => ({ ...prev, [index]: !prev[index] }))}
                              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              {expandedReplies[index] ? 'Show Less' : 'Show All'}
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {(expandedReplies[index] ? item.replies : item.replies.slice(0, 3)).map((reply, replyIdx) => {
                            const scheduledHours = reply.scheduledDelay ? Math.round(reply.scheduledDelay / 60) : 0;
                            const scheduledDate = reply.createdAt ? new Date(reply.createdAt) : new Date();
                            
                            // Ensure absolutely unique key by combining multiple identifiers
                            const uniqueKey = `${index}-${replyIdx}-${reply.id || Date.now()}-${reply.authorName || 'unknown'}`;
                            
                            return (
                              <div key={uniqueKey} className="bg-white p-4 rounded border border-blue-200 relative">
                                {/* Delete Button */}
                                <button
                                  onClick={() => handleDeleteReplyById(index, reply.id)}
                                  className="absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                                  title="Delete this reply"
                                >
                                  ×
                                </button>
                                
                                <div className="flex items-start gap-3 pr-8">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                                    {reply.authorName ? reply.authorName.charAt(0) : 'A'}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold text-blue-800 mb-1 text-sm">{reply.authorName}</div>
                                    <div className="text-gray-700 text-sm leading-relaxed">{reply.content}</div>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                      <span>↑ {reply.upvotes || 0}</span>
                                      <span>↓ {reply.downvotes || 0}</span>
                                      {reply.addingValue && <span className="italic">• {reply.addingValue}</span>}
                                      <span className="text-green-600">• AI Generated</span>
                                    </div>
                                    {/* Scheduling Information */}
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                      <div className="flex items-center gap-2 text-yellow-800">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span>
                                          <strong>Scheduled:</strong> {scheduledHours}h after discussion creation
                                        </span>
                                      </div>
                                      <div className="text-yellow-700 mt-1">
                                        Will be posted: {scheduledDate.toLocaleDateString()} at {scheduledDate.toLocaleTimeString()}
                                      </div>
                                      <div className="text-yellow-600 mt-1 italic">
                                        ⚠️ Preview only - not saved to database yet
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {!expandedReplies[index] && item.replies.length > 3 && (
                            <div className="text-xs text-blue-600 italic text-center py-2">
                              Click "Show All" to see {item.replies.length - 3} more replies...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
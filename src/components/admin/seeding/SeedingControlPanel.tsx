/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import SeedingActionButtons from './SeedingActionButtons';
import { SeedingControlPanelProps, SeedingResults } from '@/types/seeding';

export default function SeedingControlPanel({
  isControlPanelCollapsed,
  onToggleCollapsed,
  seedingInProgress,
  seedingProgress,
  seedingResults,
  pastedContent,
  scrapedContent,
  previewContent,
  aiApiKey,
  seedUsersInitialized,
  areConfigSectionsHidden,
  onProcessContent,
  onProcessWithAI,
  onExecuteSeeding,
  onClearAll,
  onToggleConfigSections
}: SeedingControlPanelProps) {
  return (
    <div className="bg-white border border-black mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <SeedingActionButtons
              seedingInProgress={seedingInProgress}
              seedingProgress={seedingProgress}
              pastedContent={pastedContent}
              scrapedContent={scrapedContent}
              previewContent={previewContent}
              aiApiKey={aiApiKey}
              seedUsersInitialized={seedUsersInitialized}
              areConfigSectionsHidden={areConfigSectionsHidden}
              onProcessContent={onProcessContent}
              onProcessWithAI={onProcessWithAI}
              onExecuteSeeding={onExecuteSeeding}
              onClearAll={onClearAll}
              onToggleConfigSections={onToggleConfigSections}
              className=""
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCollapsed}
              className="p-2 hover:bg-gray-100 transition-colors"
              title={isControlPanelCollapsed ? 'Show progress and results' : 'Hide progress and results'}
            >
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isControlPanelCollapsed ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {!isControlPanelCollapsed && (
          <div>
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
                    {seedingResults.fixedAvatars && (
                      <ul className="text-sm text-green-700 font-open-sans space-y-1">
                        <li>• {seedingResults.fixedCount} users had their avatar paths updated</li>
                        <li>• {seedingResults.totalUsers} total users checked</li>
                        {seedingResults.fixedUsers && seedingResults.fixedUsers.length > 0 && (
                          <li className="mt-2">
                            <details className="cursor-pointer">
                              <summary className="text-green-600 hover:text-green-800">View updated users</summary>
                              <div className="mt-2 ml-4 space-y-1">
                                {seedingResults.fixedUsers.slice(0, 10).map((user: any) => (
                                  <div key={user.id} className="text-xs">
                                    <strong>{user.username}</strong>: {user.oldAvatar} → {user.newAvatar}
                                  </div>
                                ))}
                                {seedingResults.fixedUsers.length > 10 && (
                                  <div className="text-xs text-green-600">
                                    ...and {seedingResults.fixedUsers.length - 10} more
                                  </div>
                                )}
                              </div>
                            </details>
                          </li>
                        )}
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
        )}
      </div>
    </div>
  );
}
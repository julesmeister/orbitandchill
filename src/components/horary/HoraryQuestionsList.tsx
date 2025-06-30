/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { HoraryQuestion } from "../../store/horaryStore";

interface HoraryQuestionsListProps {
  userQuestions: HoraryQuestion[];
  displayQuestions: HoraryQuestion[];
  userIsPremium: boolean;
  onQuestionClick: (question: HoraryQuestion) => void;
  onDeleteQuestion: (question: HoraryQuestion, event: React.MouseEvent) => void;
  itemsPerPage?: number;
}

export default function HoraryQuestionsList({
  userQuestions,
  displayQuestions,
  userIsPremium,
  onQuestionClick,
  onDeleteQuestion,
  itemsPerPage = 5
}: HoraryQuestionsListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Get current user ID from the questions to ensure consistency
  const currentUserId = userQuestions.find(q => q.userId)?.userId;
  
  // Extra safety filter: Only show questions that definitely belong to current user
  const safeDisplayQuestions = displayQuestions.filter(q => 
    !currentUserId || q.userId === currentUserId
  );

  if (safeDisplayQuestions.length !== displayQuestions.length) {
    console.warn(`⚠️ UI Safety filter: Removed ${displayQuestions.length - safeDisplayQuestions.length} inconsistent questions`);
  }

  // Pagination calculations
  const totalPages = Math.ceil(safeDisplayQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = safeDisplayQuestions.slice(startIndex, endIndex);

  return (
    <div className="lg:col-span-1">
      <div className="bg-white">
        {/* Header */}
        <div className="p-6 border-b border-black" style={{ backgroundColor: '#f2e356' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <span className="text-white text-lg">📜</span>
              </div>
              <div>
                <h3 className="font-space-grotesk text-xl font-bold text-black">Past Questions</h3>
                <div className="w-16 h-0.5 bg-black mt-1"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-black text-white px-3 py-1.5 font-space-grotesk font-bold text-sm">
                {safeDisplayQuestions.length}
              </div>
              {!userIsPremium && userQuestions.length > 10 && (
                <div className="text-xs text-black/60 font-inter">
                  (+{userQuestions.length - 10} more)
                </div>
              )}
            </div>
          </div>
          {!userIsPremium && userQuestions.length > 10 && (
            <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300">
              <p className="text-xs text-yellow-800 font-inter">
                Free users see last 10 questions. <span className="font-semibold">Upgrade for full history.</span>
              </p>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="min-h-[400px]">
          {userQuestions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🔮</span>
              </div>
              <h4 className="font-space-grotesk font-bold text-black text-lg mb-2">No Questions Yet</h4>
              <p className="text-black/60 font-inter">Ask your first horary question to begin</p>
            </div>
          ) : (
            <div className="divide-y divide-black">
              {paginatedQuestions.map((q, index) => (
                <div
                  key={q.id}
                  onClick={() => onQuestionClick(q)}
                  className="group p-4 hover:bg-gray-50 transition-all duration-300 cursor-pointer relative"
                >
                  {/* Hover accent bar */}
                  <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>

                  {/* Content with proper spacing */}
                  <div className="ml-2">
                    {/* Header with number and delete button */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-black flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-black/60">
                          <span className="font-inter">
                            {new Date(q.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <span className="font-inter">
                            {new Date(q.date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => onDeleteQuestion(q, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-xs text-black/40 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                        title="Delete question"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Question text */}
                    <p className="font-inter text-sm text-black mb-3 line-clamp-2 leading-relaxed">
                      "{q.question}"
                    </p>

                    {/* Answer and status - Mobile optimized layout */}
                    <div className="space-y-2">
                      {/* Answer badge row */}
                      <div className="flex items-center flex-wrap gap-2">
                        {q.answer ? (
                          <span className={`px-2 py-1 text-xs font-space-grotesk font-bold border border-black ${q.answer === 'Yes'
                            ? 'text-black border-black'
                            : q.answer === 'No'
                              ? 'text-black border-black'
                              : 'text-black border-black'
                            }`} style={{
                              backgroundColor: q.answer === 'Yes' ? '#4ade80' : q.answer === 'No' ? '#ff91e9' : '#f2e356'
                            }}>
                            {q.answer}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs text-black bg-white border border-black font-inter">
                            ⏳ Analyzing...
                          </span>
                        )}

                        {/* Status indicator inline */}
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${q.answer ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-xs text-black/50 font-inter">
                            {q.answer ? 'Done' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Timing row - full width for better readability */}
                      {q.timing && (
                        <div className="w-full">
                          <span className="inline-block px-2 py-1 text-xs text-black border border-black font-inter w-full truncate" style={{ backgroundColor: '#6bdbff' }}>
                            ⏰ {q.timing}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="border-t border-black p-4" style={{ backgroundColor: '#6bdbff' }}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-space-grotesk font-bold text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-black bg-white"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-10 h-10 text-sm font-space-grotesk font-bold transition-all border border-black ${currentPage === pageNumber
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-space-grotesk font-bold text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-black bg-white"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
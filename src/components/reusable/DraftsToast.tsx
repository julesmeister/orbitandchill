/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { stripHtmlTags } from '@/utils/textUtils';

interface Draft {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface DraftsToastProps {
  isVisible: boolean;
  onHide: () => void;
}

export default function DraftsToast({ isVisible, onHide }: DraftsToastProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      fetchDrafts();
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const fetchDrafts = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/discussions?drafts=true&userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        const transformedDrafts = data.discussions.map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt)
        }));
        setDrafts(transformedDrafts);
      } else {
        setError(data.error || 'Failed to fetch drafts');
      }
    } catch (err) {
      console.error('Error fetching drafts:', err);
      setError('Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      const response = await fetch(`/api/discussions/${draftId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setDrafts(drafts.filter(d => d.id !== draftId));
      } else {
        alert('Failed to delete draft');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Failed to delete draft');
    }
  };

  const editDraft = (draftId: string) => {
    router.push(`/discussions/new?edit=${draftId}`);
    onHide();
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      {/* Toast Container */}
      <div 
        className={`w-96 max-h-[500px] overflow-hidden bg-white border-2 border-black shadow-2xl pointer-events-auto transform transition-all duration-300 ease-out ${isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-4 opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-black p-4 sticky top-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-black font-space-grotesk">My Drafts</h3>
              <p className="text-xs text-black/70 font-open-sans">
                {loading ? 'Loading...' : `${drafts.length} draft${drafts.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            
            <button
              onClick={onHide}
              className="group relative p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              <span className="ml-2 text-sm text-black font-open-sans">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <div className="text-red-600 mb-3 text-sm font-open-sans">{error}</div>
              <button 
                onClick={fetchDrafts}
                className="px-3 py-2 bg-black text-white border border-black hover:bg-gray-800 transition-colors text-sm font-open-sans"
              >
                Retry
              </button>
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-4">
              <svg className="w-8 h-8 mx-auto text-black/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h4 className="font-space-grotesk text-sm font-bold text-black mb-2">
                No drafts yet
              </h4>
              <p className="text-black/70 mb-3 text-xs font-open-sans">
                Save a draft to see it here.
              </p>
              <button 
                onClick={() => {
                  router.push('/discussions/new');
                  onHide();
                }}
                className="inline-flex items-center gap-1 px-3 py-2 bg-black text-white font-medium border border-black transition-all duration-300 hover:bg-gray-800 text-xs font-open-sans"
              >
                Start Writing
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div key={draft.id} className="border border-black bg-white p-3">
                  <div className="mb-2">
                    <h4 className="font-space-grotesk text-sm font-bold text-black mb-1 line-clamp-1">
                      {draft.title || 'Untitled Draft'}
                    </h4>
                    <div className="text-xs text-black/60 mb-2 font-open-sans">
                      {draft.category}
                    </div>
                    {draft.excerpt && (
                      <p className="text-black/70 text-xs mb-2 line-clamp-2 font-open-sans">
                        {stripHtmlTags(draft.excerpt)}
                      </p>
                    )}
                    {draft.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {draft.tags.slice(0, 2).map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-1 py-0.5 bg-black text-white text-xs border border-black font-open-sans"
                          >
                            #{tag}
                          </span>
                        ))}
                        {draft.tags.length > 2 && (
                          <span className="text-xs text-black/60 font-open-sans">+{draft.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-0 border border-black overflow-hidden">
                    <button
                      onClick={() => editDraft(draft.id)}
                      className="group relative flex-1 px-2 py-1.5 bg-black text-white border-r border-black hover:bg-gray-800 transition-colors text-xs font-open-sans"
                    >
                      <div className="relative flex items-center justify-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </div>
                    </button>
                    <button
                      onClick={() => deleteDraft(draft.id)}
                      className="group relative flex-1 px-2 py-1.5 bg-white text-black hover:bg-black hover:text-white transition-colors text-xs font-open-sans"
                    >
                      <div className="relative flex items-center justify-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { getCategoryColor, getCategoryTextColor } from "../utils";

interface DiscussionDetailHeaderProps {
  discussion: any;
  user: any;
  isDeleting: boolean;
  onDeleteClick: () => void;
}

export default function DiscussionDetailHeader({
  discussion,
  user,
  isDeleting,
  onDeleteClick,
}: DiscussionDetailHeaderProps) {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/discussions"
            className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-open-sans whitespace-nowrap"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Back to Discussions</span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* Edit and Delete buttons for discussion author */}
          {user && discussion && user.id === discussion.authorId && (
            <>
              <Link
                href={`/discussions/new?edit=${discussion.id}`}
                className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 text-black border border-black hover:bg-blue-500 hover:text-white transition-all duration-300 font-open-sans whitespace-nowrap"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Edit</span>
              </Link>
              
              <button
                onClick={onDeleteClick}
                disabled={isDeleting}
                className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 text-white bg-red-600 border border-red-600 hover:bg-red-700 hover:border-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-open-sans whitespace-nowrap"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white sm:mr-2"></div>
                    <span className="hidden sm:inline">Deleting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">Delete</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
        
        <div className="w-full md:text-right">
          <div className="flex items-center gap-2 mb-2 md:justify-end">
            {Boolean(discussion.isPinned) && (
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 12V4a1 1 0 00-1-1H9a1 1 0 00-1 1v8H5.5a1 1 0 00-.8 1.6l6.5 8.67 6.5-8.67A1 1 0 0016.5 12H16z"/>
              </svg>
            )}
            {Boolean(discussion.isLocked) && (
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
              </svg>
            )}
            <span 
              className="px-3 py-1 text-xs font-medium border border-black font-open-sans"
              style={{ 
                backgroundColor: getCategoryColor(discussion.category),
                color: getCategoryTextColor(discussion.category)
              }}
            >
              {discussion.category}
            </span>
          </div>
          <h1 className="font-space-grotesk text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2 md:text-right md:max-w-md md:ml-auto">
            {discussion.title}
          </h1>
        </div>
      </div>
    </section>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { formatRelativeTime } from '@/utils/dateFormatting';

interface Thread {
  id: string;
  isBlogPost: boolean;
  isPublished: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PostsHeaderProps {
  threads: Thread[];
  onCategoryManagerToggle: () => void;
  onUncategorizedManagerToggle: () => void;
  onCreatePost: () => void;
}

export default function PostsHeader({
  threads,
  onCategoryManagerToggle,
  onUncategorizedManagerToggle,
  onCreatePost
}: PostsHeaderProps) {
  const blogPosts = threads.filter((t: Thread) => t.isBlogPost);
  const forumThreads = threads.filter((t: Thread) => !t.isBlogPost);
  const publishedCount = threads.filter((t: Thread) => t.isPublished).length;

  // Helper function for most recent thread calculation
  const getMostRecentActivity = () => {
    if (threads.length === 0) return null;
    const mostRecentThread = threads.reduce((latest, current) => 
      new Date(current.updatedAt || current.createdAt) > new Date(latest.updatedAt || latest.createdAt) ? current : latest
    );
    return formatRelativeTime(mostRecentThread.updatedAt || mostRecentThread.createdAt);
  };

  // Action buttons configuration
  const actionButtons = [
    {
      onClick: onCategoryManagerToggle,
      bgColor: 'bg-[#f2e356]',
      hoverColor: 'hover:bg-[#e8d650]',
      gradientColor: 'via-yellow-200/30',
      title: 'Manage Categories',
      icon: 'M19 11H5m14-7H5m14 14H5',
      fullText: 'Categories',
      shortText: 'Cat.'
    },
    {
      onClick: onUncategorizedManagerToggle,
      bgColor: 'bg-[#51bd94]',
      hoverColor: 'hover:bg-[#4aa384]',
      gradientColor: 'via-green-200/30',
      title: 'Manage Uncategorized Posts',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      fullText: 'Organize',
      shortText: 'Org.'
    },
    {
      onClick: onCreatePost,
      bgColor: 'bg-[#6bdbff]',
      hoverColor: 'hover:bg-[#5ac8ec]',
      gradientColor: 'via-blue-200/30',
      title: 'Create New Post',
      icon: 'M12 4v16m8-8H4',
      fullText: 'Create New Post',
      shortText: 'Create',
      extraPadding: true
    }
  ];

  // Statistics cards configuration
  const statsCards = [
    {
      value: blogPosts.length,
      label: 'Blog Posts',
      bgGradient: 'from-[#6bdbff]/20 to-[#6bdbff]/10',
      borderColor: 'border-[#6bdbff]/30',
      indicatorColor: 'bg-[#6bdbff]',
      iconColor: 'text-[#6bdbff]',
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
    },
    {
      value: forumThreads.length,
      label: 'Forum Threads',
      bgGradient: 'from-[#51bd94]/20 to-[#51bd94]/10',
      borderColor: 'border-[#51bd94]/30',
      indicatorColor: 'bg-[#51bd94]',
      iconColor: 'text-[#51bd94]',
      icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
    },
    {
      value: publishedCount,
      label: 'Published',
      bgGradient: 'from-[#ff91e9]/20 to-[#ff91e9]/10',
      borderColor: 'border-[#ff91e9]/30',
      indicatorColor: 'bg-[#ff91e9]',
      iconColor: 'text-[#ff91e9]',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      value: getMostRecentActivity() || '—',
      label: threads.length > 0 ? 'Last Activity' : 'No Activity',
      bgGradient: 'from-gray-100 to-gray-50',
      borderColor: 'border-gray-200',
      indicatorColor: 'bg-gray-400',
      iconColor: 'text-gray-400',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  ];

  return (
    <div className="bg-white border border-black">
      {/* Header Section */}
      <div className="p-3 lg:p-4 xl:p-3 border-b border-black">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 xl:gap-2">
          <div className="flex-1">
            <h2 className="text-xl lg:text-2xl xl:text-xl font-bold text-black mb-1 xl:mb-0.5 font-space-grotesk">
              Posts & Threads
            </h2>
            <p className="text-xs text-gray-600 font-open-sans xl:hidden lg:block">
              Manage content and categories
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 xl:gap-1.5">
            {actionButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`group relative ${button.bgColor} text-black px-3 ${button.extraPadding ? 'lg:px-4' : ''} xl:px-${button.extraPadding ? '3' : '2.5'} py-2 xl:py-1.5 text-sm xl:text-xs font-medium ${button.hoverColor} transition-all duration-200 font-open-sans border border-black overflow-hidden`}
                title={button.title}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${button.gradientColor} to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700`}></div>
                <div className="relative flex items-center space-x-1.5 xl:space-x-1">
                  <svg className="w-4 h-4 xl:w-3.5 xl:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={button.icon} />
                  </svg>
                  <span className="hidden sm:inline">{button.fullText}</span>
                  <span className="sm:hidden">{button.shortText}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="p-3 lg:p-4 xl:p-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 xl:gap-2">
          {statsCards.map((card, index) => (
            <div key={index} className={`bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} p-3 xl:p-2 rounded`}>
              <div className="flex items-center justify-between mb-1 xl:mb-0.5">
                <div className={`w-2 h-2 ${card.indicatorColor} rounded-full`}></div>
                <svg className={`w-4 h-4 xl:w-3 xl:h-3 ${card.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
              <div className="text-xl xl:text-lg font-bold text-black font-space-grotesk">
                {card.value}
              </div>
              <div className="text-xs text-gray-700 font-open-sans">{card.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react';
import { useVoting } from '@/hooks/useVoting';

// Configuration objects for better maintainability
const SIZE_CONFIG = {
  sm: {
    elementPadding: 'px-2 py-1',
    iconSize: 'w-3 h-3',
    textSize: 'text-xs',
    minWidth: 'min-w-[40px]'
  },
  md: {
    elementPadding: 'px-3 py-2',
    iconSize: 'w-4 h-4',
    textSize: 'text-sm',
    minWidth: 'min-w-[50px]'
  },
  lg: {
    elementPadding: 'px-4 py-3',
    iconSize: 'w-5 h-5',
    textSize: 'text-base',
    minWidth: 'min-w-[60px]'
  }
} as const;

const LAYOUT_CONFIG = {
  horizontal: 'flex items-stretch bg-white border border-black overflow-hidden',
  vertical: 'flex flex-col gap-2',
  compact: 'flex items-center gap-2'
} as const;

interface VoteButtonsProps {
  type?: 'discussion' | 'reply';
  id?: string;
  upvotes: number;
  downvotes?: number;
  userVote?: 'up' | 'down' | null;

  // Handlers
  onUpvote?: () => void;
  onDownvote?: () => void;
  onAuthRequired?: () => void;
  onVoteSuccess?: (upvotes: number, downvotes: number) => void;

  // Display options
  size?: keyof typeof SIZE_CONFIG;
  layout?: keyof typeof LAYOUT_CONFIG;
  showDownvote?: boolean;
  showCount?: boolean;
  countPosition?: 'center' | 'right' | 'below';

  // Behavior
  useHook?: boolean;
  className?: string;
}

const VoteButton = React.memo(({
  type,
  isUpvote,
  onClick,
  disabled,
  isActive,
  isLoading,
  layout,
  sizeConfig
}: {
  type: 'up' | 'down';
  isUpvote: boolean;
  onClick: () => void;
  disabled: boolean;
  isActive: boolean;
  isLoading: boolean;
  layout: keyof typeof LAYOUT_CONFIG;
  sizeConfig: typeof SIZE_CONFIG[keyof typeof SIZE_CONFIG];
}) => {
  const getButtonClasses = () => {
    const baseClasses = `relative flex items-center justify-center ${sizeConfig.elementPadding} transition-all duration-300 group active:scale-95`;
    const stateClasses = isActive ? 'bg-black text-white' : 'text-black hover:bg-black hover:text-white';
    const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : '';

    if (layout === 'horizontal') {
      const borderClass = isUpvote ? 'border-r border-black' : 'border-l border-black';
      return `${baseClasses} ${stateClasses} ${borderClass} ${disabledClasses}`;
    }

    return `${baseClasses} ${stateClasses} border border-black ${disabledClasses}`;
  };

  const icon = isUpvote
    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
      aria-label={isUpvote ? "Upvote" : "Downvote"}
      aria-pressed={isActive}
      aria-describedby={isLoading ? "vote-loading" : undefined}
      title={isUpvote ? "Upvote" : "Downvote"}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-1">
          <div className="w-1 h-1 bg-current animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 bg-current animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 bg-current animate-bounce"></div>
        </div>
      ) : (
        <svg
          className={`${sizeConfig.iconSize} transition-transform group-hover:scale-110`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {icon}
        </svg>
      )}
      {isLoading && (
        <span id="vote-loading" className="sr-only">
          Processing vote...
        </span>
      )}
    </button>
  );
});

VoteButton.displayName = 'VoteButton';

const VoteCount = React.memo(({
  count,
  sizeConfig,
  layout
}: {
  count: number;
  sizeConfig: typeof SIZE_CONFIG[keyof typeof SIZE_CONFIG];
  layout: keyof typeof LAYOUT_CONFIG;
}) => (
  <div className={`flex items-center justify-center ${sizeConfig.elementPadding} ${sizeConfig.textSize} font-semibold text-white bg-black font-open-sans ${sizeConfig.minWidth}`}>
    {count}
    {layout === 'compact' && <span className="ml-1">votes</span>}
  </div>
));

VoteCount.displayName = 'VoteCount';

export default function VoteButtons({
  type = 'discussion',
  id,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  userVote: initialUserVote,
  onUpvote: manualOnUpvote,
  onDownvote: manualOnDownvote,
  onAuthRequired,
  onVoteSuccess,
  size = 'md',
  layout = 'horizontal',
  showDownvote = true,
  showCount = true,
  countPosition = 'center',
  useHook = false,
  className = ''
}: VoteButtonsProps) {
  const [clickedButton, setClickedButton] = useState<'up' | 'down' | null>(null);

  // Get configuration objects
  const sizeConfig = SIZE_CONFIG[size];
  const containerClasses = LAYOUT_CONFIG[layout];

  // Use voting hook if enabled
  const votingHook = useVoting(
    type,
    id || '',
    initialUpvotes,
    initialDownvotes || 0,
    initialUserVote,
    {
      onVoteSuccess,
      onVoteError: (error) => {
        console.error('Vote error:', error);
        if (error.includes('logged in') && onAuthRequired) {
          onAuthRequired();
        }
      }
    }
  );

  // Determine values to use
  const upvotes = useHook && id ? votingHook.upvotes : initialUpvotes;
  const userVote = useHook && id ? votingHook.userVote : initialUserVote;
  const isVoting = useHook && id ? votingHook.isVoting : false;

  // Handle vote actions
  const handleUpvote = useCallback(() => {
    setClickedButton('up');
    if (useHook && id) {
      votingHook.handleUpvote();
    } else if (manualOnUpvote) {
      manualOnUpvote();
    }
  }, [useHook, id, votingHook, manualOnUpvote]);

  const handleDownvote = useCallback(() => {
    setClickedButton('down');
    if (useHook && id) {
      votingHook.handleDownvote();
    } else if (manualOnDownvote) {
      manualOnDownvote();
    }
  }, [useHook, id, votingHook, manualOnDownvote]);

  // Clear clicked state when voting completes
  useEffect(() => {
    if (!isVoting) {
      setClickedButton(null);
    }
  }, [isVoting]);

  // Render components
  const upvoteButton = (
    <VoteButton
      type="up"
      isUpvote={true}
      onClick={handleUpvote}
      disabled={!handleUpvote || isVoting}
      isActive={userVote === 'up'}
      isLoading={isVoting && clickedButton === 'up'}
      layout={layout}
      sizeConfig={sizeConfig}
    />
  );

  const downvoteButton = showDownvote ? (
    <VoteButton
      type="down"
      isUpvote={false}
      onClick={handleDownvote}
      disabled={!handleDownvote || isVoting}
      isActive={userVote === 'down'}
      isLoading={isVoting && clickedButton === 'down'}
      layout={layout}
      sizeConfig={sizeConfig}
    />
  ) : null;

  const voteCount = showCount ? (
    <VoteCount
      count={upvotes}
      sizeConfig={sizeConfig}
      layout={layout}
    />
  ) : null;

  // Layout-specific rendering
  const renderContent = () => {
    switch (layout) {
      case 'vertical':
        return (
          <>
            {upvoteButton}
            {showCount && countPosition === 'center' && voteCount}
            {downvoteButton}
            {showCount && countPosition === 'below' && voteCount}
          </>
        );

      case 'compact':
        return (
          <>
            {upvoteButton}
            {voteCount}
          </>
        );

      default: // horizontal
        return (
          <>
            {upvoteButton}
            {showCount && countPosition === 'center' && voteCount}
            {downvoteButton}
            {showCount && countPosition === 'right' && voteCount}
          </>
        );
    }
  };

  return (
    <div className={`${containerClasses} ${className} ${isVoting ? 'animate-pulse' : ''}`}>
      {renderContent()}
    </div>
  );
}
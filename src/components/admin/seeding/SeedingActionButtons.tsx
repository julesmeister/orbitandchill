/* eslint-disable @typescript-eslint/no-unused-vars */

interface SeedingActionButtonsProps {
  // State props
  seedingInProgress: boolean;
  seedingProgress: number;
  pastedContent: string;
  scrapedContent: any[];
  previewContent: any[];
  aiApiKey: string;
  seedUsersInitialized: boolean;
  
  // Action handlers
  onProcessContent: () => void;
  onProcessWithAI: () => void;
  onExecuteSeeding: () => void;
  onClearAll: () => void;
  
  // Optional styling
  className?: string;
}

interface ActionButton {
  onClick: () => void;
  disabled: boolean;
  className: string;
  children: React.ReactNode;
}

export default function SeedingActionButtons({
  seedingInProgress,
  seedingProgress,
  pastedContent,
  scrapedContent,
  previewContent,
  aiApiKey,
  seedUsersInitialized,
  onProcessContent,
  onProcessWithAI,
  onExecuteSeeding,
  onClearAll,
  className = ""
}: SeedingActionButtonsProps) {
  
  const baseButtonClass = "px-6 py-3 text-white font-space-grotesk font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors";
  
  const buttons: ActionButton[] = [
    {
      onClick: onProcessContent,
      disabled: seedingInProgress || !pastedContent.trim() || !seedUsersInitialized,
      className: `${baseButtonClass} bg-blue-600 hover:bg-blue-700`,
      children: seedingInProgress && seedingProgress < 60 ? 'Processing Content...' : 'Process Pasted Content'
    },
    {
      onClick: onProcessWithAI,
      disabled: seedingInProgress || scrapedContent.length === 0 || !aiApiKey || !seedUsersInitialized,
      className: `${baseButtonClass} bg-green-600 hover:bg-green-700`,
      children: seedingInProgress && seedingProgress >= 60 ? 'AI Transforming...' : 'Transform with AI'
    },
    {
      onClick: onExecuteSeeding,
      disabled: seedingInProgress || previewContent.length === 0 || !seedUsersInitialized,
      className: `${baseButtonClass} bg-purple-600 hover:bg-purple-700`,
      children: seedingInProgress && previewContent.length > 0 ? 'Creating Forum...' : 'Generate Forum'
    },
    {
      onClick: onClearAll,
      disabled: seedingInProgress,
      className: `${baseButtonClass} bg-gray-600 hover:bg-gray-700`,
      children: 'Clear All'
    }
  ];

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          disabled={button.disabled}
          className={button.className}
        >
          {button.children}
        </button>
      ))}
    </div>
  );
}
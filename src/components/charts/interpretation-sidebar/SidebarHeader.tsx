/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ReorderToggleButton } from '@/components/ui/ReorderToggleButton';
import { ResetIcon } from '@/components/icons/ResetIcon';
import { ChevronIcon } from '@/components/icons/ChevronIcon';

interface SidebarHeaderProps {
  isReorderMode: boolean;
  onReorderToggle: () => void;
  onReset: () => void;
  onToggleSidebar: () => void;
  isCollapsed: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isReorderMode,
  onReorderToggle,
  onReset,
  onToggleSidebar,
  isCollapsed
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-space-grotesk text-lg font-bold text-black">
          Interpretation Sections
        </h3>
        <div className="flex items-center gap-2">
          <ReorderToggleButton
            isReorderMode={isReorderMode}
            onToggle={onReorderToggle}
          />
          {isReorderMode && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border border-gray-300 bg-white text-black hover:bg-black hover:text-white transition-colors"
            >
              <ResetIcon />
              Reset
            </button>
          )}
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors border border-black"
            title={isCollapsed ? "Expand sections" : "Collapse sections"}
          >
            <ChevronIcon direction={isCollapsed ? 'left' : 'down'} />
          </button>
        </div>
      </div>

      {isReorderMode && (
        <p className="text-xs text-gray-600 mt-2">
          Drag sections to reorder them according to your preference
        </p>
      )}
    </div>
  );
};
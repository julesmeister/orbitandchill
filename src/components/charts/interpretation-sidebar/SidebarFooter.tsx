/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface SidebarFooterProps {
  visibleCount: number;
  totalCount: number;
  lockedCount: number;
  userIsPremium: boolean;
  features: any[];
  onCustomize: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  visibleCount,
  totalCount,
  lockedCount,
  userIsPremium,
  features,
  onCustomize
}) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <p className="text-xs text-gray-500 mb-2">
        {visibleCount} of {totalCount} sections visible
        {!userIsPremium && features.length > 0 && lockedCount > 0 && (
          <span className="text-yellow-600">
            {' '}({lockedCount} premium)
          </span>
        )}
      </p>
      <button
        onClick={onCustomize}
        className="text-xs text-black hover:text-gray-600 font-medium"
      >
        Customize section order →
      </button>
    </div>
  );
};
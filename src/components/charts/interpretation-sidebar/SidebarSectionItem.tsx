/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { InterpretationSection } from '@/store/chartStore';
import { DragHandleIcon } from '@/components/icons/DragHandleIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { VisibilityToggleButton } from '@/components/ui/VisibilityToggleButton';

interface SidebarSectionItemProps {
  section: InterpretationSection;
  index: number;
  isReorderMode: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  isAccessible: boolean;
  userIsPremium: boolean;
  features: any[];
  shouldShowFeature: (sectionId: string, isPremium: boolean) => boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  onToggleVisibility: (sectionId: string) => void;
}

export const SidebarSectionItem: React.FC<SidebarSectionItemProps> = ({
  section,
  index,
  isReorderMode,
  isDragging,
  isDragOver,
  isAccessible,
  userIsPremium,
  features,
  shouldShowFeature,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  onToggleVisibility
}) => {
  return (
    <div
      draggable={isReorderMode}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`
        relative p-3 border border-gray-200 bg-white transition-all duration-200 cursor-pointer
        ${isReorderMode ? 'cursor-move' : 'cursor-pointer'}
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isDragOver ? 'border-black bg-gray-50' : ''}
        ${!isAccessible ? 'opacity-60' : ''}
        ${isReorderMode ? 'hover:border-gray-400' : 'hover:border-black hover:bg-gray-50'}
      `}
    >
      <div className="flex items-center">
        {/* Drag Handle */}
        {isReorderMode && (
          <div className="w-5 h-5 flex items-center justify-center mr-3 text-gray-400">
            <DragHandleIcon />
          </div>
        )}

        {/* Section Info */}
        <div className="flex items-center flex-1">
          <span className="text-lg mr-3">{section.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-space-grotesk text-sm font-semibold text-black">
                {section.name}
              </h4>
              {section.isPremium && features.length > 0 && !shouldShowFeature(section.id, userIsPremium) && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 border border-yellow-300">
                  PRO
                </span>
              )}
              {!isAccessible && features.length > 0 && (
                <LockIcon className="w-3 h-3 text-gray-400" />
              )}
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              {section.description}
            </p>
          </div>
        </div>

        {/* Order Number */}
        {isReorderMode && (
          <div className="w-6 h-6 bg-gray-100 border border-gray-300 flex items-center justify-center ml-3">
            <span className="text-xs font-mono text-gray-600">
              {index + 1}
            </span>
          </div>
        )}

        {/* Visibility Toggle */}
        {!isReorderMode && (
          <div className="ml-3">
            <VisibilityToggleButton
              isVisible={section.isVisible}
              onToggle={(e) => {
                e.stopPropagation();
                onToggleVisibility(section.id);
              }}
            />
          </div>
        )}
      </div>

      {/* Drop Indicator */}
      {isDragOver && isReorderMode && (
        <div className="absolute inset-0 border-2 border-black bg-black/5 pointer-events-none" />
      )}
    </div>
  );
};
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faStrikethrough,
  faHeading, faListUl, faListOl, faQuoteLeft,
  faLink, faImage, faUndo, faRedo, faEye, faEdit
} from '@fortawesome/free-solid-svg-icons';
import ToolbarButton from './ToolbarButton';

interface EditorToolbarProps {
  onExecCommand: (command: string, value?: string) => void;
  onFormatBlock: (tag: string) => void;
  onAddLink: () => void;
  onAddImage: () => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
  showPreview?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onExecCommand,
  onFormatBlock,
  onAddLink,
  onAddImage,
  onTogglePreview,
  isPreviewMode,
  showPreview = true
}) => {
  return (
    <div className="border-b border-black p-2 sm:p-3 bg-white">
      <div className="flex flex-wrap gap-1 text-sm">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
          <ToolbarButton
            onClick={() => onExecCommand('bold')}
            title="Bold (Ctrl+B)"
          >
            <FontAwesomeIcon icon={faBold} className="w-3 h-3" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => onExecCommand('italic')}
            title="Italic (Ctrl+I)"
          >
            <FontAwesomeIcon icon={faItalic} className="w-3 h-3" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => onExecCommand('strikethrough')}
            title="Strikethrough"
          >
            <FontAwesomeIcon icon={faStrikethrough} className="w-3 h-3" />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
          <ToolbarButton
            onClick={() => onFormatBlock('h1')}
            title="Heading 1"
          >
            <div className="relative">
              <FontAwesomeIcon icon={faHeading} className="w-3 h-3" />
              <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">1</span>
            </div>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => onFormatBlock('h2')}
            title="Heading 2"
          >
            <div className="relative">
              <FontAwesomeIcon icon={faHeading} className="w-3 h-3" />
              <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">2</span>
            </div>
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => onFormatBlock('h3')}
            title="Heading 3"
          >
            <div className="relative">
              <FontAwesomeIcon icon={faHeading} className="w-3 h-3" />
              <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">3</span>
            </div>
          </ToolbarButton>
        </div>

        {/* Lists & Blocks */}
        <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
          <ToolbarButton
            onClick={() => onExecCommand('insertUnorderedList')}
            title="Bullet List"
          >
            <FontAwesomeIcon icon={faListUl} className="w-3 h-3" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => onExecCommand('insertOrderedList')}
            title="Numbered List"
          >
            <FontAwesomeIcon icon={faListOl} className="w-3 h-3" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => onFormatBlock('blockquote')}
            title="Quote"
          >
            <FontAwesomeIcon icon={faQuoteLeft} className="w-3 h-3" />
          </ToolbarButton>
        </div>

        {/* Media & Links */}
        <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
          <ToolbarButton
            onClick={onAddLink}
            title="Add Link"
          >
            <FontAwesomeIcon icon={faLink} className="w-3 h-3" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={onAddImage}
            title="Add Image"
          >
            <FontAwesomeIcon icon={faImage} className="w-3 h-3" />
          </ToolbarButton>
        </div>

        {/* View & Actions */}
        {showPreview && (
          <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
            <ToolbarButton
              onClick={onTogglePreview}
              isActive={isPreviewMode}
              title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
            >
              <FontAwesomeIcon 
                icon={isPreviewMode ? faEdit : faEye} 
                className="w-3 h-3" 
              />
            </ToolbarButton>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => onExecCommand('undo')}
            title="Undo (Ctrl+Z)"
          >
            <FontAwesomeIcon icon={faUndo} className="w-3 h-3" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => onExecCommand('redo')}
            title="Redo (Ctrl+Y)"
          >
            <FontAwesomeIcon icon={faRedo} className="w-3 h-3" />
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
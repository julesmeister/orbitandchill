/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { getTextStats, validateTextLength } from '@/utils/textUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faStrikethrough, faHighlighter,
  faHeading, faListUl, faListOl, faQuoteLeft, faCode,
  faLink, faImage, faUndo, faRedo, faEye, faEdit,
  faExpand, faCompress, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import ImageUploadModal from '../editor/ImageUploadModal';

interface SimpleRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  showWordCount?: boolean;
  showValidation?: boolean;
  minWords?: number;
  minCharacters?: number;
  showPreview?: boolean;
  allowFullscreen?: boolean;
}

export default function SimpleRichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing your post...", 
  className = "",
  showWordCount = true,
  showValidation = false,
  minWords = 10,
  minCharacters = 50,
  showPreview = true,
  allowFullscreen = true
}: SimpleRichTextEditorProps) {
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Update editor content when prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    const result = document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
    return result;
  }, [handleInput]);

  const formatBlock = useCallback((tag: string) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    
    execCommand('formatBlock', tag);
  }, [execCommand]);

  const handleImageSelect = useCallback((src: string, alt: string) => {
    // Focus the editor first
    editorRef.current?.focus();
    
    // Restore saved selection if we have one
    const selection = window.getSelection();
    if (savedSelection && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelection);
    }
    
    // Insert image with execCommand
    execCommand('insertImage', src);
    
    // Try to add alt attribute to the inserted image
    const images = editorRef.current?.getElementsByTagName('img');
    if (images && images.length > 0) {
      const lastImage = images[images.length - 1];
      lastImage.alt = alt;
      lastImage.title = alt;
    }
    
    setShowImageModal(false);
    setSavedSelection(null);
  }, [execCommand, savedSelection]);

  const addLink = useCallback(() => {
    const url = window.prompt('Enter link URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  // Text statistics using our utility functions
  const textStats = useMemo(() => {
    // Use content prop directly instead of DOM element to ensure proper initialization
    const plainText = editorRef.current?.textContent || content.replace(/<[^>]*>/g, '') || '';
    return getTextStats(plainText);
  }, [content]);

  // Validation status
  const validation = useMemo(() => {
    if (!showValidation || !editorRef.current) return { isValid: true, errors: [] };
    const plainText = editorRef.current.textContent || '';
    return validateTextLength(plainText, minWords, minCharacters);
  }, [content, showValidation, minWords, minCharacters]);

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
      className={`
        p-2 transition-all duration-150 border border-black
        ${isActive 
          ? 'bg-black text-white shadow-inner' 
          : 'text-black hover:bg-black hover:text-white active:bg-gray-800'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md active:scale-95'}
        flex items-center justify-center min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 text-xs sm:text-sm
        focus:outline-none focus:ring-2 focus:ring-black/20
      `}
    >
      {children}
    </button>
  );

  return (
    <div className={`border border-black bg-white ${className} ${isFullscreen ? 'fixed inset-0 z-50 flex flex-col' : ''}`}>
      {/* Toolbar */}
      <div className="border-b border-black p-2 sm:p-3 bg-white">
        <div className="flex flex-wrap gap-1 text-sm">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
            <ToolbarButton
              onClick={() => execCommand('bold')}
              title="Bold (Ctrl+B)"
            >
              <FontAwesomeIcon icon={faBold} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => execCommand('italic')}
              title="Italic (Ctrl+I)"
            >
              <FontAwesomeIcon icon={faItalic} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => execCommand('strikethrough')}
              title="Strikethrough"
            >
              <FontAwesomeIcon icon={faStrikethrough} className="w-3 h-3" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
            <ToolbarButton
              onClick={() => formatBlock('h1')}
              title="Heading 1"
            >
              <div className="relative">
                <FontAwesomeIcon icon={faHeading} className="w-3 h-3" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">1</span>
              </div>
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => formatBlock('h2')}
              title="Heading 2"
            >
              <div className="relative">
                <FontAwesomeIcon icon={faHeading} className="w-3 h-3" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">2</span>
              </div>
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => formatBlock('h3')}
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
              onClick={() => execCommand('insertUnorderedList')}
              title="Bullet List"
            >
              <FontAwesomeIcon icon={faListUl} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => execCommand('insertOrderedList')}
              title="Numbered List"
            >
              <FontAwesomeIcon icon={faListOl} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => formatBlock('blockquote')}
              title="Quote"
            >
              <FontAwesomeIcon icon={faQuoteLeft} className="w-3 h-3" />
            </ToolbarButton>
          </div>

          {/* Media & Links */}
          <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
            <ToolbarButton
              onClick={addLink}
              title="Add Link"
            >
              <FontAwesomeIcon icon={faLink} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                // Save current selection before opening modal
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0).cloneRange();
                  setSavedSelection(range);
                }
                setShowImageModal(true);
              }}
              title="Add Image"
            >
              <FontAwesomeIcon icon={faImage} className="w-3 h-3" />
            </ToolbarButton>
          </div>

          {/* View & Actions */}
          {showPreview && (
            <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
              <ToolbarButton
                onClick={() => setIsPreviewMode(!isPreviewMode)}
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
              onClick={() => execCommand('undo')}
              title="Undo (Ctrl+Z)"
            >
              <FontAwesomeIcon icon={faUndo} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => execCommand('redo')}
              title="Redo (Ctrl+Y)"
            >
              <FontAwesomeIcon icon={faRedo} className="w-3 h-3" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className={`relative ${isFullscreen ? 'flex-1 overflow-hidden' : 'min-h-[300px] sm:min-h-[400px]'}`}>
        {isPreviewMode ? (
          /* Preview Mode */
          <div className={`p-3 sm:p-6 ${isFullscreen ? 'h-full overflow-y-auto' : 'min-h-[300px] sm:min-h-[400px]'} bg-gray-50`}>
            <div className="max-w-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl font-inter">
              {content ? (
                <div 
                  className="text-black leading-relaxed [&_h1]:font-space-grotesk [&_h1]:font-bold [&_h1]:text-black [&_h2]:font-space-grotesk [&_h2]:font-bold [&_h2]:text-black [&_h3]:font-space-grotesk [&_h3]:font-bold [&_h3]:text-black [&_p]:text-black [&_p]:leading-relaxed [&_strong]:text-black [&_strong]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:bg-white [&_blockquote]:italic [&_blockquote]:pl-4 [&_a]:text-black [&_a]:underline [&_img]:rounded [&_img]:border [&_img]:border-black [&_img]:max-w-full [&_img]:h-auto [&_img]:block [&_img]:mx-auto [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2 [&_li]:ml-0 [&_li]:pl-1"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="text-black/50 font-inter italic">
                  {placeholder}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <>
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              className={`prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none p-3 sm:p-6 font-inter ${isFullscreen ? 'h-full overflow-y-auto' : 'min-h-[300px] sm:min-h-[400px]'} [&_h1]:font-space-grotesk [&_h1]:font-bold [&_h1]:text-black [&_h1]:text-2xl [&_h2]:font-space-grotesk [&_h2]:font-bold [&_h2]:text-black [&_h2]:text-xl [&_h3]:font-space-grotesk [&_h3]:font-bold [&_h3]:text-black [&_h3]:text-lg [&_p]:text-black [&_p]:leading-relaxed [&_strong]:text-black [&_strong]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:bg-gray-50 [&_blockquote]:italic [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_a]:text-black [&_a]:underline [&_img]:rounded [&_img]:border [&_img]:border-black [&_img]:max-w-full [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2 [&_li]:ml-0 [&_li]:pl-1`}
              style={{ minHeight: isFullscreen ? 'auto' : '300px' }}
              suppressContentEditableWarning={true}
            />
            {!content && (
              <div className="absolute top-3 sm:top-6 left-3 sm:left-6 text-black/40 pointer-events-none font-inter text-sm sm:text-base italic">
                {placeholder}
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced elegant footer */}
      {showWordCount && (
        <div className="border-t border-black bg-gray-50">
          {/* Main Stats Bar */}
          <div className="px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              {/* Left: Writing Statistics */}
              <div className="flex items-center gap-6 font-inter">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black"></div>
                  <span className="text-sm font-medium text-black">
                    {textStats.words} {textStats.words === 1 ? 'word' : 'words'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black"></div>
                  <span className="text-sm font-medium text-black">
                    {textStats.characters} characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black"></div>
                  <span className="text-sm font-medium text-black">
                    {textStats.readingTime} min read
                  </span>
                </div>
              </div>

              {/* Right: Validation Status */}
              {showValidation && (
                <div className="flex items-center gap-3">
                  {/* Word Count Indicator */}
                  <div className={`flex items-center gap-2 px-3 py-2 border border-black transition-all duration-200 ${
                    textStats.words >= minWords 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black'
                  }`}>
                    <div className={`w-2 h-2 transition-all duration-200 ${
                      textStats.words >= minWords 
                        ? 'bg-white' 
                        : 'bg-black'
                    }`}></div>
                    <span className="text-xs font-medium font-inter">
                      {textStats.words >= minWords ? 'Words ✓' : `${minWords - textStats.words} more words`}
                    </span>
                  </div>
                  
                  {/* Character Count Indicator */}
                  <div className={`flex items-center gap-2 px-3 py-2 border border-black transition-all duration-200 ${
                    textStats.characters >= minCharacters 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black'
                  }`}>
                    <div className={`w-2 h-2 transition-all duration-200 ${
                      textStats.characters >= minCharacters 
                        ? 'bg-white' 
                        : 'bg-black'
                    }`}></div>
                    <span className="text-xs font-medium font-inter">
                      {textStats.characters >= minCharacters ? 'Length ✓' : `${minCharacters - textStats.characters} more chars`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Messages */}
          {showValidation && !validation.isValid && (
            <div className="border-t border-black bg-white px-3 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-black flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faInfoCircle} className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-black font-inter">
                  {validation.errors.join(' • ')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onImageSelect={handleImageSelect}
      />
    </div>
  );
}
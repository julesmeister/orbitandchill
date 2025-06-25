/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Blockquote from '@tiptap/extension-blockquote';
import { useCallback, useMemo, useState } from 'react';
import { getTextStats, validateTextLength } from '@/utils/textUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faStrikethrough, faHighlighter,
  faHeading, faListUl, faListOl, faQuoteLeft, faCode,
  faLink, faImage, faUndo, faRedo, faEye, faEdit,
  faExpand, faCompress, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

interface RichTextEditorProps {
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

export default function RichTextEditor({ 
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
}: RichTextEditorProps) {
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disable default heading to use custom one
        blockquote: false, // Use custom blockquote
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: 'prose-heading',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'prose-blockquote',
        },
      }),
      Highlight.configure({ 
        multicolor: true,
        HTMLAttributes: {
          class: 'prose-highlight',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontFamily,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'prose-link',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'prose-image',
        },
      }),
    ],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] sm:min-h-[400px] p-3 sm:p-6 font-inter prose-headings:font-space-grotesk prose-headings:font-bold prose-headings:text-black prose-p:text-black prose-p:leading-relaxed prose-strong:text-black prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:bg-gray-50 prose-blockquote:italic prose-code:bg-gray-100 prose-code:px-1 sm:prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-white prose-pre:overflow-x-auto prose-pre:-mx-2 sm:prose-pre:mx-0 prose-a:text-black prose-a:underline prose-img:rounded prose-img:border prose-img:border-black prose-img:max-w-full',
      },
      handleKeyDown: (view, event) => {
        // Auto-focus editor when typing
        if (!view.hasFocus()) {
          view.focus();
        }
        return false;
      },
    },
    autofocus: 'end',
    editable: true,
    injectCSS: false,
    immediatelyRender: false,
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL or paste a link:');
    if (url && editor) {
      // Basic URL validation
      try {
        const imageUrl = new URL(url);
        if (imageUrl.protocol === 'http:' || imageUrl.protocol === 'https:') {
          editor.chain().focus().setImage({ src: url, alt: 'Uploaded image' }).run();
        } else {
          alert('Please enter a valid HTTP or HTTPS URL');
        }
      } catch {
        alert('Please enter a valid URL');
      }
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (editor) {
      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);
      
      if (url === null) {
        return;
      }
      
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }
      
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  // Text statistics using our utility functions
  const textStats = useMemo(() => {
    if (!editor) return { characters: 0, words: 0, readingTime: 0 };
    const plainText = editor.getText();
    return getTextStats(plainText);
  }, [editor, content]);

  // Validation status
  const validation = useMemo(() => {
    if (!showValidation || !editor) return { isValid: true, errors: [] };
    const plainText = editor.getText();
    return validateTextLength(plainText, minWords, minCharacters);
  }, [editor, content, showValidation, minWords, minCharacters]);

  if (!editor) {
    return null;
  }

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
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().toggleBold().run();
                // Keep focus on editor after formatting
                setTimeout(() => editor.commands.focus(), 10);
              }}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <FontAwesomeIcon icon={faBold} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().toggleItalic().run();
                setTimeout(() => editor.commands.focus(), 10);
              }}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <FontAwesomeIcon icon={faItalic} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().toggleStrike().run();
                setTimeout(() => editor.commands.focus(), 10);
              }}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <FontAwesomeIcon icon={faStrikethrough} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().toggleHighlight().run();
                setTimeout(() => editor.commands.focus(), 10);
              }}
              isActive={editor.isActive('highlight')}
              title="Highlight"
            >
              <FontAwesomeIcon icon={faHighlighter} className="w-3 h-3" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
            <ToolbarButton
              onClick={() => {
                if (editor.isActive('heading', { level: 1 })) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().setHeading({ level: 1 }).run();
                }
                editor.commands.focus();
              }}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1 (Ctrl+Alt+1)"
            >
              <div className="relative">
                <FontAwesomeIcon icon={faHeading} className="w-3 h-3" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">1</span>
              </div>
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                if (editor.isActive('heading', { level: 2 })) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().setHeading({ level: 2 }).run();
                }
                editor.commands.focus();
              }}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2 (Ctrl+Alt+2)"
            >
              <div className="relative">
                <FontAwesomeIcon icon={faHeading} className="w-3 h-3" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-bold">2</span>
              </div>
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                if (editor.isActive('heading', { level: 3 })) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().setHeading({ level: 3 }).run();
                }
                editor.commands.focus();
              }}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3 (Ctrl+Alt+3)"
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
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
                editor.commands.focus();
              }}
              isActive={editor.isActive('bulletList')}
              title="Bullet List (Ctrl+Shift+8)"
            >
              <FontAwesomeIcon icon={faListUl} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
                editor.commands.focus();
              }}
              isActive={editor.isActive('orderedList')}
              title="Numbered List (Ctrl+Shift+7)"
            >
              <FontAwesomeIcon icon={faListOl} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                if (editor.isActive('blockquote')) {
                  editor.chain().focus().lift('blockquote').run();
                } else {
                  editor.chain().focus().setBlockquote().run();
                }
                editor.commands.focus();
              }}
              isActive={editor.isActive('blockquote')}
              title="Quote (Ctrl+Shift+B)"
            >
              <FontAwesomeIcon icon={faQuoteLeft} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                if (editor.isActive('codeBlock')) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().setCodeBlock().run();
                }
                editor.commands.focus();
              }}
              isActive={editor.isActive('codeBlock')}
              title="Code Block (Ctrl+Alt+C)"
            >
              <FontAwesomeIcon icon={faCode} className="w-3 h-3" />
            </ToolbarButton>
          </div>

          {/* Media & Links */}
          <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
            <ToolbarButton
              onClick={() => {
                setLink();
                setTimeout(() => editor.commands.focus(), 10);
              }}
              isActive={editor.isActive('link')}
              title="Add Link (Ctrl+K)"
            >
              <FontAwesomeIcon icon={faLink} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                addImage();
                setTimeout(() => editor.commands.focus(), 10);
              }}
              title="Add Image"
            >
              <FontAwesomeIcon icon={faImage} className="w-3 h-3" />
            </ToolbarButton>
          </div>

          {/* View & Actions */}
          <div className="flex gap-1 border-r border-black pr-2 sm:pr-3 mr-2 sm:mr-3">
            {showPreview && (
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
            )}
            
            {allowFullscreen && (
              <ToolbarButton
                onClick={() => setIsFullscreen(!isFullscreen)}
                isActive={isFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                <FontAwesomeIcon 
                  icon={isFullscreen ? faCompress : faExpand} 
                  className="w-3 h-3" 
                />
              </ToolbarButton>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().undo().run();
                setTimeout(() => editor.commands.focus(), 10);
              }}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <FontAwesomeIcon icon={faUndo} className="w-3 h-3" />
            </ToolbarButton>
            
            <ToolbarButton
              onClick={() => {
                editor.chain().focus().redo().run();
                setTimeout(() => editor.commands.focus(), 10);
              }}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <FontAwesomeIcon icon={faRedo} className="w-3 h-3" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className={`relative ${isFullscreen ? 'flex-1 overflow-hidden' : 'min-h-[400px]'}`}>
        {isPreviewMode ? (
          /* Preview Mode */
          <div className={`p-6 ${isFullscreen ? 'h-full overflow-y-auto' : 'min-h-[400px]'} bg-gray-50`}>
            <div className="max-w-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl font-inter">
              {content ? (
                <div 
                  className="text-black leading-relaxed [&_h1]:font-space-grotesk [&_h1]:font-bold [&_h1]:text-black [&_h2]:font-space-grotesk [&_h2]:font-bold [&_h2]:text-black [&_h3]:font-space-grotesk [&_h3]:font-bold [&_h3]:text-black [&_p]:text-black [&_p]:leading-relaxed [&_strong]:text-black [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:bg-white [&_blockquote]:italic [&_blockquote]:pl-4 [&_code]:bg-gray-100 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded [&_a]:text-black [&_a]:underline [&_img]:rounded [&_img]:border [&_img]:border-black [&_ul]:list-disc [&_ol]:list-decimal [&_li]:mb-2"
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
            <EditorContent 
              editor={editor}
              className={`prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus-within:outline-none font-inter ${isFullscreen ? 'h-full overflow-y-auto' : ''}`}
            />
            {content === '' && (
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
    </div>
  );
}
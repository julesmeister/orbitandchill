/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface EditorContentProps {
  content: string;
  placeholder: string;
  isPreviewMode: boolean;
  isFullscreen: boolean;
  editorRef: React.RefObject<HTMLDivElement | null>;
  onInput: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  content,
  placeholder,
  isPreviewMode,
  isFullscreen,
  editorRef,
  onInput,
  onKeyDown
}) => {
  return (
    <div className={`relative ${isFullscreen ? 'flex-1 overflow-hidden' : 'min-h-[300px] sm:min-h-[400px]'}`}>
      {isPreviewMode ? (
        /* Preview Mode */
        <div className={`p-3 sm:p-6 ${isFullscreen ? 'h-full overflow-y-auto' : 'min-h-[300px] sm:min-h-[400px]'} bg-gray-50`}>
          <div className="max-w-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl font-open-sans">
            {content ? (
              <div 
                className="text-black leading-relaxed [&_h1]:font-space-grotesk [&_h1]:font-bold [&_h1]:text-black [&_h2]:font-space-grotesk [&_h2]:font-bold [&_h2]:text-black [&_h3]:font-space-grotesk [&_h3]:font-bold [&_h3]:text-black [&_p]:text-black [&_p]:leading-relaxed [&_strong]:text-black [&_strong]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:bg-white [&_blockquote]:italic [&_blockquote]:pl-4 [&_a]:text-black [&_a]:underline [&_img]:rounded [&_img]:border [&_img]:border-black [&_img]:max-w-full [&_img]:h-auto [&_img]:block [&_img]:mx-auto [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2 [&_li]:ml-0 [&_li]:pl-1"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="text-black/50 font-open-sans italic">
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
            onInput={onInput}
            onKeyDown={onKeyDown}
            className={`prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none p-3 sm:p-6 font-open-sans ${isFullscreen ? 'h-full overflow-y-auto' : 'min-h-[300px] sm:min-h-[400px]'} [&_h1]:font-space-grotesk [&_h1]:font-bold [&_h1]:text-black [&_h1]:text-2xl [&_h2]:font-space-grotesk [&_h2]:font-bold [&_h2]:text-black [&_h2]:text-xl [&_h3]:font-space-grotesk [&_h3]:font-bold [&_h3]:text-black [&_h3]:text-lg [&_p]:text-black [&_p]:leading-relaxed [&_p]:mb-4 [&_br]:block [&_br]:mb-2 [&_strong]:text-black [&_strong]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:bg-gray-50 [&_blockquote]:italic [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_a]:text-black [&_a]:underline [&_img]:rounded [&_img]:border [&_img]:border-black [&_img]:max-w-full [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:pl-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:pl-2 [&_li]:ml-0 [&_li]:pl-1`}
            style={{ 
              minHeight: isFullscreen ? 'auto' : '300px',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6'
            }}
            suppressContentEditableWarning={true}
          />
          {!content && (
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 text-black/40 pointer-events-none font-open-sans text-sm sm:text-base italic">
              {placeholder}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditorContent;
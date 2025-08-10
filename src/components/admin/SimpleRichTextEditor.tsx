/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { lazy, Suspense } from 'react';
import { useRichTextEditor } from '@/hooks/useRichTextEditor';
import { useTextValidation } from '@/hooks/useTextValidation';
import EditorToolbar from './editor/EditorToolbar';
import EditorContent from './editor/EditorContent';
import EditorStats from './editor/EditorStats';

const ImageUploadModal = lazy(() => import('../editor/ImageUploadModal'));

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
  
  const {
    isPreviewMode,
    setIsPreviewMode,
    isFullscreen,
    showImageModal,
    editorRef,
    handleInput,
    handleKeyDown,
    execCommand,
    formatBlock,
    addLink,
    handleImageSelect,
    handleAddImage
  } = useRichTextEditor(content, onChange);

  const { textStats, validation } = useTextValidation(
    content,
    showValidation,
    minWords,
    minCharacters
  );



  return (
    <div className={`border border-black bg-white ${className} ${isFullscreen ? 'fixed inset-0 z-50 flex flex-col' : ''}`}>
      <EditorToolbar
        onExecCommand={execCommand}
        onFormatBlock={formatBlock}
        onAddLink={addLink}
        onAddImage={handleAddImage}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        isPreviewMode={isPreviewMode}
        showPreview={showPreview}
      />

      <EditorContent
        content={content}
        placeholder={placeholder}
        isPreviewMode={isPreviewMode}
        isFullscreen={isFullscreen}
        editorRef={editorRef}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
      />

      {showWordCount && (
        <EditorStats
          textStats={textStats}
          validation={validation}
          showValidation={showValidation}
          minWords={minWords}
          minCharacters={minCharacters}
        />
      )}
      
      {showImageModal && (
        <Suspense fallback={<div>Loading image uploader...</div>}>
          <ImageUploadModal
            isOpen={showImageModal}
            onClose={() => {}}
            onImageSelect={handleImageSelect}
          />
        </Suspense>
      )}
    </div>
  );
}
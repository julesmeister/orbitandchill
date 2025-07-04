/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { HoraryQuestion, useHoraryStore } from '../store/horaryStore';

interface UseHoraryQuestionDeletionProps {
  userId: string | undefined;
  onQuestionDeleted?: (deletedQuestion: HoraryQuestion) => void;
  showToast?: (title: string, message: string, status: 'success' | 'error' | 'loading') => void;
}

export const useHoraryQuestionDeletion = ({
  userId,
  onQuestionDeleted,
  showToast
}: UseHoraryQuestionDeletionProps) => {
  const { deleteQuestion, loadQuestions } = useHoraryStore();
  const [questionToDelete, setQuestionToDelete] = useState<HoraryQuestion | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteQuestion = (question: HoraryQuestion, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the question click
    setQuestionToDelete(question);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (questionToDelete && userId) {
      // Show loading toast
      showToast?.(
        'Deleting Question',
        `Removing "${questionToDelete.question.substring(0, 50)}${questionToDelete.question.length > 50 ? '...' : ''}"`,
        'loading'
      );

      // Close confirmation modal immediately
      setShowDeleteConfirm(false);
      const questionBeingDeleted = questionToDelete;
      setQuestionToDelete(null);

      try {
        // Call delete function and wait for completion
        await deleteQuestion(questionBeingDeleted.id, userId);

        // Show success toast
        showToast?.(
          'Question Deleted',
          'Your horary question has been successfully removed',
          'success'
        );

        // Call the callback if provided
        onQuestionDeleted?.(questionBeingDeleted);

        // Force refresh questions list
        if (userId) {
          await loadQuestions(userId);
        }

      } catch (error) {
        // Show error toast
        showToast?.(
          'Delete Failed',
          'Failed to delete the question. Please try again.',
          'error'
        );
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setQuestionToDelete(null);
  };

  return {
    questionToDelete,
    showDeleteConfirm,
    handleDeleteQuestion,
    confirmDelete,
    cancelDelete
  };
};
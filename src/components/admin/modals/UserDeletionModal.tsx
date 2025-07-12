/* eslint-disable @typescript-eslint/no-unused-vars */

interface AdminUserData {
  id: string;
  username: string;
  email?: string;
  authProvider: string;
  createdAt: string;
  updatedAt: string;
  hasNatalChart: boolean;
  chartCount: number;
  discussionCount: number;
  isActive: boolean;
  lastActivity: string;
  role?: string;
  isSuspended?: boolean;
}

interface UserDeletionModalProps {
  user: AdminUserData | null;
  isLoading: boolean;
  onDelete: (userId: string, deletionType: 'soft' | 'hard') => void;
  onClose: () => void;
}

export default function UserDeletionModal({
  user,
  isLoading,
  onDelete,
  onClose
}: UserDeletionModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-4 border-black p-6 max-w-md w-full mx-4">
        <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">
          Delete User Account
        </h3>
        <div className="mb-6">
          <p className="font-open-sans text-sm text-black mb-2">
            Are you sure you want to delete the account for <strong>{user.username}</strong>?
          </p>
          <p className="font-open-sans text-xs text-black/70 mb-4">
            This action cannot be undone. Choose deletion type:
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-300">
              <h4 className="font-open-sans text-sm font-medium text-black">Soft Delete (Recommended)</h4>
              <p className="font-open-sans text-xs text-black/70 mt-1">
                Marks account as deleted and removes sensitive data. Preserves content for recovery.
              </p>
            </div>
            <div className="p-3 bg-red-50 border border-red-300">
              <h4 className="font-open-sans text-sm font-medium text-black">Hard Delete (Permanent)</h4>
              <p className="font-open-sans text-xs text-black/70 mt-1">
                Permanently removes all user data. Anonymizes forum posts. Cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onDelete(user.id, 'soft')}
            disabled={isLoading}
            className="flex-1 px-4 py-2 font-open-sans text-sm font-medium text-black bg-yellow-100 border border-black hover:bg-yellow-200 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Processing...' : 'Soft Delete'}
          </button>
          <button
            onClick={() => onDelete(user.id, 'hard')}
            disabled={isLoading}
            className="flex-1 px-4 py-2 font-open-sans text-sm font-medium text-white bg-red-600 border border-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Processing...' : 'Hard Delete'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 font-open-sans text-sm font-medium text-black bg-white border border-black hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
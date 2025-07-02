import { ReplyFormState } from '../../types/threads';
import { useUserStore } from '../../store/userStore';
import { getAvatarByIdentifier } from '../../utils/avatarUtils';
import Image from 'next/image';

interface ReplyFormProps {
  formState: ReplyFormState;
  onReplyChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLocked: boolean;
  isSubmitting?: boolean;
}

export default function ReplyForm({
  formState,
  onReplyChange,
  onSubmit,
  onCancel,
  isLocked,
  isSubmitting = false
}: ReplyFormProps) {
  const { user } = useUserStore();
  const { newReply, replyingTo, replyingToAuthor } = formState;
  
  // Get user display info
  const displayName = user?.username || 'Anonymous User';
  const avatarUrl = user?.profilePictureUrl || getAvatarByIdentifier(displayName);

  if (isLocked) return null;

  return (
    <section id="reply-form" className="bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space-grotesk text-xl font-bold text-black">
          {replyingTo ? `Reply to ${replyingToAuthor}` : 'Add Your Reply'}
        </h3>
        {replyingTo && (
          <button
            onClick={onCancel}
            className="p-2 text-black hover:bg-black hover:text-white transition-all duration-300 border border-black"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {replyingTo && (
        <div className="mb-4 p-3 border border-black" style={{ backgroundColor: '#6bdbff' }}>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-black flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <span className="text-sm text-black font-medium font-open-sans">Replying to {replyingToAuthor}</span>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="flex space-x-4">
          <div className="w-12 h-12 border border-black overflow-hidden flex-shrink-0">
            <Image
              src={avatarUrl}
              alt={displayName}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={newReply}
              onChange={(e) => onReplyChange(e.target.value)}
              className="w-full p-4 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-black/20 resize-none font-open-sans"
              rows={6}
              placeholder={replyingTo ? `Reply to ${replyingToAuthor}...` : "Share your thoughts and insights..."}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-black/60 font-open-sans">
                Posting as: <span className="font-medium text-black">{displayName}</span>
              </span>
              <div className="flex gap-0">
                {replyingTo && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 bg-white text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-open-sans font-medium"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!newReply.trim() || isSubmitting}
                  className={`px-8 py-3 font-medium transition-all duration-300 border border-black font-open-sans ${
                    !newReply.trim() || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  } ${replyingTo ? 'border-l-0' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin border-2 border-gray-400 border-t-transparent w-4 h-4 rounded-full"></div>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    'Post Reply'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
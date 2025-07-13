/* eslint-disable @typescript-eslint/no-unused-vars */
import UserActivityTimeline from '../UserActivityTimeline';

interface UserActivityModalProps {
  userId: string | null;
  onClose: () => void;
}

export default function UserActivityModal({ userId, onClose }: UserActivityModalProps) {
  if (!userId) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[600px] max-h-[80vh] bg-white border-4 border-black shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-black bg-blue-100">
        <h3 className="font-space-grotesk text-lg font-bold text-black">
          Activity Timeline
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-black hover:bg-black hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto border-b border-black">
        <UserActivityTimeline
          userId={userId}
          isOpen={true}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatDate, getInitials } from '@/utils/userHelpers';

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

interface ActivityLevel {
  level: string;
  color: string;
}

interface UserRowProps {
  user: AdminUserData;
  index: number;
  isSelected: boolean;
  useApiData: boolean;
  activity: ActivityLevel;
  onToggleSelection: (userId: string) => void;
  onViewActivity: (userId: string) => void;
  onEditUser: (user: AdminUserData) => void;
  onDeleteUser: (user: AdminUserData) => void;
}

export default function UserRow({
  user,
  index,
  isSelected,
  useApiData,
  activity,
  onToggleSelection,
  onViewActivity,
  onEditUser,
  onDeleteUser
}: UserRowProps) {
  const isAnonymous = user.authProvider === 'anonymous';

  return (
    <div key={user.id} className={`px-8 py-4 border-b border-black hover:bg-black/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Checkbox - Only show for API data */}
          {useApiData && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(user.id)}
              className="w-4 h-4 border border-black rounded focus:ring-2 focus:ring-black"
            />
          )}

          {/* Avatar */}
          <div className="w-12 h-12 flex items-center justify-center text-white font-open-sans font-medium text-sm bg-black">
            {isAnonymous ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            ) : (
              getInitials(user.username)
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-open-sans text-sm font-medium text-black">
                {isAnonymous ? 'Anonymous User' : user.username}
              </h4>
              {isAnonymous && (
                <span className="inline-flex items-center px-2 py-0.5 font-open-sans text-xs font-medium bg-black text-white border border-black">
                  Anonymous
                </span>
              )}
              <span className="inline-flex items-center px-2 py-0.5 font-open-sans text-xs font-medium text-black border border-black" style={{ backgroundColor: activity.color }}>
                {activity.level}
              </span>
              {user.hasNatalChart && (
                <span className="inline-flex items-center px-2 py-0.5 font-open-sans text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                  Has Chart
                </span>
              )}
            </div>
            <div className="mt-1 font-open-sans text-sm text-black/60">
              <span>Joined {formatDate(user.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>Last active {formatDate(user.lastActivity)}</span>
              {user.email && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-black">{user.email}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 font-open-sans text-sm">
          <div className="text-center">
            <div className="font-medium text-black">{user.chartCount}</div>
            <div className="text-black/60">Charts</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-black">{user.discussionCount}</div>
            <div className="text-black/60">Posts</div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onViewActivity(user.id)}
              className="p-2 text-black hover:bg-blue-600 hover:text-white transition-colors border border-black"
              title="View Activity Timeline"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => onEditUser(user)}
              className="p-2 text-black hover:bg-green-600 hover:text-white transition-colors border border-black"
              title="Edit User"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            {/* Only show delete button for API data (admin can delete) */}
            {useApiData && (
              <button 
                onClick={() => onDeleteUser(user)}
                className="p-2 text-black hover:bg-red-600 hover:text-white transition-colors border border-black"
                title="Delete User Account"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
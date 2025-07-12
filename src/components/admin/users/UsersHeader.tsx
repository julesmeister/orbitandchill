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

interface UsersHeaderProps {
  selectedUsers: string[];
  displayUsers: AdminUserData[];
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export default function UsersHeader({
  selectedUsers,
  displayUsers,
  onSelectAll,
  onClearSelection
}: UsersHeaderProps) {
  return (
    <div className="px-8 py-6 border-b border-black" style={{ backgroundColor: '#6bdbff' }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-space-grotesk text-lg font-bold text-black">User Analytics</h3>
          <p className="font-open-sans text-sm text-black/80 mt-1">
            Manage and monitor user activity across the platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={selectedUsers.length === displayUsers.length ? onClearSelection : onSelectAll}
            className="px-4 py-2 font-open-sans text-sm font-medium text-black bg-white border border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15"
          >
            {selectedUsers.length === displayUsers.length ? 'Deselect All' : 'Select All'}
          </button>
          <button className="px-4 py-2 font-open-sans text-sm font-medium text-black bg-white border border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15">
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
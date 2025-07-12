/* eslint-disable @typescript-eslint/no-unused-vars */
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';

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

interface EditFormData {
  username: string;
  email: string;
  role: string;
  status: string;
}

interface UserEditModalProps {
  user: AdminUserData | null;
  formData: EditFormData;
  isLoading: boolean;
  onFormChange: (data: Partial<EditFormData>) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function UserEditModal({
  user,
  formData,
  isLoading,
  onFormChange,
  onSave,
  onClose
}: UserEditModalProps) {
  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] bg-white border-4 border-black shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-black bg-green-100">
        <h3 className="font-space-grotesk text-lg font-bold text-black">
          Edit User: {user.username}
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
      <div className="p-6 overflow-y-auto max-h-[calc(80vh-64px)]">
        <div className="space-y-4">
          <div>
            <label className="block font-open-sans text-sm font-medium text-black mb-1">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => onFormChange({ username: e.target.value })}
              className="w-full px-3 py-2 font-open-sans text-sm bg-white border-2 border-black focus:outline-none focus:border-blue-500"
            />
          </div>
          {user.email && (
            <div>
              <label className="block font-open-sans text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange({ email: e.target.value })}
                className="w-full px-3 py-2 font-open-sans text-sm bg-white border-2 border-black focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block font-open-sans text-sm font-medium text-black mb-1">
              Role
            </label>
            <SynapsasDropdown
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'moderator', label: 'Moderator' }
              ]}
              value={formData.role}
              onChange={(value) => onFormChange({ role: value })}
              placeholder="Select role"
              variant="default"
            />
          </div>
          <div>
            <label className="block font-open-sans text-sm font-medium text-black mb-1">
              Account Status
            </label>
            <SynapsasDropdown
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              value={formData.status}
              onChange={(value) => onFormChange({ status: value })}
              placeholder="Select status"
              variant="default"
              direction="up"
            />
          </div>
        </div>
        <div className="flex items-center mt-6">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="w-full px-4 py-2 font-open-sans text-sm font-medium text-white bg-green-600 border border-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
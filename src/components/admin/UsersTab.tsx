/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import AdminDropdown from '@/components/reusable/AdminDropdown';
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';
import TablePagination from '@/components/reusable/TablePagination';
import UserActivityTimeline from './UserActivityTimeline';
import { toast } from 'sonner';

interface UserAnalytics {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastActive: string;
  chartsGenerated: number;
  forumPosts: number;
  isAnonymous: boolean;
}

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

interface UsersTabProps {
  userAnalytics?: UserAnalytics[];
  isLoading?: boolean;
}

export default function UsersTab({ userAnalytics, isLoading: propsLoading }: UsersTabProps) {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useApiData, setUseApiData] = useState(!userAnalytics);
  const [userFilter, setUserFilter] = useState('Named Users');
  const [timeFilter, setTimeFilter] = useState('Last 30 days');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [activityTimelineUserId, setActivityTimelineUserId] = useState<string | null>(null);
  const [deletionModalUser, setDeletionModalUser] = useState<AdminUserData | null>(null);
  const [isDeletionLoading, setIsDeletionLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);
  const [editFormData, setEditFormData] = useState<{
    username: string;
    email: string;
    role: string;
    status: string;
  }>({
    username: '',
    email: '',
    role: 'user',
    status: 'active'
  });
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Convert UserAnalytics to AdminUserData format
  const convertUserAnalytics = (analytics: UserAnalytics[]): AdminUserData[] => {
    return analytics.map(user => ({
      id: user.id,
      username: user.name,
      email: user.email,
      authProvider: user.isAnonymous ? 'anonymous' : 'google',
      createdAt: user.joinDate,
      updatedAt: user.lastActive,
      hasNatalChart: user.chartsGenerated > 0,
      chartCount: user.chartsGenerated,
      discussionCount: user.forumPosts,
      isActive: true, // Assume active for analytics data
      lastActivity: user.lastActive,
    }));
  };

  // Fetch users data from API
  const fetchUsers = async () => {
    if (!useApiData) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (userFilter === 'Anonymous Users') {
        params.set('authProvider', 'anonymous');
      } else if (userFilter === 'Named Users') {
        params.set('authProvider', 'google');
      }

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  // Load users from props or API
  useEffect(() => {
    if (userAnalytics) {
      setUseApiData(false);
      setUsers(convertUserAnalytics(userAnalytics));
      setIsLoading(propsLoading || false);
    } else {
      setUseApiData(true);
      fetchUsers();
    }
  }, [userAnalytics, propsLoading]);

  // Load users on filter changes (only for API data)
  useEffect(() => {
    if (useApiData) {
      fetchUsers();
    }
  }, [currentPage, itemsPerPage, searchQuery, userFilter, useApiData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getActivityLevel = (charts: number, posts: number) => {
    const total = charts + posts;
    if (total >= 20) return { level: 'High', color: '#51bd94' };
    if (total >= 10) return { level: 'Medium', color: '#f2e356' };
    return { level: 'Low', color: '#ff91e9' };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Handle individual user account deletion
  const handleUserDeletion = async (userId: string, deletionType: 'soft' | 'hard') => {
    setIsDeletionLoading(true);
    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          deletionType,
          adminUserId: 'admin' // TODO: Get actual admin user ID
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setDeletionModalUser(null);
        fetchUsers(); // Refresh data
      } else {
        const error = await response.json();
        if (response.status === 207) {
          // Partial success
          toast.warning(`${error.error}. Some data may not have been cleaned up properly.`);
          setDeletionModalUser(null);
          fetchUsers();
        } else {
          toast.error(error.error || 'Account deletion failed');
        }
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Account deletion failed');
    } finally {
      setIsDeletionLoading(false);
    }
  };

  // Handle bulk user actions
  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    setIsActionLoading(true);
    try {
      if (action === 'deleteUsers') {
        // For bulk deletion, use soft delete by default
        const deletionPromises = selectedUsers.map(userId => 
          fetch('/api/users/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              deletionType: 'soft',
              adminUserId: 'admin' // TODO: Get actual admin user ID
            })
          })
        );

        const results = await Promise.allSettled(deletionPromises);
        const successful = results.filter(result => result.status === 'fulfilled').length;
        const failed = results.length - successful;

        if (failed === 0) {
          toast.success(`Successfully deleted ${successful} user accounts`);
        } else {
          toast.warning(`Deleted ${successful} accounts, ${failed} failed`);
        }
      } else {
        // Other bulk actions
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            userIds: selectedUsers
          })
        });

        if (response.ok) {
          const data = await response.json();
          toast.success(data.message);
        } else {
          const error = await response.json();
          toast.error(error.error || 'Action failed');
        }
      }

      setSelectedUsers([]);
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Action failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(displayUsers.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  // Handle user edit save
  const handleUserEdit = async () => {
    if (!editingUser) return;

    setIsEditLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: editFormData.username,
          email: editFormData.email,
          role: editFormData.role,
          status: editFormData.status,
          adminUserId: 'admin' // TODO: Get actual admin user ID
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('User updated successfully');
        setEditingUser(null);
        fetchUsers(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('User update error:', error);
      toast.error('Failed to update user');
    } finally {
      setIsEditLoading(false);
    }
  };

  // Initialize edit form when editing user changes
  const handleEditUser = (user: AdminUserData) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      email: user.email || '',
      role: user.role || 'user',
      status: user.isSuspended ? 'suspended' : (user.isActive ? 'active' : 'inactive')
    });
  };

  // Filter users when using props data
  const getFilteredUsers = () => {
    if (useApiData) return users; // API handles filtering
    
    let filtered = users;

    // Apply user type filter
    if (userFilter === 'Anonymous Users') {
      filtered = filtered.filter(user => user.authProvider === 'anonymous');
    } else if (userFilter === 'Named Users') {
      filtered = filtered.filter(user => user.authProvider === 'google');
    } else if (userFilter === 'Active Users') {
      filtered = filtered.filter(user => {
        const activity = getActivityLevel(user.chartCount, user.discussionCount);
        return activity.level === 'High' || activity.level === 'Medium';
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();
  const displayUsers = useApiData ? users : filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [userFilter, timeFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="bg-white border border-black p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 w-3/4"></div>
                  <div className="h-3 bg-gray-300 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Activity Timeline Modal - Bottom Right */}
      {activityTimelineUserId && (
        <div className="fixed bottom-4 right-4 z-50 w-[600px] max-h-[80vh] bg-white border-4 border-black shadow-xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-black bg-blue-100">
            <h3 className="font-space-grotesk text-lg font-bold text-black">
              Activity Timeline
            </h3>
            <button
              onClick={() => setActivityTimelineUserId(null)}
              className="p-1 text-black hover:bg-black hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto border-b border-black">
            <UserActivityTimeline
              userId={activityTimelineUserId}
              isOpen={true}
              onClose={() => setActivityTimelineUserId(null)}
            />
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {deletionModalUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full mx-4">
            <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">
              Delete User Account
            </h3>
            <div className="mb-6">
              <p className="font-open-sans text-sm text-black mb-2">
                Are you sure you want to delete the account for <strong>{deletionModalUser.username}</strong>?
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
                onClick={() => handleUserDeletion(deletionModalUser.id, 'soft')}
                disabled={isDeletionLoading}
                className="flex-1 px-4 py-2 font-open-sans text-sm font-medium text-black bg-yellow-100 border border-black hover:bg-yellow-200 disabled:opacity-50 transition-colors"
              >
                {isDeletionLoading ? 'Processing...' : 'Soft Delete'}
              </button>
              <button
                onClick={() => handleUserDeletion(deletionModalUser.id, 'hard')}
                disabled={isDeletionLoading}
                className="flex-1 px-4 py-2 font-open-sans text-sm font-medium text-white bg-red-600 border border-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeletionLoading ? 'Processing...' : 'Hard Delete'}
              </button>
              <button
                onClick={() => setDeletionModalUser(null)}
                disabled={isDeletionLoading}
                className="px-4 py-2 font-open-sans text-sm font-medium text-black bg-white border border-black hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal - Bottom Right */}
      {editingUser && (
        <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] bg-white border-4 border-black shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-black bg-green-100">
            <h3 className="font-space-grotesk text-lg font-bold text-black">
              Edit User: {editingUser.username}
            </h3>
            <button
              onClick={() => setEditingUser(null)}
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
                  value={editFormData.username}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 font-open-sans text-sm bg-white border-2 border-black focus:outline-none focus:border-blue-500"
                />
              </div>
              {editingUser.email && (
                <div>
                  <label className="block font-open-sans text-sm font-medium text-black mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
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
                  value={editFormData.role}
                  onChange={(value) => setEditFormData(prev => ({ ...prev, role: value }))}
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
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'suspended', label: 'Suspended' }
                  ]}
                  value={editFormData.status}
                  onChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                  placeholder="Select status"
                  variant="default"
                  direction="up"
                />
              </div>
            </div>
            <div className="flex items-center mt-6">
              <button
                onClick={handleUserEdit}
                disabled={isEditLoading}
                className="w-full px-4 py-2 font-open-sans text-sm font-medium text-white bg-green-600 border border-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isEditLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-black">
        {/* Header */}
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
                onClick={selectedUsers.length === displayUsers.length ? clearSelection : selectAllUsers}
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

        {/* Filters */}
        <div className="px-8 py-4 border-b border-black" style={{ backgroundColor: '#f2e356' }}>
          <div className="flex items-center space-x-4">
            <AdminDropdown
              options={['5', '10', '15', '25', '50']}
              value={itemsPerPage.toString()}
              onChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
              label="Show"
            />
            <AdminDropdown
              options={['Named Users', 'All Users', 'Anonymous Users', 'Active Users']}
              value={userFilter}
              onChange={setUserFilter}
            />
            <AdminDropdown
              options={['Last 30 days', 'Last 7 days', 'Last 24 hours']}
              value={timeFilter}
              onChange={setTimeFilter}
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 font-open-sans text-sm bg-white border-2 border-black focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions - Only show for API data */}
        {useApiData && selectedUsers.length > 0 && (
          <div className="px-8 py-4 bg-yellow-50 border-b border-black">
            <div className="flex items-center justify-between">
              <span className="font-open-sans text-sm text-black">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('deactivateUsers')}
                  disabled={isActionLoading}
                  className="px-3 py-1 font-open-sans text-sm bg-white border border-black hover:bg-gray-100 disabled:opacity-50"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('deleteUsers')}
                  disabled={isActionLoading}
                  className="px-3 py-1 font-open-sans text-sm bg-red-600 text-white border border-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 font-open-sans text-sm bg-gray-100 border border-black hover:bg-gray-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        <div>
          {displayUsers.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">No users match your current filters.</p>
              </div>
            </div>
          ) : (
            displayUsers.map((user, index) => {
            const activity = getActivityLevel(user.chartCount, user.discussionCount);
            const isAnonymous = user.authProvider === 'anonymous';
            
            return (
              <div key={user.id} className={`px-8 py-4 border-b border-black hover:bg-black/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Checkbox - Only show for API data */}
                    {useApiData && (
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
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
                        onClick={() => setActivityTimelineUserId(user.id)}
                        className="p-2 text-black hover:bg-blue-600 hover:text-white transition-colors border border-black"
                        title="View Activity Timeline"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
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
                          onClick={() => setDeletionModalUser(user)}
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
          })
          )}
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil((useApiData ? users.length : filteredUsers.length) / itemsPerPage)}
          totalItems={useApiData ? users.length : filteredUsers.length}
          itemsPerPage={itemsPerPage}
          startIndex={(currentPage - 1) * itemsPerPage}
          endIndex={Math.min(currentPage * itemsPerPage, (useApiData ? users.length : filteredUsers.length))}
          onPageChange={setCurrentPage}
          backgroundColor="#51bd94"
          label="users"
        />
      </div>
    </div>
  );
}
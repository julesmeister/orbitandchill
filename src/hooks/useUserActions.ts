/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

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

export function useUserActions() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [deletionModalUser, setDeletionModalUser] = useState<AdminUserData | null>(null);
  const [isDeletionLoading, setIsDeletionLoading] = useState(false);
  
  // StatusToast state
  const [toast, setToast] = useState({
    isVisible: false,
    title: '',
    message: '',
    status: 'info' as 'loading' | 'success' | 'error' | 'info'
  });

  const showToast = (title: string, message: string, status: 'loading' | 'success' | 'error' | 'info') => {
    setToast({ isVisible: true, title, message, status });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Handle individual user account deletion
  const handleUserDeletion = async (
    userId: string, 
    deletionType: 'soft' | 'hard',
    fetchUsers: () => void
  ) => {
    setIsDeletionLoading(true);
    showToast('Deleting', 'Processing account deletion...', 'loading');
    
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
        showToast('Success', data.message, 'success');
        setDeletionModalUser(null);
        fetchUsers(); // Refresh data
      } else {
        const error = await response.json();
        if (response.status === 207) {
          // Partial success
          showToast('Warning', `${error.error}. Some data may not have been cleaned up properly.`, 'info');
          setDeletionModalUser(null);
          fetchUsers();
        } else {
          showToast('Error', error.error || 'Account deletion failed', 'error');
        }
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      showToast('Error', 'Account deletion failed', 'error');
    } finally {
      setIsDeletionLoading(false);
    }
  };

  // Handle bulk user actions
  const handleBulkAction = async (action: string, fetchUsers: () => void) => {
    if (selectedUsers.length === 0) {
      showToast('Error', 'Please select users first', 'error');
      return;
    }

    setIsActionLoading(true);
    showToast('Processing', 'Performing bulk action...', 'loading');
    
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
          showToast('Success', `Successfully deleted ${successful} user accounts`, 'success');
        } else {
          showToast('Warning', `Deleted ${successful} accounts, ${failed} failed`, 'info');
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
          showToast('Success', data.message, 'success');
        } else {
          const error = await response.json();
          showToast('Error', error.error || 'Action failed', 'error');
        }
      }

      setSelectedUsers([]);
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Bulk action error:', error);
      showToast('Error', 'Action failed', 'error');
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

  const selectAllUsers = (displayUsers: AdminUserData[]) => {
    setSelectedUsers(displayUsers.map(user => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  return {
    selectedUsers,
    setSelectedUsers,
    isActionLoading,
    deletionModalUser,
    setDeletionModalUser,
    isDeletionLoading,
    handleUserDeletion,
    handleBulkAction,
    toggleUserSelection,
    selectAllUsers,
    clearSelection,
    toast,
    showToast,
    hideToast,
  };
}
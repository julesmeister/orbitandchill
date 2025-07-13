/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';

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

export function useUserEdit() {
  const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    username: '',
    email: '',
    role: 'user',
    status: 'active'
  });
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [activityTimelineUserId, setActivityTimelineUserId] = useState<string | null>(null);
  
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

  // Handle user edit save
  const handleUserEdit = async (fetchUsers: () => void) => {
    if (!editingUser) return;

    setIsEditLoading(true);
    showToast('Saving', 'Updating user information...', 'loading');
    
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
        showToast('Success', 'User updated successfully', 'success');
        
        // Update the editing user with the fresh data from the response
        if (data.user && editingUser) {
          const updatedUser: AdminUserData = {
            ...editingUser,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
            isActive: data.user.status === 'active',
            updatedAt: data.user.updatedAt
          };
          setEditingUser(updatedUser);
          
          // Update form data to reflect the changes
          setEditFormData({
            username: data.user.username,
            email: data.user.email || '',
            role: data.user.role,
            status: data.user.status
          });
        }
        
        fetchUsers(); // Refresh data
      } else {
        const error = await response.json();
        showToast('Error', error.error || 'Failed to update user', 'error');
      }
    } catch (error) {
      console.error('User update error:', error);
      showToast('Error', 'Failed to update user', 'error');
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
      status: user.isActive ? 'active' : 'inactive'
    });
  };

  // Update form data when editing user changes (e.g., after refresh)
  useEffect(() => {
    if (editingUser) {
      setEditFormData({
        username: editingUser.username,
        email: editingUser.email || '',
        role: editingUser.role || 'user',
        status: editingUser.isActive ? 'active' : 'inactive'
      });
    }
  }, [editingUser?.role, editingUser?.isActive, editingUser?.username, editingUser?.email]);

  return {
    editingUser,
    setEditingUser,
    editFormData,
    setEditFormData,
    isEditLoading,
    activityTimelineUserId,
    setActivityTimelineUserId,
    handleUserEdit,
    handleEditUser,
    toast,
    showToast,
    hideToast,
  };
}
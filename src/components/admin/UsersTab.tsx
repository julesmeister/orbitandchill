/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import TablePagination from '@/components/reusable/TablePagination';
import { useUsersData } from '@/hooks/useUsersData';
import { useUsersFilters } from '@/hooks/useUsersFilters';
import { useUserActions } from '@/hooks/useUserActions';
import { useUserEdit } from '@/hooks/useUserEdit';
import UserActivityModal from './modals/UserActivityModal';
import UserDeletionModal from './modals/UserDeletionModal';
import UserEditModal from './modals/UserEditModal';
import UsersHeader from './users/UsersHeader';
import UsersFilters from './users/UsersFilters';
import BulkActions from './users/BulkActions';
import UserRow from './users/UserRow';
import UsersLoading from './users/UsersLoading';
import UsersEmptyState from './users/UsersEmptyState';
import StatusToast from '@/components/reusable/StatusToast';

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
  // Use extracted hooks
  const { users, isLoading, useApiData, fetchUsers } = useUsersData(userAnalytics, propsLoading);
  
  const {
    userFilter,
    setUserFilter,
    timeFilter,
    setTimeFilter,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    getFilteredUsers,
    getActivityLevel,
  } = useUsersFilters();

  const {
    selectedUsers,
    isActionLoading,
    deletionModalUser,
    setDeletionModalUser,
    isDeletionLoading,
    handleUserDeletion,
    handleBulkAction,
    toggleUserSelection,
    selectAllUsers,
    clearSelection,
    toast: actionsToast,
    hideToast: hideActionsToast,
  } = useUserActions();

  const {
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
    hideToast,
  } = useUserEdit();

  // Load users on filter changes (only for API data)
  useEffect(() => {
    if (useApiData) {
      fetchUsers(currentPage, itemsPerPage, searchQuery, userFilter);
    }
  }, [currentPage, itemsPerPage, searchQuery, userFilter, useApiData]);

  const filteredUsers = getFilteredUsers(users, useApiData);
  const displayUsers = useApiData ? users : filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <UsersLoading />;
  }

  const fetchUsersCallback = () => fetchUsers(currentPage, itemsPerPage, searchQuery, userFilter);

  return (
    <div className="space-y-6">
      {/* Modals */}
      <UserActivityModal
        userId={activityTimelineUserId}
        onClose={() => setActivityTimelineUserId(null)}
      />

      <UserDeletionModal
        user={deletionModalUser}
        isLoading={isDeletionLoading}
        onDelete={(userId, deletionType) => handleUserDeletion(userId, deletionType, fetchUsersCallback)}
        onClose={() => setDeletionModalUser(null)}
      />

      <UserEditModal
        user={editingUser}
        formData={editFormData}
        isLoading={isEditLoading}
        onFormChange={(data) => setEditFormData(prev => ({ ...prev, ...data }))}
        onSave={() => handleUserEdit(fetchUsersCallback)}
        onClose={() => setEditingUser(null)}
      />

      <div className="bg-white border border-black">
        <UsersHeader
          selectedUsers={selectedUsers}
          displayUsers={displayUsers}
          onSelectAll={() => selectAllUsers(displayUsers)}
          onClearSelection={clearSelection}
        />

        <UsersFilters
          itemsPerPage={itemsPerPage}
          userFilter={userFilter}
          timeFilter={timeFilter}
          searchQuery={searchQuery}
          onItemsPerPageChange={setItemsPerPage}
          onUserFilterChange={setUserFilter}
          onTimeFilterChange={setTimeFilter}
          onSearchChange={setSearchQuery}
          onPageReset={() => setCurrentPage(1)}
        />

        {useApiData && (
          <BulkActions
            selectedCount={selectedUsers.length}
            isLoading={isActionLoading}
            onDeactivate={() => handleBulkAction('deactivateUsers', fetchUsersCallback)}
            onDelete={() => handleBulkAction('deleteUsers', fetchUsersCallback)}
            onClear={clearSelection}
          />
        )}

        <div>
          {displayUsers.length === 0 ? (
            <UsersEmptyState />
          ) : (
            displayUsers.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                index={index}
                isSelected={selectedUsers.includes(user.id)}
                useApiData={useApiData}
                activity={getActivityLevel(user.chartCount, user.discussionCount)}
                onToggleSelection={toggleUserSelection}
                onViewActivity={setActivityTimelineUserId}
                onEditUser={handleEditUser}
                onDeleteUser={setDeletionModalUser}
              />
            ))
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

      {/* StatusToast for user edit operations */}
      <StatusToast
        title={toast.title}
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onHide={hideToast}
        duration={toast.status === 'loading' ? 0 : 3000}
      />

      {/* StatusToast for user actions (deletion, bulk operations) */}
      <StatusToast
        title={actionsToast.title}
        message={actionsToast.message}
        status={actionsToast.status}
        isVisible={actionsToast.isVisible}
        onHide={hideActionsToast}
        duration={actionsToast.status === 'loading' ? 0 : 3000}
      />
    </div>
  );
}
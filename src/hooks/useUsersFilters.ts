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

export function useUsersFilters() {
  const [userFilter, setUserFilter] = useState('Named Users');
  const [timeFilter, setTimeFilter] = useState('Last 30 days');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const getActivityLevel = (charts: number, posts: number) => {
    const total = charts + posts;
    if (total >= 20) return { level: 'High', color: '#51bd94' };
    if (total >= 10) return { level: 'Medium', color: '#f2e356' };
    return { level: 'Low', color: '#ff91e9' };
  };

  // Filter users when using props data
  const getFilteredUsers = (users: AdminUserData[], useApiData: boolean) => {
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [userFilter, timeFilter, searchQuery]);

  return {
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
  };
}
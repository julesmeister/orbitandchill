/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
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

export function useUsersData(
  userAnalytics?: UserAnalytics[],
  propsLoading?: boolean
) {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useApiData, setUseApiData] = useState(!userAnalytics);

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
  const fetchUsers = async (
    currentPage: number,
    itemsPerPage: number,
    searchQuery: string,
    userFilter: string
  ) => {
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
    }
  }, [userAnalytics, propsLoading]);

  return {
    users,
    setUsers,
    isLoading,
    setIsLoading,
    useApiData,
    fetchUsers,
  };
}
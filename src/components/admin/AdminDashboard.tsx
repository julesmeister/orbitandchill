"use client";

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import AdminHeader from './AdminHeader';
import AdminNavigation from './AdminNavigation';
import AdminLogin from './AdminLogin';
import OverviewTab from './OverviewTab';
import UsersTab from './UsersTab';
// TrafficTab removed - using Google Analytics instead
import PostsTab from './PostsTab';
import SEOTab from './SEOTab';
import PremiumTab from './PremiumTab';
import EventsTab from './EventsTab';
import SeedingTab from './SeedingTab';
import AuditLogsTab from './AuditLogsTab';
import SettingsTab from './SettingsTab';

export default function AdminDashboard() {
  const {
    isAuthenticated,
    adminUser,
    siteMetrics,
    totalThreads,
    healthMetrics,
    notifications,
    isLoading,
    initializeAuth,
    refreshMetrics,
    loadHealthMetrics,
    loadNotifications,
    loadThreadCounts
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth();
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    // Load all admin data when authenticated
    if (isAuthenticated) {
      // AdminDashboard loading data for authenticated admin
      refreshMetrics();
      loadThreadCounts(); // Only load counts for dashboard
      loadHealthMetrics();
      loadNotifications();
    }
  }, [isAuthenticated]); // Only depend on isAuthenticated to avoid function reference loops


  // Comprehensive refresh function
  const handleRefresh = async () => {
    console.log('🔄 Comprehensive admin data refresh initiated...');
    try {
      await Promise.all([
        refreshMetrics(),
        loadThreadCounts(), // Only load counts for dashboard
        loadHealthMetrics(),
        loadNotifications()
      ]);
      console.log('✅ All admin data refreshed successfully');
    } catch (error) {
      console.error('❌ Error during admin data refresh:', error);
    }
  };

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      count: notifications?.unread || 0,  // Show unread notification count
      alert: notifications?.hasHigh        // Show alert indicator for high priority
    },
    { 
      id: 'users', 
      label: 'Users',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      count: 0 // Analytics data now in Google Analytics
    },
    { 
      id: 'posts', 
      label: 'Posts',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      count: totalThreads || 0
    },
    { 
      id: 'events', 
      label: 'Events',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      count: siteMetrics.events?.totalEvents ?? 0
    },
    { 
      id: 'seo', 
      label: 'SEO',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      id: 'premium', 
      label: 'Premium',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    { 
      id: 'settings', 
      label: 'Settings',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'seeding', 
      label: 'Data Seeding',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      id: 'audit', 
      label: 'Audit Logs',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            siteMetrics={siteMetrics} 
            healthMetrics={healthMetrics}
            notifications={notifications}
            isLoading={isLoading} 
          />
        );
      case 'users':
        return <UsersTab />;
      case 'posts':
        return <PostsTab isLoading={isLoading} />;
      case 'events':
        return <EventsTab isLoading={isLoading} />;
      case 'seo':
        return <SEOTab isLoading={isLoading} />;
      case 'premium':
        return <PremiumTab isLoading={isLoading} />;
      case 'seeding':
        return <SeedingTab isLoading={isLoading} />;
      case 'settings':
        return <SettingsTab isLoading={isLoading} />;
      case 'audit':
        return <AuditLogsTab isLoading={isLoading} />;
      default:
        return (
          <OverviewTab 
            siteMetrics={siteMetrics} 
            healthMetrics={healthMetrics}
            notifications={notifications}
            isLoading={isLoading} 
          />
        );
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        <AdminHeader
          adminName={adminUser?.username || 'Admin'}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
        
        <AdminNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        <main className="px-6 md:px-12 lg:px-20 py-12">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
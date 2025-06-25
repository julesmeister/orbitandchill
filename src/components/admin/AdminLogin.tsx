/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useUserStore } from '@/store/userStore';

export default function AdminLogin() {
  const { 
    login, 
    checkCurrentUserAdmin, 
    isAuthenticated, 
    authLoading 
  } = useAdminStore();
  
  const { user } = useUserStore();
  const [error, setError] = useState('');
  const [checkingUserAdmin, setCheckingUserAdmin] = useState(true);

  // Check if current user is admin on mount
  useEffect(() => {
    const checkAdmin = async () => {
      setCheckingUserAdmin(true);
      try {
        await checkCurrentUserAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setCheckingUserAdmin(false);
      }
    };

    if (user && user.email && !isAuthenticated) {
      checkAdmin();
    } else {
      setCheckingUserAdmin(false);
    }
  }, [user, isAuthenticated, checkCurrentUserAdmin]);

  const handleAccessAdmin = async () => {
    if (!user?.email) {
      setError('Please sign in with Google first');
      return;
    }

    const success = await checkCurrentUserAdmin();
    if (!success) {
      setError('Admin access denied. You do not have admin privileges.');
    }
  };

  if (checkingUserAdmin || authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="p-12 border border-black bg-white max-w-md w-full">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto"></div>
            <p className="mt-6 font-space-grotesk text-black">Checking admin access...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
            Admin Access
          </h1>
          <p className="font-inter text-xl text-black/80 leading-relaxed">
            Access the Luckstrology administration dashboard
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="px-[5%] py-12">
        <div className="max-w-2xl mx-auto">
          
          {error && (
            <div className="mb-8 p-6 border border-black" style={{ backgroundColor: '#ff91e9' }}>
              <p className="font-space-grotesk font-semibold text-black text-center">
                {error}
              </p>
            </div>
          )}

          {user && user.email && (user.email === 'orbitandchill@gmail.com' || user.role === 'admin' || user.role === 'moderator') ? (
            // Current user is admin - show ONLY the button as requested
            <div className="text-center">
              {/* User Info */}
              <div className="mb-8 p-8 border border-black" style={{ backgroundColor: '#51bd94' }}>
                <p className="font-space-grotesk text-lg font-semibold text-black mb-2">
                  Signed in as {user.username}
                </p>
                <p className="font-inter text-black/80">
                  {user.email} • {user.email === 'orbitandchill@gmail.com' ? 'Master Admin' : (user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Admin')}
                </p>
              </div>
              
              {/* Just the button as requested */}
              <button
                onClick={handleAccessAdmin}
                disabled={authLoading}
                className="inline-flex items-center gap-3 px-12 py-6 bg-black text-white font-space-grotesk font-semibold text-lg border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {authLoading ? 'Accessing...' : 'Access Admin Dashboard'}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          ) : (
            // Not admin or not signed in - show instructions only
            <div className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
                {/* Left panel - Instructions */}
                <div className="p-8" style={{ backgroundColor: '#6bdbff' }}>
                  <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">
                    For Admin Users
                  </h3>
                  <p className="font-inter text-black/80 leading-relaxed">
                    Sign in with your Google account that has admin privileges to access the dashboard.
                  </p>
                </div>

                {/* Right panel - Status */}
                <div className="p-8 border-l border-black bg-white">
                  <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">
                    Current Status
                  </h3>
                  <p className="font-inter text-black/80 leading-relaxed">
                    {user ? 
                      `Signed in as ${user.username} (No admin privileges)` : 
                      'Not signed in'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
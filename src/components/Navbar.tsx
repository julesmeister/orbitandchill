/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import UserProfile from './navbar/UserProfile';
import GoogleSignInPrompt from './navbar/GoogleSignInPrompt';
import NotificationBell from './navbar/NotificationBell';
import OrbitingLogo from './navbar/OrbitingLogo';
import StatusToast from './reusable/StatusToast';
import VertexBorderButton from './reusable/VertexBorderButton';
import { BRAND } from '@/config/brand';
import { useUserStore } from '../store/userStore';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useNavigation } from '../hooks/useNavigation';
import { generateAnonymousName } from '../utils/usernameGenerator';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{
    isVisible: boolean;
    title: string;
    message: string;
    status: 'loading' | 'success' | 'error' | 'info';
  }>({ isVisible: false, title: '', message: '', status: 'info' });
  
  // Custom hooks
  const { user, updateUser, loadProfile, ensureAnonymousUser, clearProfile } = useUserStore();
  const { signInWithGoogle, signOut, isLoading: isAuthLoading } = useGoogleAuth();
  const { loadingLink, progressWidth, isActiveLink, handleNavigation } = useNavigation();

  // User display information
  const displayName = user?.username || "Anonymous User";

  // Initialize user on mount - run only once
  useEffect(() => {
    const initializeUser = async () => {
      await loadProfile();
      const currentUser = useUserStore.getState().user;
      
      if (!currentUser) {
        const anonymousName = generateAnonymousName();
        await ensureAnonymousUser(anonymousName);
      } else if (currentUser.username === "Anonymous" && currentUser.authProvider === "anonymous") {
        const anonymousName = generateAnonymousName();
        await updateUser({ username: anonymousName });
      }
    };

    // Always run initialization on mount
    initializeUser();
  }, []); // Empty dependency array - run only once on mount

  // Toast helper functions
  const showToast = (title: string, message: string, status: 'loading' | 'success' | 'error' | 'info') => {
    setToast({ isVisible: true, title, message, status });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Authentication handlers
  const handleGoogleSignIn = async () => {
    try {
      showToast('Signing In', 'Connecting to Google...', 'loading');
      const googleUser = await signInWithGoogle();
      showToast('Welcome!', `Successfully signed in as ${googleUser.name}`, 'success');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => hideToast(), 3000);
    } catch (err) {
      console.error("Google Sign-In failed:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      showToast('Sign-In Failed', errorMessage, 'error');
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => hideToast(), 5000);
    }
  };

  const handleSignOut = async () => {
    try {
      showToast('Signing Out', 'Ending your session...', 'loading');
      
      // Call logout API for both user types
      if (user) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
      }

      if (user?.authProvider === "google") {
        await signOut();
        showToast('Signed Out', 'You have been signed out successfully', 'success');
      } else {
        await clearProfile();
        // Create new anonymous user with new name
        const anonymousName = generateAnonymousName();
        await ensureAnonymousUser(anonymousName);
        showToast('Session Reset', 'Starting fresh with a new anonymous identity', 'success');
      }
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => hideToast(), 3000);
    } catch (err) {
      console.error("Sign out failed:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      showToast('Sign-Out Failed', errorMessage, 'error');
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => hideToast(), 5000);
    }
  };

  const handleGooglePromptDismiss = () => {
    setShowGooglePrompt(false);
  };

  return (
    <>
      {/* Google Sign-In Prompt */}
      <GoogleSignInPrompt
        user={user}
        isAuthLoading={isAuthLoading}
        onGoogleSignIn={handleGoogleSignIn}
        onDismiss={handleGooglePromptDismiss}
      />

      {/* Main Navbar */}
    <nav className="bg-white border-b border-black">
      {/* Desktop Layout */}
      <DesktopNav
        user={user}
        displayName={displayName}
        isAuthLoading={isAuthLoading}
        loadingLink={loadingLink}
        progressWidth={progressWidth}
        isActiveLink={isActiveLink}
        onNavigate={handleNavigation}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden relative">
        <div className="bg-white border-b border-black">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Brand - Mobile */}
            <Link href="/" className="flex items-center space-x-2 group">
              <OrbitingLogo 
                size="small"
                className="text-black hover:scale-105 transition-transform duration-300"
              />
              <span className="text-black text-lg font-bold font-space-grotesk">
                {BRAND.name}
              </span>
            </Link>

            {/* Right side actions - Mobile */}
            <div className="flex items-center space-x-3">
              {/* Notification Bell - Mobile */}
              {user && (
                <NotificationBell isMobile={true} />
              )}
              
              {/* User Profile - Mobile */}
              <UserProfile
                user={user}
                isLoading={isAuthLoading}
                displayName={displayName}
                onGoogleSignIn={handleGoogleSignIn}
                onSignOut={handleSignOut}
                isMobile={true}
              />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black transition-colors p-2 bg-white relative group"
              >
                {/* Vertex borders on hover - visible corners */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {/* Top-left corner */}
                  <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-black"></span>
                  {/* Top-right corner */}
                  <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-black"></span>
                  {/* Bottom-left corner */}
                  <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-black"></span>
                  {/* Bottom-right corner */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-black"></span>
                </div>
                <svg className="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileNav
          isOpen={isMenuOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClose={() => setIsMenuOpen(false)}
          loadingLink={loadingLink}
          progressWidth={progressWidth}
          isActiveLink={isActiveLink}
          onNavigate={handleNavigation}
        />
      </div>
    </nav>
    
    {/* Status Toast */}
    <StatusToast
      title={toast.title}
      message={toast.message}
      status={toast.status}
      isVisible={toast.isVisible}
      onHide={hideToast}
      duration={0} // Manual control via setTimeout
    />
    </>
  );
}
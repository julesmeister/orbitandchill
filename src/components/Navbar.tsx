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
import { BRAND } from '@/config/brand';
import { useUserStore } from '../store/userStore';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useNavigation } from '../hooks/useNavigation';
import { generateAnonymousName } from '../utils/usernameGenerator';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  
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

    // Only run if we haven't initialized yet
    const currentUser = useUserStore.getState().user;
    if (!currentUser || currentUser.username === "Anonymous") {
      initializeUser();
    }
  }, []); // Empty dependency array - run only once on mount

  // Authentication handlers
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google Sign-In failed:", err);
    }
  };

  const handleSignOut = async () => {
    try {
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
      } else {
        await clearProfile();
        // Create new anonymous user with new name
        const anonymousName = generateAnonymousName();
        await ensureAnonymousUser(anonymousName);
      }
    } catch (err) {
      console.error("Sign out failed:", err);
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
              <Image
                src="/images/logo.svg"
                alt={`${BRAND.name} Logo`}
                width={32}
                height={32}
                className="w-8 h-8 object-contain hover:scale-105 transition-transform duration-300"
                priority
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
                className="text-black hover:text-gray-600 transition-colors p-2 border border-black bg-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </>
  );
}
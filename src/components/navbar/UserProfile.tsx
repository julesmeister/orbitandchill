/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo } from 'react';
import Image from 'next/image';
import Dropdown from '../reusable/Dropdown';
import { User } from '@/types/user';
import { getAvatarByIdentifier } from '@/utils/avatarUtils';
import { getUserInitials } from '@/utils/usernameGenerator';

interface UserProfileProps {
  user: User | null;
  isLoading: boolean;
  displayName: string;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  isMobile?: boolean;
}

const UserProfile = ({
  user,
  isLoading,
  displayName,
  onGoogleSignIn,
  onSignOut,
  isMobile = false
}: UserProfileProps) => {
  const userInitials = getUserInitials(displayName);

  const isAnonymousUser = user?.authProvider === "anonymous";
  const isGoogleUser = user?.authProvider === "google";

  const profileDropdownItems = useMemo(() => [
    {
      type: "link" as const,
      label: "My Profile",
      href: "/profile",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      type: "link" as const,
      label: "My Charts",
      href: "/chart",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      type: "link" as const,
      label: "Electional Astrology",
      href: "/events",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      type: "link" as const,
      label: "Horary Astrology",
      href: "/horary",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      type: "link" as const,
      label: "Settings",
      href: "/settings",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    { type: "divider" as const },
    {
      type: "link" as const,
      label: "Admin Dashboard",
      href: "/admin",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    { type: "divider" as const },
    {
      type: "button" as const,
      label: isAnonymousUser ? (isLoading ? "Signing in..." : "Sign in with Google") : "Sign Out",
      onClick: isAnonymousUser ? onGoogleSignIn : onSignOut,
      disabled: isAnonymousUser ? isLoading : false,
      icon: isAnonymousUser ? (
        isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
    },
  ], [isAnonymousUser, isLoading, onGoogleSignIn, onSignOut]);

  if (isMobile) {
    return (
      <Dropdown
        items={profileDropdownItems}
        align="right"
        trigger={(isOpen) => (
          <div className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors">
            {user?.profilePictureUrl ? (
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={user.profilePictureUrl}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <span className="text-xs font-bold font-inter">{userInitials}</span>
              </div>
            )}
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      />
    );
  }

  return (
    <Dropdown
      items={profileDropdownItems}
      align="right"
      trigger={(isOpen) => (
        <div className="flex items-center space-x-2 xl:space-x-3 text-black hover:text-gray-600 transition-colors cursor-pointer">
          <div className="hidden xl:block">
            <div className="text-right">
              <div className="text-xs text-gray-500 font-inter">Welcome</div>
              <div className="text-sm font-medium font-space-grotesk">{displayName}</div>
            </div>
          </div>
          <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full overflow-hidden">
            <Image
              src={user?.profilePictureUrl || getAvatarByIdentifier(displayName)}
              alt={displayName}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}
    />
  );
};

export default UserProfile;
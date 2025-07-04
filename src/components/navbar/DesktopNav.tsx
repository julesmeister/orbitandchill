/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavigationLink from './NavigationLink';
import UserProfile from './UserProfile';
import NotificationBell from './NotificationBell';
import OrbitingLogo from './OrbitingLogo';
import { BRAND } from '@/config/brand';
import { User } from '@/types/user';

interface DesktopNavProps {
  user: User | null;
  displayName: string;
  isAuthLoading: boolean;
  loadingLink: string | null;
  progressWidth: number;
  isActiveLink: (href: string) => boolean;
  onNavigate: (href: string) => void;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  onHoverSound?: () => void;
}

const NAVIGATION_LINKS = [
  { href: '/guides', label: 'Guides' },
  { href: '/chart', label: 'Chart' },
  { href: '/astrocartography', label: 'Astrocartography' },
  { href: '/horary', label: 'Horary' },
  { href: '/events', label: 'Electional' },
  { href: '/discussions', label: 'Discussions' },
  { href: '/blog', label: 'Blog' },
];

const DesktopNav = React.memo(({
  user,
  displayName,
  isAuthLoading,
  loadingLink,
  progressWidth,
  isActiveLink,
  onNavigate,
  onGoogleSignIn,
  onSignOut,
  onHoverSound
}: DesktopNavProps) => {
  return (
    <div className="hidden lg:block">
      <div className="w-full px-[3%] xl:px-[2%]">
        <div className="flex items-center justify-between h-20">
          {/* Left Section - Brand and Main Navigation */}
          <div className="flex items-center space-x-8 xl:space-x-12">
            {/* Brand */}
            <Link href="/" className="flex items-center space-x-3 group">
              <OrbitingLogo
                size="normal"
                className="text-black hover:scale-105 transition-transform duration-300"
              />
              <span className="text-xl xl:text-2xl font-bold text-black font-space-grotesk">
                {BRAND.name}
              </span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden lg:flex items-center bg-white px-6 py-2">
              {NAVIGATION_LINKS.map(({ href, label }, index) => (
                <React.Fragment key={href}>
                  <NavigationLink
                    href={href}
                    isLoading={loadingLink === href}
                    isActive={isActiveLink(href)}
                    progressWidth={progressWidth}
                    onNavigate={onNavigate}
                    onHoverSound={onHoverSound}
                  >
                    {label}
                  </NavigationLink>
                  {index < NAVIGATION_LINKS.length - 1 && (
                    <div className="w-px h-4 bg-black mx-2"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 xl:space-x-6">
            {/* Notification Bell - only show for authenticated users */}
            {user && (
              <NotificationBell />
            )}

            <UserProfile
              user={user}
              isLoading={isAuthLoading}
              displayName={displayName}
              onGoogleSignIn={onGoogleSignIn}
              onSignOut={onSignOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

DesktopNav.displayName = 'DesktopNav';

export default DesktopNav;
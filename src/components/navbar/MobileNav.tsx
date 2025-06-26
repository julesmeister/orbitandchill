/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import NavigationLink from './NavigationLink';

interface MobileNavProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  loadingLink: string | null;
  progressWidth: number;
  isActiveLink: (href: string) => boolean;
  onNavigate: (href: string) => void;
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

const MobileNav = React.memo(({
  isOpen,
  searchQuery,
  onSearchChange,
  onClose,
  loadingLink,
  progressWidth,
  isActiveLink,
  onNavigate
}: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-black border-t-0 z-50">
      {/* Mobile Search - Synapsas style with sharp corners */}
      <div className="p-4 border-b border-black">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white text-black placeholder-black/50 pl-10 pr-4 py-3 border border-black focus:outline-none font-inter focus:border-black"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Mobile Navigation Links - Connected partitions with Synapsas styling */}
      <div className="divide-y divide-black">
        {NAVIGATION_LINKS.map(({ href, label }) => (
          <div key={href} className="border-b border-black last:border-b-0">
            <NavigationLink
              href={href}
              className="block px-4 py-4 w-full text-left font-inter font-medium"
              isLoading={loadingLink === href}
              isActive={isActiveLink(href)}
              progressWidth={progressWidth}
              onNavigate={onNavigate}
              onClick={onClose}
            >
              {label}
            </NavigationLink>
          </div>
        ))}
      </div>
    </div>
  );
});

MobileNav.displayName = 'MobileNav';

export default MobileNav;
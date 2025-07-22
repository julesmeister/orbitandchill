/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface StatusBadgeProps {
  type: 'featured' | 'blog' | 'forum' | 'published' | 'draft';
  children: React.ReactNode;
}

const badgeStyles = {
  featured: 'bg-[#ff91e9] text-black border border-black',
  blog: 'bg-[#6bdbff] text-black border border-black',
  forum: 'bg-[#51bd94] text-black border border-black',
  published: 'bg-[#51bd94] text-black border border-black',
  draft: 'bg-[#f2e356] text-black border border-black'
};

export default function StatusBadge({ type, children }: StatusBadgeProps) {
  return (
    <span className={`px-2 py-1 text-xs font-medium font-open-sans ${badgeStyles[type]}`}>
      {children}
    </span>
  );
}
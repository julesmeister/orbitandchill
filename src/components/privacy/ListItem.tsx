/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface ListItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'bullet' | 'check';
}

const CheckIcon = () => (
  <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ListItem({ children, icon, variant = 'bullet' }: ListItemProps) {
  if (variant === 'bullet') {
    return <li className="font-open-sans text-black/80">{children}</li>;
  }

  return (
    <li className="flex items-start space-x-2">
      {icon || <CheckIcon />}
      <span className="font-open-sans text-black/80">{children}</span>
    </li>
  );
}
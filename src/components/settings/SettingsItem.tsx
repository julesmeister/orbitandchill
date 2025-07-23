/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface SettingsItemProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsItem({ 
  title, 
  description, 
  children,
  className = ''
}: SettingsItemProps) {
  return (
    <div className={`border border-black p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-space-grotesk text-sm font-semibold text-black mb-1">
            {title}
          </div>
          <p className="font-open-sans text-xs text-black/60">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
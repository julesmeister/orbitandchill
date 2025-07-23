/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface SettingsSectionProps {
  title: string;
  description: string;
  headerColor: string;
  children: React.ReactNode;
  className?: string;
}

export default function SettingsSection({ 
  title, 
  description, 
  headerColor, 
  children,
  className = ''
}: SettingsSectionProps) {
  return (
    <div className={`border border-black bg-white ${className}`}>
      <div 
        className="p-6 border-b border-black" 
        style={{ backgroundColor: headerColor }}
      >
        <h2 className="font-space-grotesk text-xl font-bold text-black mb-1">
          {title}
        </h2>
        <p className="font-open-sans text-sm text-black/80">
          {description}
        </p>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
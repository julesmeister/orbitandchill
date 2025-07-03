/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

export default function Panel({ children, className = "" }: PanelProps) {
  return (
    <div className={`bg-white border border-black p-6 ${className}`}>
      {children}
    </div>
  );
}
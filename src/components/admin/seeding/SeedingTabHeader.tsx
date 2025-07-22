/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { SeedingTabHeaderProps } from '@/types/seeding';

export default function SeedingTabHeader({ activeTab }: SeedingTabHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-space-grotesk font-bold text-black mb-2">
        AI-Powered Discussion Seeding
      </h1>
      <p className="text-gray-600 font-open-sans">
        Paste Reddit content and let AI rephrase, reformat, and reorganize it into unique astrology forum discussions with user personas.
      </p>
    </div>
  );
}
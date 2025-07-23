/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface UsageCardProps {
  title: string;
  description: string;
}

export default function UsageCard({ title, description }: UsageCardProps) {
  return (
    <div className="border-l-4 border-black pl-4">
      <h3 className="font-open-sans font-semibold text-black">{title}</h3>
      <p className="font-open-sans text-black/80">{description}</p>
    </div>
  );
}
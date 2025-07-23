/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function InfoSection({ title, children, className = '' }: InfoSectionProps) {
  return (
    <section className={`bg-white border border-black p-8 ${className}`}>
      <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">{title}</h2>
      {children}
    </section>
  );
}
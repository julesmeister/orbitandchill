/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface FullWidthSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function FullWidthSection({ children, className = '', style }: FullWidthSectionProps) {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <section className={`px-6 md:px-12 lg:px-20 ${className}`} style={style}>
        {children}
      </section>
    </div>
  );
}
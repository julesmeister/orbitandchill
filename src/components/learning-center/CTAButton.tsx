/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  text: string;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  className?: string;
}

export default function CTAButton({
  href,
  text,
  variant = 'primary',
  icon,
  className = ''
}: CTAButtonProps) {
  const baseClasses = "inline-flex items-center gap-3 px-8 py-4 font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl";
  
  const variantClasses = {
    primary: "bg-black text-white hover:shadow-black/25",
    secondary: "bg-transparent text-black hover:bg-black hover:text-white hover:shadow-black/15"
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <span>{text}</span>
      {icon}
    </Link>
  );
}
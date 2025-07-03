/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  type?: 'button' | 'submit';
  icon?: string;
  isLoading?: boolean;
  className?: string;
}

export default function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  icon,
  isLoading = false,
  className = ""
}: ActionButtonProps) {
  const baseClasses = "w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold border transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-black text-white border-black hover:shadow-lg",
    secondary: "bg-transparent text-black border-gray-300 hover:bg-black hover:text-white hover:border-black",
    outline: "bg-white text-black border-black hover:bg-gray-50"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="text-base">{icon}</span>}
      {isLoading ? (
        <>
          <div className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
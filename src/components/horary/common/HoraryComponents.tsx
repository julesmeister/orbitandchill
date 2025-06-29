/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

/**
 * Common reusable components for horary astrology tabs
 * Ensures consistent UI patterns across all tabs
 */

// Component interfaces
export interface ColoredBoxProps {
  backgroundColor: string;
  textColor?: string;
  borderColor?: string;
  className?: string;
  children: React.ReactNode;
}

export interface BadgeProps {
  label: string;
  backgroundColor: string;
  textColor?: string;
  className?: string;
}

export interface StatCardProps {
  value: number | string;
  label: string;
  backgroundColor: string;
  textColor?: string;
  borderColor?: string;
}

export interface InfoBoxProps {
  title: string;
  content: string | React.ReactNode;
  backgroundColor: string;
  textColor?: string;
  className?: string;
}

export interface DignityBadgeProps {
  type: string;
  backgroundColor: string;
  textColor?: string;
  score?: string;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
}

export interface SectionHeaderProps {
  icon: string;
  title: string;
  size?: 'sm' | 'lg';
}

// Common reusable components
export const ColoredBox: React.FC<ColoredBoxProps> = ({ 
  backgroundColor, 
  textColor = 'white', 
  borderColor = 'black',
  className = '', 
  children 
}) => (
  <div 
    className={`border border-${borderColor} ${className}`}
    style={{ backgroundColor, color: textColor }}
  >
    {children}
  </div>
);

export const Badge: React.FC<BadgeProps> = ({ label, backgroundColor, textColor = 'white', className = '' }) => (
  <span 
    className={`text-xs px-2 py-1 border border-black ${className}`}
    style={{ backgroundColor, color: textColor }}
  >
    {label}
  </span>
);

export const StatCard: React.FC<StatCardProps> = ({ value, label, backgroundColor, textColor = 'white', borderColor = 'black' }) => (
  <ColoredBox 
    backgroundColor={backgroundColor} 
    textColor={textColor}
    borderColor={borderColor}
    className="p-4 text-center"
  >
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm">{label}</div>
  </ColoredBox>
);

export const InfoBox: React.FC<InfoBoxProps> = ({ title, content, backgroundColor, textColor = 'black', className = '' }) => (
  <ColoredBox 
    backgroundColor={backgroundColor}
    textColor={textColor}
    className={`p-3 ${className}`}
  >
    <div className="font-bold text-sm mb-1">{title}</div>
    <div className="text-sm">{content}</div>
  </ColoredBox>
);

export const DignityBadge: React.FC<DignityBadgeProps> = ({ type, backgroundColor, textColor = 'white', score }) => (
  <div className="flex items-center">
    <span className="w-3 h-3 border border-black mr-2" style={{ backgroundColor }}></span>
    <span style={{ color: textColor }}>{type} {score && `(${score})`}</span>
  </div>
);

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, size = 'lg' }) => (
  <div className="flex items-center mb-6">
    <div className={`${size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'} bg-black flex items-center justify-center mr-4`}>
      <span className={`text-white ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>{icon}</span>
    </div>
    <div>
      <h4 className="font-space-grotesk font-bold text-black text-xl">{title}</h4>
      <div className={`${size === 'lg' ? 'w-16' : 'w-24'} h-0.5 bg-black mt-1`}></div>
    </div>
  </div>
);
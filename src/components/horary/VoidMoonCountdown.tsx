"use client";

import React, { useState, useEffect } from 'react';

interface VoidMoonCountdownProps {
  nextSignChange: Date;
  className?: string;
}

const VoidMoonCountdown: React.FC<VoidMoonCountdownProps> = ({ 
  nextSignChange, 
  className = "" 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = nextSignChange.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [nextSignChange]);

  const formatTimeUnit = (value: number, unit: string) => {
    if (value === 0) return null;
    return `${value}${unit}`;
  };

  const timeUnits = [
    formatTimeUnit(timeLeft.days, 'd'),
    formatTimeUnit(timeLeft.hours, 'h'),
    formatTimeUnit(timeLeft.minutes, 'm'),
    formatTimeUnit(timeLeft.seconds, 's')
  ].filter(Boolean);

  if (timeUnits.length === 0) {
    return (
      <span className={`text-xs text-black/60 ${className}`}>
        Void moon period ending now
      </span>
    );
  }

  return (
    <span className={`text-xs text-black/60 ${className}`}>
      Void moon ends in {timeUnits.join(' ')}
    </span>
  );
};

export default VoidMoonCountdown;
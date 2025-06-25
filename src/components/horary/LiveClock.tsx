"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export default function LiveClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isMounted]);

  // Show placeholder during SSR and initial mount
  if (!isMounted || !currentTime) {
    return (
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-indigo-600" />
          <span className="text-2xl font-mono font-bold text-slate-800">
            --:--:--
          </span>
        </div>
        <div className="h-8 w-px bg-slate-300"></div>
        <div className="text-lg text-slate-700">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faClock} className="text-indigo-600" />
        <span className="text-2xl font-mono font-bold text-slate-800">
          {currentTime.toLocaleTimeString()}
        </span>
      </div>
      <div className="h-8 w-px bg-slate-300"></div>
      <div className="text-lg text-slate-700">
        {currentTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );
}
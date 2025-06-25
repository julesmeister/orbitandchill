"use client";

import { useEffect, useState } from 'react';
import WorldMap from './WorldMap';

interface ClientWorldMapProps {
  className?: string;
  onCountryClick?: (countryId: string, event?: MouseEvent) => void;
  whiteCountries?: boolean;
}

export default function ClientWorldMap({ className, onCountryClick, whiteCountries }: ClientWorldMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full ${className || ''}`}>
        <div className="flex items-center justify-center bg-gray-100 h-96">
          <div className="text-gray-500">Loading world map...</div>
        </div>
      </div>
    );
  }

  return <WorldMap className={className} onCountryClick={onCountryClick} whiteCountries={whiteCountries} />;
}
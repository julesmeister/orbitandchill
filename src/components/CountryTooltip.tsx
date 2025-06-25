"use client";

import React, { useEffect, useState } from 'react';

interface CountryTooltipProps {
  countryId: string;
  position: { x: number; y: number };
  onClose: () => void;
}

const countryNames: { [key: string]: string } = {
  'US': 'United States',
  'CA': 'Canada',
  'MX': 'Mexico',
  'BR': 'Brazil',
  'AR': 'Argentina',
  'GB': 'United Kingdom',
  'FR': 'France',
  'DE': 'Germany',
  'IT': 'Italy',
  'ES': 'Spain',
  'RU': 'Russia',
  'CN': 'China',
  'JP': 'Japan',
  'IN': 'India',
  'AU': 'Australia',
  'ZA': 'South Africa',
  'EG': 'Egypt',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'ZW': 'Zimbabwe',
  'ZM': 'Zambia',
  'VN': 'Vietnam',
  'TH': 'Thailand',
  'ID': 'Indonesia',
  'MY': 'Malaysia',
  'PH': 'Philippines',
  'KR': 'South Korea',
  'SG': 'Singapore',
  'NZ': 'New Zealand',
  'FJ': 'Fiji',
  'NO': 'Norway',
  'SE': 'Sweden',
  'FI': 'Finland',
  'DK': 'Denmark',
  'NL': 'Netherlands',
  'BE': 'Belgium',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'PL': 'Poland',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'GR': 'Greece',
  'TR': 'Turkey',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'IL': 'Israel',
  'IQ': 'Iraq',
  'IR': 'Iran',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'LK': 'Sri Lanka',
  'MM': 'Myanmar',
  'KH': 'Cambodia',
  'LA': 'Laos',
  'MN': 'Mongolia',
  'KZ': 'Kazakhstan',
  'UZ': 'Uzbekistan',
  'AF': 'Afghanistan',
  'NP': 'Nepal',
  'BT': 'Bhutan',
  'MV': 'Maldives',
};

const magicalMessages = [
  "✨ Your creativity would sparkle here!",
  "🌟 This place would bring you good luck!",
  "💫 You'd feel extra magical living here!",
  "🎨 Your artistic side would shine bright!",
  "🌙 Dreams come true in this location!",
  "⭐ Your talents would bloom beautifully!",
  "🌈 Happiness follows you everywhere here!",
  "🦄 This place holds special energy for you!",
  "🌸 Love and friendship would flourish!",
  "🔮 Your intuition would be super strong!",
  "🎭 You'd discover hidden talents here!",
  "🎪 Life would be full of exciting adventures!",
  "🎵 Music and joy would fill your days!",
  "🌺 Your soul would feel peaceful and calm!",
  "⚡ You'd have boundless energy and drive!",
];

export default function CountryTooltip({ countryId, position, onClose }: CountryTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Calculate tooltip position (offset from click point)
    const offsetX = position.x > window.innerWidth / 2 ? -220 : 20;
    const offsetY = position.y > window.innerHeight / 2 ? -120 : 20;
    
    setTooltipPosition({
      x: Math.max(10, Math.min(window.innerWidth - 250, position.x + offsetX)),
      y: Math.max(10, Math.min(window.innerHeight - 140, position.y + offsetY))
    });

    // Auto close after 4 seconds
    const closeTimer = setTimeout(onClose, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [position, onClose]);

  const countryName = countryNames[countryId.toUpperCase()] || countryId.toUpperCase();
  const randomMessage = magicalMessages[Math.floor(Math.random() * magicalMessages.length)];

  // Calculate string path from click point to tooltip
  const stringPath = `M ${position.x} ${position.y} Q ${(position.x + tooltipPosition.x) / 2} ${position.y - 30} ${tooltipPosition.x + 20} ${tooltipPosition.y + 60}`;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Click point dot */}
      <div 
        className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping"
        style={{ 
          left: position.x - 6, 
          top: position.y - 6,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
      
      {/* String connection */}
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ 
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        <path
          d={stringPath}
          stroke="#fbbf24"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,3"
          className="animate-pulse"
        />
      </svg>

      {/* Tooltip balloon */}
      <div
        className={`absolute pointer-events-auto transform transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y,
        }}
      >
        {/* Balloon */}
        <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-2xl shadow-2xl max-w-xs border-4 border-white">
          {/* Balloon highlight */}
          <div className="absolute top-2 left-3 w-4 h-4 bg-white/30 rounded-full"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors shadow-lg"
          >
            ×
          </button>

          {/* Content */}
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2 font-arvo">
              {countryName}
            </h3>
            <p className="text-sm leading-relaxed">
              {randomMessage}
            </p>
          </div>

          {/* Balloon string attachment point */}
          <div className="absolute w-2 h-2 bg-yellow-400 rounded-full -bottom-1 left-4 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}
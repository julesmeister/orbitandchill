"use client";

interface ChartLoadingAnimationProps {
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export default function ChartLoadingAnimation({ 
  title = "Loading Chart", 
  subtitle = "Fetching data...",
  showHeader = true,
  showFooter = true,
  className = "w-full"
}: ChartLoadingAnimationProps) {
  return (
    <div className={className}>
      {/* Header skeleton */}
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-100 animate-pulse rounded"></div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="flex items-center space-x-1 border border-gray-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-2 h-9 w-16 bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart loading animation */}
      <div className="h-80 bg-white relative border border-black overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 300"
          className="w-full h-full"
        >
          {/* Animated grid lines */}
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={`grid-${i}`}
              x1={60}
              y1={30 + (i / 4) * 210}
              x2={740}
              y2={30 + (i / 4) * 210}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="animate-pulse"
            />
          ))}

          {/* Axes */}
          <line x1={60} y1={30} x2={60} y2={240} stroke="black" strokeWidth="2" />
          <line x1={60} y1={240} x2={740} y2={240} stroke="black" strokeWidth="2" />

          {/* Animated loading line */}
          <path
            d="M 60 180 Q 200 120 340 150 T 620 130 L 740 110"
            fill="none"
            stroke="#ddd"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10,5"
            className="animate-pulse"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-15;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* Animated dots */}
          {Array.from({ length: 7 }, (_, i) => (
            <circle
              key={`dot-${i}`}
              cx={60 + (i * 113)}
              cy={180 - Math.sin(i) * 30}
              r="4"
              fill="#ccc"
              className="animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}

          {/* Three-dot loading animation with custom text */}
          <g>
            <circle cx="380" cy="160" r="3" fill="black" className="animate-bounce" style={{ animationDelay: '-0.3s' }} />
            <circle cx="400" cy="160" r="3" fill="black" className="animate-bounce" style={{ animationDelay: '-0.15s' }} />
            <circle cx="420" cy="160" r="3" fill="black" className="animate-bounce" />
            <text
              x="400"
              y="180"
              textAnchor="middle"
              className="font-open-sans text-xs fill-black/60"
            >
              {subtitle}
            </text>
          </g>
        </svg>

        {/* Subtle loading overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>

      {/* Stats footer skeleton */}
      {showFooter && (
        <div className="mt-4 pt-4 border-t border-black/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i}>
                <div className="h-6 w-8 bg-gray-200 animate-pulse rounded mx-auto mb-1"></div>
                <div className="h-3 w-16 bg-gray-100 animate-pulse rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
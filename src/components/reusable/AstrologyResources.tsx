/* eslint-disable @typescript-eslint/no-unused-vars */

interface AstrologyResourcesProps {
  className?: string;
}

/**
 * Component with external links to authoritative astrology sources
 * Helps with SEO by providing relevant external links
 */
export default function AstrologyResources({ className = "" }: AstrologyResourcesProps) {
  const resources = [
    {
      name: "NASA Eclipse Website",
      url: "https://eclipse.gsfc.nasa.gov/",
      description: "Official NASA resource for eclipse predictions and data",
      rel: "noopener noreferrer"
    },
    {
      name: "International Astronomical Union",
      url: "https://www.iau.org/",
      description: "The official authority for astronomical definitions",
      rel: "noopener noreferrer"
    },
    {
      name: "Astrodienst",
      url: "https://www.astro.com/",
      description: "Comprehensive astrology reference and ephemeris data",
      rel: "noopener noreferrer"
    },
    {
      name: "The Mountain Astrologer",
      url: "https://mountainastrologer.com/",
      description: "Professional astrology magazine and resources",
      rel: "noopener noreferrer"
    }
  ];

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Authoritative Astrology Resources
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Explore these trusted sources for deeper astrological knowledge:
      </p>
      <ul className="space-y-3">
        {resources.map((resource) => (
          <li key={resource.name}>
            <a
              href={resource.url}
              target="_blank"
              rel={resource.rel}
              className="group flex flex-col hover:bg-white rounded p-2 transition-colors"
            >
              <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                {resource.name} ↗
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {resource.description}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          These external resources provide scientific data and professional insights to complement our tools.
        </p>
      </div>
    </div>
  );
}
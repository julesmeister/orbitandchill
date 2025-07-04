/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface AstrocartographyInfoCardsProps {
  hasAstroData: boolean;
  visiblePlanets: string[];
  parans: any[];
  selectedCountry: string | null;
}

export default function AstrocartographyInfoCards({
  hasAstroData,
  visiblePlanets,
  parans,
  selectedCountry
}: AstrocartographyInfoCardsProps) {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-8">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Planetary Lines Card */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Planetary Lines</h3>
            <p className="text-slate-600 text-sm">
              {hasAstroData ? (
                `Currently showing ${visiblePlanets.length} planetary lines. Each colored line represents where that planet's energy is strongest on Earth.`
              ) : (
                'Generate your natal chart first to see personalized planetary lines based on your birth data.'
              )}
            </p>
          </div>

          {/* Parans Card */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Parans</h3>
            <p className="text-slate-600 text-sm">
              {parans.length > 0 ? (
                `Found ${parans.length} paran intersection${parans.length === 1 ? '' : 's'}. These special points combine planetary energies within a 75-mile radius.`
              ) : (
                'Parans are intersection points where planetary lines cross, creating powerful combined energies.'
              )}
            </p>
          </div>

          {/* Location Insights Card */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Location Insights</h3>
            <p className="text-slate-600 text-sm">
              {selectedCountry ? (
                `Selected: ${selectedCountry}. Click on planetary lines or parans to understand how different celestial energies manifest in this location.`
              ) : (
                'Click on any country to explore how planetary influences might affect your experiences in that location.'
              )}
            </p>
          </div>

          {/* Relocation Charts Card */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3a4 4 0 01-4 4H5m0 0a4 4 0 01-4-4v-1h4v1z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Relocation Charts</h3>
            <p className="text-slate-600 text-sm">
              Generate relocated birth charts to see how your astrological influences shift when you move to different parts of the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
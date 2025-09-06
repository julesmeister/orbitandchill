import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBolt, faCircle, faFilter, faTimes, faLock } from '@fortawesome/free-solid-svg-icons';
import { NatalChartData, ChartAspect } from '../../../utils/natalChart';
import { getFullAspectInfo } from '../../../utils/astrologicalInterpretations';
import { useAspectFilters, AspectCategory, AspectType } from '../../../store/chartStore';
import { getAspectTypeStyle } from '../../../utils/horary/colorConfigurations';

interface MajorAspectsSectionProps {
  id?: string;
  chartData: NatalChartData;
  shouldShowFeature: (feature: string, isPremium: boolean) => boolean;
  userIsPremium: boolean;
}

const MajorAspectsSection: React.FC<MajorAspectsSectionProps> = ({
  id,
  chartData,
  shouldShowFeature,
  userIsPremium
}) => {
  const {
    selectedCategory,
    selectedType,
    showFilters,
    setAspectCategory,
    setAspectType,
    toggleAspectFilters,
    clearAspectFilters,
    hasActiveFilters
  } = useAspectFilters();

  const aspectFilteringEnabled = shouldShowFeature('aspect-filtering', userIsPremium);

  const getAspectCategory = (aspect: ChartAspect): AspectCategory[] => {
    const categories: AspectCategory[] = [];
    const planets = [aspect.planet1.toLowerCase(), aspect.planet2.toLowerCase()];

    // Personality aspects (Sun, Moon, Mercury, Mars)
    if (planets.includes('sun') || planets.includes('moon') || planets.includes('mars')) {
      categories.push('personality');
    }

    // Relationship aspects (Venus, Moon, Mars, Lilith)
    if (planets.includes('venus') || (planets.includes('moon') && planets.includes('mars')) || planets.includes('lilith')) {
      categories.push('relationships');
    }

    // Money/resources aspects (Venus, Jupiter, Saturn, Part of Fortune)
    if (planets.includes('venus') || planets.includes('jupiter') || planets.includes('saturn') || planets.includes('partoffortune')) {
      categories.push('money');
    }

    // Career aspects (Mars, Jupiter, Saturn, Sun, North Node)
    if (planets.includes('mars') || planets.includes('jupiter') || planets.includes('saturn') || planets.includes('sun') || planets.includes('northnode')) {
      categories.push('career');
    }

    // Spirituality aspects (Neptune, Pluto, Jupiter, Chiron, Nodes)
    if (planets.includes('neptune') || planets.includes('pluto') || planets.includes('jupiter') || 
        planets.includes('chiron') || planets.includes('northnode') || planets.includes('southnode')) {
      categories.push('spirituality');
    }

    // Communication aspects (Mercury)
    if (planets.includes('mercury')) {
      categories.push('communication');
    }

    return categories;
  };

  const majorAspects = useMemo(() => {
    if (!chartData?.aspects) {
      return [];
    }
    return chartData.aspects.filter(a => ['conjunction', 'sextile', 'square', 'trine', 'opposition'].includes(a.aspect)) || [];
  }, [chartData?.aspects]);

  const filteredAspects = useMemo(() => {
    return majorAspects.filter(aspect => {
      const aspectInfo = getFullAspectInfo(aspect);
      const categories = getAspectCategory(aspect);

      // Filter by type
      if (selectedType !== 'all' && aspectInfo.type !== selectedType) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== 'all' && !categories.includes(selectedCategory)) {
        return false;
      }

      return true;
    });
  }, [majorAspects, selectedCategory, selectedType]);

  const categoryOptions: { value: AspectCategory; label: string; icon: string }[] = [
    { value: 'all', label: 'All Areas', icon: '🌟' },
    { value: 'personality', label: 'Personality', icon: '👤' },
    { value: 'relationships', label: 'Relationships', icon: '💕' },
    { value: 'money', label: 'Money & Resources', icon: '💰' },
    { value: 'career', label: 'Career', icon: '🚀' },
    { value: 'spirituality', label: 'Spirituality', icon: '🔮' },
    { value: 'communication', label: 'Communication', icon: '💬' },
  ];

  const typeOptions: { value: AspectType; label: string; color: string }[] = [
    { value: 'all', label: 'All Types', color: 'bg-slate-100 text-slate-700' },
    { value: 'harmonious', label: 'Harmonious', color: getAspectTypeStyle('harmonious').badge },
    { value: 'challenging', label: 'Challenging', color: getAspectTypeStyle('challenging').badge },
    { value: 'neutral', label: 'Neutral', color: getAspectTypeStyle('neutral').badge },
  ];

  if (!chartData?.aspects || majorAspects.length === 0) {
    return null;
  }

  return (
    <div id={id} className="bg-white sm:border sm:border-black sm:border-b-0">
      {/* Mobile-first header */}
      <div className="p-2 sm:p-6 sm:border-black">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-space-grotesk text-base sm:text-lg font-bold text-black">Major Aspects</h5>
              <p className="font-open-sans text-xs sm:text-sm text-black/60">
                Showing {filteredAspects.length} of {majorAspects.length} aspects
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Premium Filter Button or Locked State */}
            {aspectFilteringEnabled ? (
              <button
                onClick={toggleAspectFilters}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 border border-black ${showFilters || hasActiveFilters
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-50'
                  }`}
              >
                <FontAwesomeIcon
                  icon={faFilter}
                  className={`text-xs sm:text-sm transition-transform duration-200 ${showFilters ? 'rotate-12' : ''}`}
                />
                <span className="hidden sm:inline">Filter Aspects</span>
                <span className="sm:hidden">Filter</span>
                {hasActiveFilters && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs">•</span>
                    <span className="text-xs font-semibold bg-white text-black px-1 sm:px-1.5 py-0.5 border border-black">
                      {[selectedCategory !== 'all' ? 1 : 0, selectedType !== 'all' ? 1 : 0].filter(Boolean).length}
                    </span>
                  </div>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border border-black bg-gray-100 text-gray-500">
                <FontAwesomeIcon icon={faLock} className="text-xs sm:text-sm" />
                <span className="hidden sm:inline">Premium Filtering</span>
                <span className="sm:hidden">Premium</span>
                <span className="px-1 sm:px-2 py-0.5 text-xs bg-yellow-400 text-black font-bold border border-black">
                  💎
                </span>
              </div>
            )}
            
            {aspectFilteringEnabled && hasActiveFilters && (
              <button
                onClick={clearAspectFilters}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-medium text-black bg-white hover:bg-gray-50 transition-colors duration-200 border border-black"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Filter System - Only show if feature is available */}
      {shouldShowFeature('aspect-filtering', userIsPremium) && showFilters && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <div className="bg-white sm:border-t sm:border-black p-2 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {/* Life Areas */}
              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  <span className="font-space-grotesk text-xs sm:text-sm font-medium text-black">Life Areas</span>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAspectCategory(option.value)}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 border border-black ${selectedCategory === option.value
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start">
                        <span className="text-xs sm:text-sm">{option.icon}</span>
                        <span className="truncate">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-black"></div>

              {/* Aspect Types */}
              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  <span className="font-space-grotesk text-xs sm:text-sm font-medium text-black">Energy Types</span>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {typeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAspectType(option.value)}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2 justify-center sm:justify-start border border-black ${selectedType === option.value
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-50'
                        }`}
                    >
                      {selectedType === option.value && (
                        <div className="w-1.5 h-1.5 bg-white"></div>
                      )}
                      <span className="truncate">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Aspects List */}
      {filteredAspects.length > 0 ? (
        <div className="space-y-0 sm:border-t sm:border-black">
          <div className="sm:divide-y sm:divide-black">
            {filteredAspects.map((aspect, index) => {
              const aspectInfo = getFullAspectInfo(aspect);
              const typeStyle = getAspectTypeStyle(aspectInfo.type);
              const getIconComponent = () => {
                switch (aspectInfo.type) {
                  case 'harmonious':
                    return faHeart;
                  case 'challenging':
                    return faBolt;
                  default:
                    return faCircle;
                }
              };

              return (
                <div key={index} className="py-3 px-2 sm:py-6 sm:px-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={getIconComponent()} className="text-white text-xs sm:text-sm" />
                      </div>
                      <span className="font-space-grotesk font-medium capitalize text-black text-sm sm:text-base">
                        {aspect.planet1} {aspect.aspect} {aspect.planet2}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium ${typeStyle.badge}`}>
                        <span className={`w-1.5 h-1.5 ${typeStyle.dot}`} />
                        {aspectInfo.type}
                      </span>
                      <span className="font-open-sans text-xs sm:text-sm text-black/60">
                        {aspect.orb.toFixed(1)}° orb
                      </span>
                    </div>
                  </div>
                  <p className="font-open-sans text-sm text-black leading-relaxed">
                    {aspectInfo.interpretation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 sm:py-8 sm:border-t sm:border-black px-2 sm:px-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon icon={faFilter} className="text-white text-sm sm:text-base" />
          </div>
          <p className="font-space-grotesk text-black font-medium mb-1 text-sm sm:text-base">No aspects match your filters</p>
          <p className="font-open-sans text-xs sm:text-sm text-black/60">Try adjusting your filter criteria or clear all filters</p>
        </div>
      )}
    </div>
  );
};

export default MajorAspectsSection;
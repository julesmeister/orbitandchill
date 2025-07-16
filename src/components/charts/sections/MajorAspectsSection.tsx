/* eslint-disable @typescript-eslint/no-unused-vars */
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

  if (!chartData?.aspects) {
    return null;
  }

  const getAspectCategory = (aspect: ChartAspect): AspectCategory[] => {
    const categories: AspectCategory[] = [];
    const planets = [aspect.planet1.toLowerCase(), aspect.planet2.toLowerCase()];

    // Personality aspects (Sun, Moon, Mercury, Mars)
    if (planets.includes('sun') || planets.includes('moon') || planets.includes('mars')) {
      categories.push('personality');
    }

    // Relationship aspects (Venus, Moon, Mars)
    if (planets.includes('venus') || (planets.includes('moon') && planets.includes('mars'))) {
      categories.push('relationships');
    }

    // Money/resources aspects (Venus, Jupiter, Saturn)
    if (planets.includes('venus') || planets.includes('jupiter') || planets.includes('saturn')) {
      categories.push('money');
    }

    // Career aspects (Mars, Jupiter, Saturn, Sun)
    if (planets.includes('mars') || planets.includes('jupiter') || planets.includes('saturn') || planets.includes('sun')) {
      categories.push('career');
    }

    // Spirituality aspects (Neptune, Pluto, Jupiter)
    if (planets.includes('neptune') || planets.includes('pluto') || planets.includes('jupiter')) {
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

  if (majorAspects.length === 0) {
    return null;
  }

  return (
    <div id={id} className="bg-white border border-black border-b-0">
      <div className="flex items-center justify-between p-6 border-black">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h5 className="font-space-grotesk text-lg font-bold text-black">Major Aspects</h5>
            <p className="font-open-sans text-sm text-black/60">
              Showing {filteredAspects.length} of {majorAspects.length} aspects
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Premium Filter Button or Locked State */}
          {aspectFilteringEnabled ? (
            <button
              onClick={toggleAspectFilters}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 border border-black ${showFilters || hasActiveFilters
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-50'
                }`}
            >
              <FontAwesomeIcon
                icon={faFilter}
                className={`text-sm transition-transform duration-200 ${showFilters ? 'rotate-12' : ''}`}
              />
              <span>Filter Aspects</span>
              {hasActiveFilters && (
                <div className="flex items-center gap-1">
                  <span className="text-xs">•</span>
                  <span className="text-xs font-semibold bg-white text-black px-1.5 py-0.5 border border-black">
                    {[selectedCategory !== 'all' ? 1 : 0, selectedType !== 'all' ? 1 : 0].filter(Boolean).length}
                  </span>
                </div>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-black bg-gray-100 text-gray-500">
              <FontAwesomeIcon icon={faLock} className="text-sm" />
              <span>Premium Filtering</span>
              <span className="px-2 py-0.5 text-xs bg-yellow-400 text-black font-bold border border-black">
                💎 PREMIUM
              </span>
            </div>
          )}
          
          {aspectFilteringEnabled && hasActiveFilters && (
            <button
              onClick={clearAspectFilters}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-black bg-white hover:bg-gray-50 transition-colors duration-200 border border-black"
            >
              <FontAwesomeIcon icon={faTimes} className="text-xs" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Filter System - Only show if feature is available */}
      {shouldShowFeature('aspect-filtering', userIsPremium) && showFilters && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <div className="bg-white border-t border-black p-4">
            <div className="space-y-4">
              {/* Life Areas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  <span className="font-space-grotesk text-sm font-medium text-black">Life Areas</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAspectCategory(option.value)}
                      className={`px-3 py-2 text-sm font-medium transition-all duration-200 border border-black ${selectedCategory === option.value
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-black"></div>

              {/* Aspect Types */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-black"></div>
                  <span className="font-space-grotesk text-sm font-medium text-black">Energy Types</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAspectType(option.value)}
                      className={`px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-black ${selectedType === option.value
                          ? 'bg-black text-white'
                          : 'bg-white text-black hover:bg-gray-50'
                        }`}
                    >
                      {selectedType === option.value && (
                        <div className="w-1.5 h-1.5 bg-white"></div>
                      )}
                      <span>{option.label}</span>
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
        <div className=" space-y-0 border-t border-black">
          <div className="divide-y divide-black">
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
                <div key={index} className="py-6 px-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-black mr-2 flex items-center justify-center">
                        <FontAwesomeIcon icon={getIconComponent()} className="text-white text-sm" />
                      </div>
                      <span className="font-space-grotesk font-medium capitalize text-black">
                        {aspect.planet1} {aspect.aspect} {aspect.planet2}
                      </span>
                      <span className={`ml-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium ${typeStyle.badge}`}>
                        <span className={`w-1.5 h-1.5 ${typeStyle.dot}`} />
                        {aspectInfo.type}
                      </span>
                    </div>
                    <span className="font-open-sans text-sm text-black/60">
                      {aspect.orb.toFixed(1)}° orb
                    </span>
                  </div>
                  <p className="font-open-sans text-sm text-black">
                    {aspectInfo.interpretation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border-t border-black">
          <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon icon={faFilter} className="text-white" />
          </div>
          <p className="font-space-grotesk text-black font-medium mb-1">No aspects match your filters</p>
          <p className="font-open-sans text-sm text-black/60">Try adjusting your filter criteria or clear all filters</p>
        </div>
      )}
    </div>
  );
};

export default MajorAspectsSection;
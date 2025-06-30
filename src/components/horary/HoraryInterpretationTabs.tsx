/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { getChartAnalysis } from './InteractiveHoraryChart';
import { HoraryQuestion } from '@/store/horaryStore';
import HousesTab from './HousesTab';
import SignificatorsTab from './SignificatorsTab';
import SignsTab from './SignsTab';
import EssentialDignityTab from './EssentialDignityTab';
import AccidentalDignityTab from './AccidentalDignityTab';
import AspectsTab from './AspectsTab';

interface HoraryInterpretationTabsProps {
  chartData: any;
  question: HoraryQuestion;
}

// Scroll Navigation Button Component
const ScrollButton = ({ direction, onClick, visible }: { direction: 'left' | 'right'; onClick: () => void; visible: boolean }) => {
  if (!visible) return null;
  
  return (
    <button
      onClick={onClick}
      className={`absolute ${direction}-0 top-0 z-10 h-10 w-8 bg-white ${direction === 'right' ? 'border-l border-black' : 'border-r border-black'} flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === 'left' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
};

// Tab Button Component
const TabButton = ({ tab, isActive, onClick }: {
  tab: { id: string; label: string; icon: string };
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 flex items-center gap-2 px-4 md:px-6 py-3 h-10 font-space-grotesk font-bold text-sm transition-all duration-300 relative whitespace-nowrap border-r border-black ${
      isActive 
        ? 'bg-white text-black hover:bg-gray-200' 
        : 'bg-gray-100 text-black hover:bg-gray-200'
    }`}
  >
    <span>{tab.icon}</span>
    <span className="hidden md:inline">{tab.label}</span>
  </button>
);

// Tabs Container Component
const TabsContainer = ({ tabs, activeTab, onTabChange, canScrollLeft, canScrollRight, tabsContainerRef, onScroll }: {
  tabs: { id: string; label: string; icon: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  tabsContainerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}) => (
  <div 
    ref={tabsContainerRef}
    className="flex gap-0 overflow-x-hidden"
    style={{ paddingLeft: canScrollLeft ? '32px' : '0', paddingRight: canScrollRight ? '32px' : '0' }}
    onScroll={onScroll}
  >
    {tabs.map((tab, index) => (
      <TabButton
        key={tab.id}
        tab={tab}
        isActive={activeTab === tab.id}
        onClick={() => onTabChange(tab.id)}
      />
    ))}
  </div>
);

export default function HoraryInterpretationTabs({ chartData, question }: HoraryInterpretationTabsProps) {
  const [activeTab, setActiveTab] = useState('traditional');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Check scroll position and update navigation buttons
  const checkScrollPosition = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      setScrollPosition(scrollLeft);
    }
  };
  
  // Scroll tabs left/right
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      tabsContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };
  
  // Check scroll position on mount and resize
  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle both old stored chart data and new real chart data
  const analysisData = chartData?.planets ? 
    // New real chart data from convertToNatalFormat
    getChartAnalysis(chartData, question) : 
    // Old stored chart data format
    getChartAnalysis(chartData?.metadata?.chartData, question);
    
  if (!analysisData) return null;

  const tabs = [
    { id: 'traditional', label: 'Factors', icon: '📊' },
    { id: 'houses', label: 'Houses', icon: '🏠' },
    { id: 'significators', label: 'Significators', icon: '🎭' },
    { id: 'signs', label: 'Signs', icon: '♈' },
    { id: 'dignity', label: 'Dignity', icon: '👑' },
    { id: 'accidental', label: 'Power', icon: '⚡' },
    { id: 'aspects', label: 'Aspects', icon: '⚹' }
  ];
  const isRadical = analysisData.chartValidation.radical && analysisData.chartValidation.moonNotVoid && analysisData.chartValidation.saturnNotInSeventhOrFirst;

  // Reusable components
  const SectionHeader = ({ icon, title, size = 'lg' }: { icon: string; title: string; size?: 'sm' | 'lg' }) => (
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

  const DataBox = ({ label, value, description }: { label: string; value: string | number | null; description: string }) => (
    <div className="bg-white border border-black p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-black font-space-grotesk font-bold text-sm">{label}</span>
        <span className="text-black font-inter font-bold text-sm">{value || 'N/A'}</span>
      </div>
      <div className="text-xs text-black font-inter">{description}</div>
    </div>
  );

  const MessageBox = ({ icon, title, message, color }: { icon: string; title: string; message: string; color: string }) => (
    <div className="border border-black p-4" style={{ backgroundColor: color }}>
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg">{icon}</span>
        </div>
        <div>
          <div className="font-space-grotesk font-bold text-black text-lg mb-2">{title}</div>
          <div className="text-black font-inter text-sm">{message}</div>
        </div>
      </div>
    </div>
  );

  const AspectItem = ({ symbol, color, label, description, span }: { symbol: string; color: string; label: string; description: string; span?: string }) => (
    <div className={`border border-black bg-white p-3 ${span || ''}`}>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 bg-${color}-500 flex items-center justify-center`}>
          <span className="text-white text-xs">{symbol}</span>
        </div>
        <span className="text-black font-inter text-xs"><span className="font-bold">{label}:</span> {description}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className="border-t border-black">
        <div className="relative border-b">
          <ScrollButton direction="left" onClick={() => scrollTabs('left')} visible={canScrollLeft} />
          <TabsContainer
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            tabsContainerRef={tabsContainerRef}
            onScroll={checkScrollPosition}
          />
          <ScrollButton direction="right" onClick={() => scrollTabs('right')} visible={canScrollRight} />
        </div>
      </div>
      
      <div className="p-8">
        {activeTab === 'traditional' && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 border-1 gap-0">
              
              {/* Chart Radicality */}
              <div className="border-r border-b border-black p-6" style={{ backgroundColor: isRadical ? '#4ade80' : '#ff91e9' }}>
                <SectionHeader icon={isRadical ? '✓' : '⚠'} title="Chart Radicality" />
                <div className="space-y-4">
                  <DataBox 
                    label="Ascendant" 
                    value={`${analysisData.ascendant.degreeInSign.toFixed(1)}°`}
                    description={analysisData.ascendant.tooEarly ? 'Too Early (Impulsive)' : analysisData.ascendant.tooLate ? 'Too Late (Predetermined)' : 'Radical Degree (Valid)'}
                  />
                  {analysisData.moon && (
                    <DataBox 
                      label="Moon" 
                      value={analysisData.moon.voidOfCourse ? 'Void' : 'Active'}
                      description={analysisData.moon.voidOfCourse ? 'No more aspects before sign change' : 'Normal progression'}
                    />
                  )}
                  {analysisData.saturn && (
                    <DataBox 
                      label="Saturn" 
                      value={analysisData.saturn.inSeventhHouse ? '7th House' : 'Clear'}
                      description={analysisData.saturn.inSeventhHouse ? 'Complications in partnerships' : 'No obstructions'}
                    />
                  )}
                </div>
              </div>

              {/* Lunar Conditions */}
              {analysisData.moon && (
                <div className="border-r border-b border-black p-6" style={{ backgroundColor: '#6bdbff' }}>
                  <SectionHeader icon="☽" title="Lunar Conditions" />
                  <div className="space-y-4">
                    <DataBox label="Phase" value={analysisData.moon.phase} description="Current lunar energy" />
                    <DataBox label="Sign" value={analysisData.moon.sign} description="Moon's zodiacal position" />
                    <DataBox label="House" value={analysisData.moon.house} description="Life area of focus" />
                    {(analysisData.moon.viaCombusta || analysisData.moon.voidOfCourse) && (
                      <div className="bg-black text-white p-4">
                        {analysisData.moon.viaCombusta && (
                          <div className="mb-2">
                            <div className="font-space-grotesk font-bold text-sm mb-1">⚠ Via Combusta</div>
                            <div className="text-xs">15° Libra - 15° Scorpio: Volatile outcomes</div>
                          </div>
                        )}
                        {analysisData.moon.voidOfCourse && (
                          <div>
                            <div className="font-space-grotesk font-bold text-sm mb-1">☽ Void of Course</div>
                            <div className="text-xs">"Nothing will come of the matter"</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timing Factors */}
              <div className="border-b border-black p-6" style={{ backgroundColor: '#f2e356' }}>
                <SectionHeader icon="⏰" title="Timing Factors" />
                <div className="space-y-4">
                  {analysisData.planetaryHour && (
                    <DataBox label="Hour Ruler" value={analysisData.planetaryHour} description="Planetary influence" />
                  )}
                  <DataBox 
                    label="Chart Time" 
                    value={new Date(question.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                    description="Moment of question"
                  />
                  <div className="bg-black text-white p-4">
                    <div className="font-space-grotesk font-bold text-sm mb-2">✨ Cosmic Influence</div>
                    <div className="text-xs">The planetary hour ruler influences the question's energy and timing of manifestation.</div>
                  </div>
                </div>
              </div>

              {/* Planetary Aspects */}
              <div className="border-black p-6 lg:col-span-3" style={{ backgroundColor: '#ff91e9' }}>
                <SectionHeader icon="⚹" title="Planetary Aspects" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DataBox label="Total Aspects" value={analysisData.aspects.length.toString()} description="Active planetary connections" />
                  <DataBox label="Retrograde" value={analysisData.retrogradeCount.toString()} description="Planets in reverse motion" />
                  <DataBox label="Applying" value={analysisData.aspects.filter((aspect: any) => aspect.applying).length.toString()} description="Future connections forming" />
                </div>
                {analysisData.aspects.length > 0 && (
                  <div className="mt-6">
                    <div className="font-space-grotesk font-bold text-black mb-4">Major Aspects</div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {analysisData.aspects.slice(0, 6).map((aspect: any, i: number) => (
                        <div key={i} className="bg-black text-white p-3">
                          <div className="font-space-grotesk font-bold text-sm mb-1 capitalize">{aspect.planet1} {aspect.aspect} {aspect.planet2}</div>
                          <div className="text-xs">{aspect.applying ? '→ Applying (forming)' : '← Separating (waning)'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Astrological Interpretation */}
              <div className="border-t bg-white p-6 md:col-span-2 lg:col-span-3">
                <SectionHeader icon="📖" title="Astrological Interpretation" size="sm" />

                {question?.interpretation && (
                  <div className="mb-6 p-6 border border-black" style={{ backgroundColor: '#6bdbff' }}>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg">🔮</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-space-grotesk font-bold text-black text-lg mb-3">Oracle's Interpretation</div>
                        <p className="text-black leading-relaxed text-base font-inter">{question.interpretation}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  {!analysisData.chartValidation.radical && (
                    <MessageBox 
                      icon="⚠" 
                      title="Non-Radical Chart" 
                      message="This chart may not be suitable for judgment. The ascendant degree suggests the question is either too early (impulsive) or too late (outcome already determined)."
                      color="#ff91e9"
                    />
                  )}

                  {analysisData.moon?.voidOfCourse && (
                    <MessageBox 
                      icon="☽" 
                      title="Void of Course Moon" 
                      message='Traditional horary teaches that when the Moon is void of course, "nothing will come of the matter." This suggests the situation may not develop or may fizzle out.'
                      color="#f2e356"
                    />
                  )}

                  {analysisData.moon?.viaCombusta && (
                    <MessageBox 
                      icon="🔥" 
                      title="Via Combusta" 
                      message='The Moon in the "Fiery Way" (15° Libra to 15° Scorpio) traditionally indicates unpredictable, volatile, or dangerous outcomes. Proceed with extreme caution.'
                      color="#6bdbff"
                    />
                  )}

                  {analysisData.saturn?.inSeventhHouse && (
                    <MessageBox 
                      icon="♄" 
                      title="Saturn in 7th House" 
                      message="Traditional horary warns against judgment when Saturn occupies the 7th house, as it may indicate complications, delays, or obstacles in relationships and partnerships."
                      color="#f0e3ff"
                    />
                  )}

                  {analysisData.chartValidation.radical && !analysisData.moon?.voidOfCourse && !analysisData.moon?.viaCombusta && (
                    <MessageBox 
                      icon="✓" 
                      title="Radical Chart" 
                      message="This chart meets traditional criteria for reliable horary judgment. The ascendant degree, Moon condition, and overall chart structure support astrological interpretation."
                      color="#4ade80"
                    />
                  )}

                  <div className="border-t border-black pt-6 mt-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                        <span className="text-white text-sm">⚹</span>
                      </div>
                      <div className="font-space-grotesk font-bold text-black text-sm">Aspect Significance</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <AspectItem symbol="→" color="green" label="Applying" description="Events developing" />
                      <AspectItem symbol="←" color="gray" label="Separating" description="Past influences" />
                      <AspectItem symbol="●" color="blue" label="Conjunctions" description="Strong connections" />
                      <AspectItem symbol="△" color="green" label="Trines/Sextiles" description="Harmonious outcomes" />
                      <AspectItem symbol="□" color="red" label="Squares/Oppositions" description="Challenges and obstacles" span="md:col-span-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'houses' && (
          <HousesTab chartData={chartData} analysisData={analysisData} question={question} />
        )}

        {activeTab === 'significators' && (
          <SignificatorsTab chartData={chartData} analysisData={analysisData} question={question} />
        )}

        {activeTab === 'signs' && (
          <SignsTab chartData={chartData} analysisData={analysisData} question={question} />
        )}

        {activeTab === 'dignity' && (
          <EssentialDignityTab chartData={chartData} analysisData={analysisData} question={question} />
        )}

        {activeTab === 'accidental' && (
          <AccidentalDignityTab chartData={chartData} analysisData={analysisData} question={question} />
        )}

        {activeTab === 'aspects' && (
          <AspectsTab chartData={chartData} analysisData={analysisData} question={question} />
        )}
      </div>
    </div>
  );
}
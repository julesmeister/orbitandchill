/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { NatalChartData } from '../../utils/natalChart';
import InterpretationModal from './InterpretationModal';
import { usePremiumFeatures } from '../../hooks/usePremiumFeatures';
import { useUserStore } from '../../store/userStore';
import { useInterpretationSections } from '../../store/chartStore';
import { useStelliumSync } from '../../hooks/useStelliumSync';
import CorePersonalitySection from './sections/CorePersonalitySection';
import StelliumsSection from './sections/StelliumsSection';
import PlanetaryInfluencesSection from './sections/PlanetaryInfluencesSection';
import PlanetaryPositionsSection from './sections/PlanetaryPositionsSection';
import MajorAspectsSection from './sections/MajorAspectsSection';
import PlanetaryDignitiesSection from './sections/PlanetaryDignitiesSection';
import HousesSection from './sections/HousesSection';

interface ChartInterpretationProps {
  birthData?: {
    dateOfBirth: string;
    timeOfBirth: string;
    locationOfBirth: string;
  };
  chartData?: NatalChartData;
}

const ChartInterpretation: React.FC<ChartInterpretationProps> = ({ chartData }) => {
  const { user } = useUserStore();
  const { shouldShowFeature, isFeaturePremium, features } = usePremiumFeatures();
  const { orderedSections } = useInterpretationSections();
  
  // Sync stelliums to user profile when viewing chart interpretations
  const { isUpdating: isSyncingStelliums } = useStelliumSync(chartData);
  
  // For demo purposes, assume user is not premium unless specified
  // In a real app, this would be determined by user subscription status
  const userIsPremium = user?.subscriptionTier === 'premium' || false;
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    text: string;
    icon: string;
    iconColor: string;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    text: '',
    icon: '',
    iconColor: ''
  });

  const openModal = (title: string, subtitle: string, text: string, icon: string, iconColor: string) => {
    // Check if detailed modals are premium and user has access
    if (isFeaturePremium('detailed-modals') && !userIsPremium) {
      // Show premium upgrade prompt instead
      setModalData({
        isOpen: true,
        title: '🔒 Premium Feature',
        subtitle: 'Detailed Interpretations',
        text: 'Unlock comprehensive planetary interpretations with in-depth analysis of how each planet affects different areas of your life. Premium members get access to detailed modal explanations, extended interpretations, and personalized insights.\n\nUpgrade to Premium to access:\n• Complete planetary analysis\n• Detailed aspect interpretations\n• Advanced filtering options\n• Export capabilities\n• And much more!',
        icon: '💎',
        iconColor: 'from-purple-400 to-pink-500'
      });
      return;
    }

    setModalData({
      isOpen: true,
      title,
      subtitle,
      text,
      icon,
      iconColor
    });
  };

  const closeModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  if (!chartData) {
    return (
      <div className="mb-6">
        <div className="bg-white border border-black p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h4 className="font-space-grotesk text-xl font-bold text-black mb-2">Chart Interpretation</h4>
              <p className="font-inter text-black/80">Generate a natal chart to see detailed interpretations</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If premium features haven't loaded yet (0 features), show all visible sections to prevent empty state
  const filteredSections = features.length === 0 
    ? orderedSections.filter(section => section.isVisible)
    : orderedSections.filter(section => section.isVisible && shouldShowFeature(section.id, userIsPremium));

  const renderResult = (
    <>
      <div className="mb-6">
        <div className="bg-white border border-black">
          <div className="flex items-center p-6 border-b border-black">
            <div className="w-10 h-10 bg-black flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-space-grotesk text-xl font-bold text-black">Chart Interpretation</h4>
              <p className="font-inter text-sm text-black/60">Discover the meaning behind your natal chart</p>
            </div>
          </div>

          {/* Interpretation Content */}
          <div className="p-6 space-y-0">
            {filteredSections.map((section) => {
                const sectionId = `section-${section.id}`;
                
                switch (section.id) {
                  case 'core-personality':
                    return chartData && (
                      <div key={section.id} id={sectionId}>
                        <CorePersonalitySection 
                          chartData={chartData}
                          openModal={openModal}
                          isFeaturePremium={isFeaturePremium}
                          userIsPremium={userIsPremium}
                        />
                      </div>
                    );
                    
                  case 'stellium-analysis':
                    return chartData && (
                      <div key={section.id} id={sectionId}>
                        <StelliumsSection chartData={chartData} />
                      </div>
                    );
                    
                  case 'planetary-influences':
                    return chartData && (
                      <div key={section.id} id={sectionId}>
                        <PlanetaryInfluencesSection 
                          chartData={chartData}
                          openModal={openModal}
                        />
                      </div>
                    );
                    
                  case 'planetary-positions':
                    return chartData && (
                      <div key={section.id} id={sectionId}>
                        <PlanetaryPositionsSection chartData={chartData} />
                      </div>
                    );
                    
                  case 'detailed-aspects':
                    return chartData && (
                      <MajorAspectsSection 
                        key={section.id}
                        id={sectionId}
                        chartData={chartData}
                        shouldShowFeature={shouldShowFeature}
                        userIsPremium={userIsPremium}
                      />
                    );
                    
                  case 'planetary-dignities':
                    return chartData && (
                      <div key={section.id} id={sectionId}>
                        <PlanetaryDignitiesSection 
                          chartData={chartData}
                          openModal={openModal}
                        />
                      </div>
                    );
                    
                  case 'house-analysis':
                    return chartData && (
                      <div key={section.id} id={sectionId}>
                        <HousesSection chartData={chartData} />
                      </div>
                    );
                    
                  default:
                    return null;
                }
              })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <InterpretationModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        title={modalData.title}
        subtitle={modalData.subtitle}
        text={modalData.text}
        icon={modalData.icon}
        iconColor={modalData.iconColor}
      />
    </>
  );
  
  return renderResult;
};

export default ChartInterpretation;
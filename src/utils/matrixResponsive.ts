/**
 * Responsive utilities for Matrix of Destiny chart
 */

export interface MatrixResponsiveValues {
  centerX: number;
  centerY: number;
  radius: number;
  circleRadius: {
    center: number;
    outer: number;
  };
  fontSize: {
    center: number;
    outer: number;
  };
  ageDot: {
    radius: number;
    fontSize: number;
    labelOffset: number;
  };
  innerElements: {
    // Primary Inner Elements (Layer 1)
    talent: { offsetX: number; offsetY: number; radius: number };
    guard: { offsetX: number; offsetY: number; radius: number };
    earthPurpose: { offsetX: number; offsetY: number; radius: number };
    heart: { offsetX: number; offsetY: number; radius: number };
    
    // Secondary Inner Elements (Layer 2) - positioned at 0.45x, 0.35x, 0.25x radius
    shadowAspects: { offsetX: number; offsetY: number; radius: number };
    spiritualGifts: { offsetX: number; offsetY: number; radius: number };
    karmicLessons: { offsetX: number; offsetY: number; radius: number };
    
    // Love Line Elements
    pastKarma: { offsetX: number; offsetY: number; radius: number };
    heartDesire: { offsetX: number; offsetY: number; radius: number };
    partnershipPotential: { offsetX: number; offsetY: number; radius: number };
    
    // Money Line Elements
    materialKarma: { offsetX: number; offsetY: number; radius: number };
    financialTalents: { offsetX: number; offsetY: number; radius: number };
    prosperityFlow: { offsetX: number; offsetY: number; radius: number };
    spiritualWealth: { offsetX: number; offsetY: number; radius: number };
    
    // Chakra System Elements
    chakras: {
      root: { offsetX: number; offsetY: number; radius: number };
      sacral: { offsetX: number; offsetY: number; radius: number };
      solarPlexus: { offsetX: number; offsetY: number; radius: number };
      heart: { offsetX: number; offsetY: number; radius: number };
      throat: { offsetX: number; offsetY: number; radius: number };
      thirdEye: { offsetX: number; offsetY: number; radius: number };
      crown: { offsetX: number; offsetY: number; radius: number };
    };
    
    // Ancestral Elements
    ancestralWisdom: { offsetX: number; offsetY: number; radius: number };
    ancestralHealing: { offsetX: number; offsetY: number; radius: number };
    
    // Karmic Tail (existing)
    karmicTail: { 
      leftOffsetX: number; 
      centerOffsetX: number; 
      rightOffsetX: number; 
      offsetY: number; 
      radius: number 
    };
  };
}

export interface MatrixContainerSizing {
  maxSize: number;
  basePercentage: number;
  minHeight: string;
}

/**
 * Get responsive chart values based on screen width
 */
export const getMatrixResponsiveValues = (): MatrixResponsiveValues => {
  // Default to large screen values for SSR
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  
  if (screenWidth >= 1536) { // 2xl screens
    return {
      centerX: 300, centerY: 300, radius: 320,
      circleRadius: { center: 40, outer: 28 },
      fontSize: { center: 28, outer: 24 },
      ageDot: { radius: 1.5, fontSize: 8, labelOffset: 10 },
      innerElements: {
        // Primary Inner Elements (Layer 1)
        talent: { offsetX: 0, offsetY: -120, radius: 20 },
        guard: { offsetX: -225, offsetY: 0, radius: 16 },
        earthPurpose: { offsetX: -130, offsetY: 0, radius: 16 },
        heart: { offsetX: 50, offsetY: 0, radius: 22 },
        
        // Secondary Inner Elements (Layer 2)
        shadowAspects: { offsetX: 45, offsetY: 45, radius: 12 },
        spiritualGifts: { offsetX: -35, offsetY: -35, radius: 10 },
        karmicLessons: { offsetX: 0, offsetY: 25, radius: 8 },
        
        // Love Line Elements
        pastKarma: { offsetX: -80, offsetY: 60, radius: 10 },
        heartDesire: { offsetX: 0, offsetY: -30, radius: 12 },
        partnershipPotential: { offsetX: 60, offsetY: -60, radius: 10 },
        
        // Money Line Elements
        materialKarma: { offsetX: 80, offsetY: 80, radius: 10 },
        financialTalents: { offsetX: 70, offsetY: 0, radius: 12 },
        prosperityFlow: { offsetX: 90, offsetY: -30, radius: 10 },
        spiritualWealth: { offsetX: -60, offsetY: -80, radius: 10 },
        
        // Chakra System Elements (positioned around main positions)
        chakras: {
          root: { offsetX: 0, offsetY: 120, radius: 14 },
          sacral: { offsetX: 90, offsetY: 90, radius: 14 },
          solarPlexus: { offsetX: 120, offsetY: 0, radius: 14 },
          heart: { offsetX: 0, offsetY: 0, radius: 16 },
          throat: { offsetX: -120, offsetY: 0, radius: 14 },
          thirdEye: { offsetX: -90, offsetY: -90, radius: 14 },
          crown: { offsetX: 0, offsetY: -140, radius: 14 }
        },
        
        // Ancestral Elements
        ancestralWisdom: { offsetX: -100, offsetY: -50, radius: 12 },
        ancestralHealing: { offsetX: 100, offsetY: 50, radius: 12 },
        
        // Karmic Tail (existing)
        karmicTail: { leftOffsetX: -60, centerOffsetX: 0, rightOffsetX: 60, offsetY: 400, radius: 16 }
      }
    };
  } else if (screenWidth >= 1280) { // xl screens
    return {
      centerX: 300, centerY: 300, radius: 300,
      circleRadius: { center: 36, outer: 25 },
      fontSize: { center: 25, outer: 21 },
      ageDot: { radius: 1.2, fontSize: 7, labelOffset: 9 },
      innerElements: {
        // Primary Inner Elements (Layer 1)
        talent: { offsetX: 0, offsetY: -120, radius: 20 },
        guard: { offsetX: -225, offsetY: 0, radius: 16 },
        earthPurpose: { offsetX: -130, offsetY: 0, radius: 16 },
        heart: { offsetX: 50, offsetY: 0, radius: 22 },
        
        // Secondary Inner Elements (Layer 2)
        shadowAspects: { offsetX: 42, offsetY: 42, radius: 11 },
        spiritualGifts: { offsetX: -32, offsetY: -32, radius: 9 },
        karmicLessons: { offsetX: 0, offsetY: 22, radius: 7 },
        
        // Love Line Elements
        pastKarma: { offsetX: -75, offsetY: 55, radius: 9 },
        heartDesire: { offsetX: 0, offsetY: -28, radius: 11 },
        partnershipPotential: { offsetX: 55, offsetY: -55, radius: 9 },
        
        // Money Line Elements
        materialKarma: { offsetX: 75, offsetY: 75, radius: 9 },
        financialTalents: { offsetX: 65, offsetY: 0, radius: 11 },
        prosperityFlow: { offsetX: 85, offsetY: -28, radius: 9 },
        spiritualWealth: { offsetX: -55, offsetY: -75, radius: 9 },
        
        // Chakra System Elements
        chakras: {
          root: { offsetX: 0, offsetY: 115, radius: 13 },
          sacral: { offsetX: 85, offsetY: 85, radius: 13 },
          solarPlexus: { offsetX: 115, offsetY: 0, radius: 13 },
          heart: { offsetX: 0, offsetY: 0, radius: 15 },
          throat: { offsetX: -115, offsetY: 0, radius: 13 },
          thirdEye: { offsetX: -85, offsetY: -85, radius: 13 },
          crown: { offsetX: 0, offsetY: -135, radius: 13 }
        },
        
        // Ancestral Elements
        ancestralWisdom: { offsetX: -95, offsetY: -45, radius: 11 },
        ancestralHealing: { offsetX: 95, offsetY: 45, radius: 11 },
        
        // Karmic Tail (existing)
        karmicTail: { leftOffsetX: -60, centerOffsetX: 0, rightOffsetX: 60, offsetY: 380, radius: 16 }
      }
    };
  } else if (screenWidth >= 1024) { // lg screens
    return {
      centerX: 300, centerY: 300, radius: 280,
      circleRadius: { center: 32, outer: 22 },
      fontSize: { center: 22, outer: 18 },
      ageDot: { radius: 1, fontSize: 6, labelOffset: 8 },
      innerElements: {
        // Primary Inner Elements (Layer 1)
        talent: { offsetX: 0, offsetY: -100, radius: 18 },
        guard: { offsetX: -190, offsetY: 0, radius: 14 },
        earthPurpose: { offsetX: -110, offsetY: 0, radius: 14 },
        heart: { offsetX: 42, offsetY: 0, radius: 20 },
        
        // Secondary Inner Elements (Layer 2)
        shadowAspects: { offsetX: 35, offsetY: 35, radius: 10 },
        spiritualGifts: { offsetX: -27, offsetY: -27, radius: 8 },
        karmicLessons: { offsetX: 0, offsetY: 18, radius: 6 },
        
        // Love Line Elements
        pastKarma: { offsetX: -63, offsetY: 46, radius: 8 },
        heartDesire: { offsetX: 0, offsetY: -23, radius: 10 },
        partnershipPotential: { offsetX: 46, offsetY: -46, radius: 8 },
        
        // Money Line Elements
        materialKarma: { offsetX: 63, offsetY: 63, radius: 8 },
        financialTalents: { offsetX: 55, offsetY: 0, radius: 10 },
        prosperityFlow: { offsetX: 71, offsetY: -23, radius: 8 },
        spiritualWealth: { offsetX: -46, offsetY: -63, radius: 8 },
        
        // Chakra System Elements
        chakras: {
          root: { offsetX: 0, offsetY: 96, radius: 11 },
          sacral: { offsetX: 71, offsetY: 71, radius: 11 },
          solarPlexus: { offsetX: 96, offsetY: 0, radius: 11 },
          heart: { offsetX: 0, offsetY: 0, radius: 13 },
          throat: { offsetX: -96, offsetY: 0, radius: 11 },
          thirdEye: { offsetX: -71, offsetY: -71, radius: 11 },
          crown: { offsetX: 0, offsetY: -112, radius: 11 }
        },
        
        // Ancestral Elements
        ancestralWisdom: { offsetX: -80, offsetY: -38, radius: 10 },
        ancestralHealing: { offsetX: 80, offsetY: 38, radius: 10 },
        
        // Karmic Tail (existing)
        karmicTail: { leftOffsetX: -50, centerOffsetX: 0, rightOffsetX: 50, offsetY: 360, radius: 14 }
      }
    };
  } else if (screenWidth >= 768) { // md screens
    return {
      centerX: 300, centerY: 300, radius: 260,
      circleRadius: { center: 28, outer: 20 },
      fontSize: { center: 20, outer: 16 },
      ageDot: { radius: 0.8, fontSize: 5, labelOffset: 7 },
      innerElements: {
        // Primary Inner Elements (Layer 1)
        talent: { offsetX: 0, offsetY: -85, radius: 16 },
        guard: { offsetX: -160, offsetY: 0, radius: 12 },
        earthPurpose: { offsetX: -92, offsetY: 0, radius: 12 },
        heart: { offsetX: 36, offsetY: 0, radius: 18 },
        
        // Secondary Inner Elements (Layer 2)
        shadowAspects: { offsetX: 30, offsetY: 30, radius: 8 },
        spiritualGifts: { offsetX: -22, offsetY: -22, radius: 7 },
        karmicLessons: { offsetX: 0, offsetY: 15, radius: 5 },
        
        // Love Line Elements
        pastKarma: { offsetX: -52, offsetY: 39, radius: 7 },
        heartDesire: { offsetX: 0, offsetY: -20, radius: 8 },
        partnershipPotential: { offsetX: 39, offsetY: -39, radius: 7 },
        
        // Money Line Elements
        materialKarma: { offsetX: 52, offsetY: 52, radius: 7 },
        financialTalents: { offsetX: 45, offsetY: 0, radius: 8 },
        prosperityFlow: { offsetX: 59, offsetY: -20, radius: 7 },
        spiritualWealth: { offsetX: -39, offsetY: -52, radius: 7 },
        
        // Chakra System Elements
        chakras: {
          root: { offsetX: 0, offsetY: 78, radius: 9 },
          sacral: { offsetX: 58, offsetY: 58, radius: 9 },
          solarPlexus: { offsetX: 78, offsetY: 0, radius: 9 },
          heart: { offsetX: 0, offsetY: 0, radius: 11 },
          throat: { offsetX: -78, offsetY: 0, radius: 9 },
          thirdEye: { offsetX: -58, offsetY: -58, radius: 9 },
          crown: { offsetX: 0, offsetY: -91, radius: 9 }
        },
        
        // Ancestral Elements
        ancestralWisdom: { offsetX: -65, offsetY: -31, radius: 8 },
        ancestralHealing: { offsetX: 65, offsetY: 31, radius: 8 },
        
        // Karmic Tail (existing)
        karmicTail: { leftOffsetX: -42, centerOffsetX: 0, rightOffsetX: 42, offsetY: 340, radius: 12 }
      }
    };
  } else { // sm and smaller screens
    return {
      centerX: 300, centerY: 300, radius: 240,
      circleRadius: { center: 24, outer: 18 },
      fontSize: { center: 18, outer: 14 },
      ageDot: { radius: 0.6, fontSize: 4, labelOffset: 6 },
      innerElements: {
        // Primary Inner Elements (Layer 1)
        talent: { offsetX: 0, offsetY: -70, radius: 14 },
        guard: { offsetX: -135, offsetY: 0, radius: 10 },
        earthPurpose: { offsetX: -78, offsetY: 0, radius: 10 },
        heart: { offsetX: 30, offsetY: 0, radius: 16 },
        
        // Secondary Inner Elements (Layer 2)
        shadowAspects: { offsetX: 24, offsetY: 24, radius: 6 },
        spiritualGifts: { offsetX: -18, offsetY: -18, radius: 5 },
        karmicLessons: { offsetX: 0, offsetY: 12, radius: 4 },
        
        // Love Line Elements
        pastKarma: { offsetX: -42, offsetY: 32, radius: 6 },
        heartDesire: { offsetX: 0, offsetY: -16, radius: 7 },
        partnershipPotential: { offsetX: 32, offsetY: -32, radius: 6 },
        
        // Money Line Elements
        materialKarma: { offsetX: 42, offsetY: 42, radius: 6 },
        financialTalents: { offsetX: 36, offsetY: 0, radius: 7 },
        prosperityFlow: { offsetX: 48, offsetY: -16, radius: 6 },
        spiritualWealth: { offsetX: -32, offsetY: -42, radius: 6 },
        
        // Chakra System Elements
        chakras: {
          root: { offsetX: 0, offsetY: 60, radius: 7 },
          sacral: { offsetX: 48, offsetY: 48, radius: 7 },
          solarPlexus: { offsetX: 60, offsetY: 0, radius: 7 },
          heart: { offsetX: 0, offsetY: 0, radius: 9 },
          throat: { offsetX: -60, offsetY: 0, radius: 7 },
          thirdEye: { offsetX: -48, offsetY: -48, radius: 7 },
          crown: { offsetX: 0, offsetY: -70, radius: 7 }
        },
        
        // Ancestral Elements
        ancestralWisdom: { offsetX: -54, offsetY: -26, radius: 7 },
        ancestralHealing: { offsetX: 54, offsetY: 26, radius: 7 },
        
        // Karmic Tail (existing)
        karmicTail: { leftOffsetX: -36, centerOffsetX: 0, rightOffsetX: 36, offsetY: 320, radius: 10 }
      }
    };
  }
};

/**
 * Get responsive container sizing based on screen width
 */
export const getMatrixContainerSizing = (): MatrixContainerSizing => {
  // Default to large screen values for SSR
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  
  if (screenWidth >= 1536) { // 2xl screens
    return {
      maxSize: typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.95, 1200) : 1000,
      basePercentage: 0.95,
      minHeight: '900px'
    };
  } else if (screenWidth >= 1280) { // xl screens
    return {
      maxSize: typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.9, 1000) : 800,
      basePercentage: 0.9,
      minHeight: '800px'
    };
  } else if (screenWidth >= 1024) { // lg screens
    return {
      maxSize: typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.85, 800) : 700,
      basePercentage: 0.85,
      minHeight: '700px'
    };
  } else if (screenWidth >= 768) { // md screens
    return {
      maxSize: typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.8, 600) : 500,
      basePercentage: 0.9,
      minHeight: '500px'
    };
  } else { // sm and smaller screens
    return {
      maxSize: typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.75, 400) : 350,
      basePercentage: 0.95,
      minHeight: '350px'
    };
  }
};

/**
 * Calculate responsive dimensions for the container
 */
export const calculateMatrixDimensions = (
  containerWidth: number, 
  containerHeight: number
): { width: number; height: number } => {
  const sizing = getMatrixContainerSizing();
  const size = Math.min(
    containerWidth * sizing.basePercentage, 
    containerHeight * sizing.basePercentage, 
    sizing.maxSize
  );
  
  return { width: size, height: size };
};
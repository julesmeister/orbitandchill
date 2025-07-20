/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import EmptyMatrixSVGChart from '@/components/generate/EmptyMatrixSVGChart';

// Synapsas color palette
const synapsasColors = {
  black: '#19181a',
  purple: '#ff91e9', 
  green: '#51bd94',
  yellow: '#f2e356',
  blue: '#6bdbff',
  lightPurple: '#f0e3ff',
  lightYellow: '#fffbed', 
  lightGreen: '#e7fff6'
};

const GeneratePageClient: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('destiny-matrix');
  const [matrixValues, setMatrixValues] = useState<Record<string, number>>({
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 10, K: 11, L: 12, M: 13, N: 14, O: 15, P: 16, Q: 17,
    R: 18, S: 19, T: 20, U: 21, V: 22, POA: 11,
    F1: 1, F2: 2, G1: 3, G2: 4, H1: 5, H2: 6, I1: 7, I2: 8
  });

  const handleValueChange = (position: string, value: number) => {
    setMatrixValues(prev => ({
      ...prev,
      [position]: value
    }));
  };

  // Create mock data for the matrix chart
  const createMockMatrixData = () => {
    return {
      positions: {
        A: matrixValues.A || 1,
        B: matrixValues.B || 2,
        C: matrixValues.C || 3,
        D: matrixValues.D || 4,
        E: matrixValues.E || 5,
        F: matrixValues.F || 6,
        G: matrixValues.G || 7,
        H: matrixValues.H || 8,
        I: matrixValues.I || 9,
        J: matrixValues.J || 10,
        K: matrixValues.K || 11,
        L: matrixValues.L || 12,
        M: matrixValues.M || 13,
        N: matrixValues.N || 14,
        O: matrixValues.O || 15,
        P: matrixValues.P || 16,
        Q: matrixValues.Q || 17,
        R: matrixValues.R || 18,
        S: matrixValues.S || 19,
        T: matrixValues.T || 20,
        U: matrixValues.U || 21,
        V: matrixValues.V || 22,
        F1: matrixValues.F1 || 1,
        F2: matrixValues.F2 || 2,
        G1: matrixValues.G1 || 3,
        G2: matrixValues.G2 || 4,
        H1: matrixValues.H1 || 5,
        H2: matrixValues.H2 || 6,
        I1: matrixValues.I1 || 7,
        I2: matrixValues.I2 || 8,
      },
      centers: {
        E: matrixValues.E || 5,
        J: matrixValues.J || 10,
      },
      innerElements: {
        heart: matrixValues.POA || 11,
        talent: matrixValues.T || 20,
        guard: matrixValues.K || 11,
        earthPurpose: matrixValues.L || 12,
      }
    };
  };

  // Create mock positions for the chart
  const createMockPositions = () => {
    const centerX = 350;
    const centerY = 350;
    const radius = 300;
    const cos45 = Math.cos(Math.PI / 4);
    const sin45 = Math.sin(Math.PI / 4);

    return {
      A: { x: centerX - radius, y: centerY },
      B: { x: centerX, y: centerY - radius },
      C: { x: centerX + radius, y: centerY },
      D: { x: centerX, y: centerY + radius },
      E: { x: centerX, y: centerY },
      F: { x: centerX - radius * cos45, y: centerY - radius * sin45 },
      G: { x: centerX + radius * cos45, y: centerY - radius * sin45 },
      H: { x: centerX + radius * cos45, y: centerY + radius * sin45 },
      I: { x: centerX - radius * cos45, y: centerY + radius * sin45 },
    };
  };

  // Create mock responsive values
  const createMockResponsive = () => {
    return {
      centerX: 350,
      centerY: 350,
      radius: 300,
      circleRadius: { outer: 25, center: 36 },
      fontSize: { outer: 21, center: 25 },
      innerElements: {
        heart: { radius: 22, offsetX: 50, offsetY: 0 },
        talent: { radius: 20, offsetX: 0, offsetY: -120 },
        guard: { radius: 16, offsetX: -225, offsetY: 0 },
        earthPurpose: { radius: 16, offsetX: -130, offsetY: 0 },
      },
      ageDot: { radius: 3.5, fontSize: 9, labelOffset: 11 }
    };
  };

  // Create mock debug positions
  const createMockDebugPositions = () => {
    return {
      POWER_OF_ANCESTORS: { x: 50, y: 0 },
      FUTURE_CHILDREN: { x: -225, y: 0 },
      diagonal: { x1: 0, y1: 60, x2: 80, y2: -80 },
      J: { x: 0, y: 60 },
      K: { x: -80, y: 80 },
      L: { x: 80, y: 80 },
      M: { x: -80, y: -80 },
      N: { x: 80, y: -80 },
      O: { x: -60, y: 0 },
      P: { x: 0, y: -60 },
      Q: { x: 60, y: 0 },
      R: { x: 0, y: 120 },
      T: { x: 0, y: -120 },
      V: { x: 50, y: 50 },
      F1: { x: -120, y: -60 },
      F2: { x: -100, y: -40 },
      G1: { x: 120, y: -60 },
      G2: { x: 100, y: -40 },
      H1: { x: 120, y: 60 },
      H2: { x: 100, y: 40 },
      I1: { x: -120, y: 60 },
      I2: { x: -100, y: 40 },
    };
  };

  // Create mock age destiny map
  const createMockAgeDestinyMap = () => {
    // Create a simple map with mock destiny arcana values for each age code
    const mockAgeDestinyMap: Record<number, number> = {};
    
    // Generate 77 age destiny values (ages 1-77)
    for (let i = 1; i <= 77; i++) {
      mockAgeDestinyMap[i] = ((i - 1) % 22) + 1; // Cycle through 1-22
    }
    
    return mockAgeDestinyMap;
  };

  // Mock handlers
  const mockHandlers = {
    handleMouseEnter: () => {},
    handleMouseLeave: () => {},
    handleClick: () => {},
    handleDragStart: () => {},
    handleDragMove: () => {},
    handleDragEnd: () => {},
    setSelectedPosition: () => {},
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
            Generate Charts
          </h1>
          <p className="font-inter text-xl text-black/80 leading-relaxed mb-12 max-w-4xl mx-auto">
            Create empty chart templates perfect for TikTok content, educational purposes, 
            or custom demonstrations. Choose from various astrological chart types.
          </p>
        </div>
      </section>

      {/* Template Selection */}
      <section className="px-[5%] py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-space-grotesk text-3xl font-bold text-black mb-8 text-center">
            Choose Template
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-2xl overflow-hidden border border-black max-w-4xl mx-auto mb-12">
            {/* Destiny Matrix */}
            <div 
              className={`p-8 cursor-pointer transition-all duration-300 border-r border-black md:border-r lg:border-r ${
                selectedTemplate === 'destiny-matrix' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
              onClick={() => setSelectedTemplate('destiny-matrix')}
              style={{
                backgroundColor: selectedTemplate === 'destiny-matrix' ? '#19181a' : undefined
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-current rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold mb-2">Destiny Matrix</h3>
                <p className="text-sm opacity-80">22 arcana chart template</p>
              </div>
            </div>

            {/* Natal Chart */}
            <div 
              className={`p-8 cursor-pointer transition-all duration-300 border-r border-black md:border-r-0 lg:border-r ${
                selectedTemplate === 'natal-chart' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
              onClick={() => setSelectedTemplate('natal-chart')}
              style={{
                backgroundColor: selectedTemplate === 'natal-chart' ? '#19181a' : undefined
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-current rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold mb-2">Natal Chart</h3>
                <p className="text-sm opacity-80">Traditional birth chart</p>
              </div>
            </div>

            {/* Custom */}
            <div 
              className={`p-8 cursor-pointer transition-all duration-300 ${
                selectedTemplate === 'custom' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
              onClick={() => setSelectedTemplate('custom')}
              style={{
                backgroundColor: selectedTemplate === 'custom' ? '#19181a' : undefined
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-current rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold mb-2">Custom</h3>
                <p className="text-sm opacity-80">Build your own template</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chart Display */}
      <section className="px-[5%] py-12">
        <div className="max-w-7xl mx-auto">
          {selectedTemplate === 'destiny-matrix' && (
            <div className="text-center">
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8">
                Destiny Matrix Template
              </h3>
              <div className="bg-gray-50 border border-black p-8 rounded-2xl">
                <EmptyMatrixSVGChart 
                  matrixData={createMockMatrixData()}
                  ageDestinyMap={createMockAgeDestinyMap()}
                  responsive={createMockResponsive()}
                  positions={createMockPositions()}
                  updatedDebugPositions={createMockDebugPositions()}
                  dimensions={{ width: 700, height: 700 }}
                  selectedPosition={null}
                  hoveredPosition={null}
                  setSelectedPosition={mockHandlers.setSelectedPosition}
                  isDragging={null}
                  handleMouseEnter={mockHandlers.handleMouseEnter}
                  handleMouseLeave={mockHandlers.handleMouseLeave}
                  handleClick={mockHandlers.handleClick}
                  handleDragStart={mockHandlers.handleDragStart}
                  handleDragMove={mockHandlers.handleDragMove}
                  handleDragEnd={mockHandlers.handleDragEnd}
                />
                
                {/* Matrix Value Controls */}
                <div className="mt-12">
                  <h4 className="font-space-grotesk text-xl font-bold text-black mb-6 text-center">
                    Customize Matrix Values
                  </h4>
                  
                  {/* Main Positions (A, B, C, D, E) */}
                  <div className="mb-8">
                    <h5 className="font-space-grotesk font-bold text-black mb-4">Main Positions</h5>
                    <div className="grid grid-cols-5 gap-4">
                      {['A', 'B', 'C', 'D', 'E'].map((position) => (
                        <div key={position} className="text-center">
                          <label className="block text-sm font-medium text-black mb-2">
                            {position}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="22"
                            value={matrixValues[position] || 1}
                            onChange={(e) => handleValueChange(position, parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-black rounded text-center font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Corner Positions (F, G, H, I) */}
                  <div className="mb-8">
                    <h5 className="font-space-grotesk font-bold text-black mb-4">Corner Positions</h5>
                    <div className="grid grid-cols-4 gap-4">
                      {['F', 'G', 'H', 'I'].map((position) => (
                        <div key={position} className="text-center">
                          <label className="block text-sm font-medium text-black mb-2">
                            {position}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="22"
                            value={matrixValues[position] || 1}
                            onChange={(e) => handleValueChange(position, parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-black rounded text-center font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Inner Circle Positions */}
                  <div className="mb-8">
                    <h5 className="font-space-grotesk font-bold text-black mb-4">Inner Circle Positions</h5>
                    <div className="grid grid-cols-6 gap-4">
                      {['J', 'K', 'L', 'M', 'N', 'O'].map((position) => (
                        <div key={position} className="text-center">
                          <label className="block text-sm font-medium text-black mb-2">
                            {position}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="22"
                            value={matrixValues[position] || 1}
                            onChange={(e) => handleValueChange(position, parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-black rounded text-center font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional Positions */}
                  <div className="mb-8">
                    <h5 className="font-space-grotesk font-bold text-black mb-4">Additional Positions</h5>
                    <div className="grid grid-cols-6 gap-4">
                      {['P', 'Q', 'R', 'S', 'T', 'U'].map((position) => (
                        <div key={position} className="text-center">
                          <label className="block text-sm font-medium text-black mb-2">
                            {position}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="22"
                            value={matrixValues[position] || 1}
                            onChange={(e) => handleValueChange(position, parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-black rounded text-center font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Extended Positions */}
                  <div className="mb-8">
                    <h5 className="font-space-grotesk font-bold text-black mb-4">Extended Positions</h5>
                    <div className="grid grid-cols-4 gap-4">
                      {['V', 'POA'].map((position) => (
                        <div key={position} className="text-center">
                          <label className="block text-sm font-medium text-black mb-2">
                            {position}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="22"
                            value={matrixValues[position] || 1}
                            onChange={(e) => handleValueChange(position, parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-black rounded text-center font-bold"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Generational Positions */}
                  <div className="mb-8">
                    <h5 className="font-space-grotesk font-bold text-black mb-4">Generational Line Positions</h5>
                    <div className="grid grid-cols-8 gap-3">
                      {['F1', 'F2', 'G1', 'G2', 'H1', 'H2', 'I1', 'I2'].map((position) => (
                        <div key={position} className="text-center">
                          <label className="block text-xs font-medium text-black mb-2">
                            {position}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="22"
                            value={matrixValues[position] || 1}
                            onChange={(e) => handleValueChange(position, parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1 border border-black rounded text-center font-bold text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reset Button */}
                  <div className="text-center">
                    <button
                      onClick={() => setMatrixValues({
                        A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
                        J: 10, K: 11, L: 12, M: 13, N: 14, O: 15, P: 16, Q: 17,
                        R: 18, S: 19, T: 20, U: 21, V: 22, POA: 11,
                        F1: 1, F2: 2, G1: 3, G2: 4, H1: 5, H2: 6, I1: 7, I2: 8
                      })}
                      className="px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:bg-white hover:text-black"
                    >
                      Reset to Default Values
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTemplate === 'natal-chart' && (
            <div className="text-center">
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8">
                Natal Chart Template
              </h3>
              <div className="bg-gray-50 border border-black p-8 rounded-2xl">
                <div className="text-black/60 text-lg">
                  Natal chart template coming soon...
                </div>
              </div>
            </div>
          )}

          {selectedTemplate === 'custom' && (
            <div className="text-center">
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8">
                Custom Template Builder
              </h3>
              <div className="bg-gray-50 border border-black p-8 rounded-2xl">
                <div className="text-black/60 text-lg">
                  Custom template builder coming soon...
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="px-[5%] py-16"
        style={{ backgroundColor: synapsasColors.lightPurple }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-space-grotesk text-3xl font-bold text-black mb-6">
            Perfect for Content Creation
          </h2>
          <p className="font-inter text-lg text-black/80 mb-8 leading-relaxed">
            These empty templates are ideal for TikTok videos, Instagram posts, educational content, 
            and custom chart demonstrations. Export as SVG or PNG for maximum flexibility.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              Download Template
            </button>
            
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share Template
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneratePageClient;
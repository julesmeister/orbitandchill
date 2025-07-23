/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import EmptyMatrixSVGChart from '@/components/generate/EmptyMatrixSVGChart';
import MatrixValueGrid from './MatrixValueGrid';
import MatrixPositionGrid from './MatrixPositionGrid';
import GenerationalLineGrid from './GenerationalLineGrid';
import { matrixPositions, defaultMatrixValues } from '@/constants/matrixConfig';
import {
  createMockMatrixData,
  createMockPositions,
  createMockResponsive,
  createMockDebugPositions,
  createMockAgeDestinyMap,
  createMockHandlers
} from '@/utils/mockDataGenerators';

interface DestinyMatrixTemplateProps {
  matrixValues: Record<string, number>;
  onValueChange: (position: string, value: number) => void;
  onReset: () => void;
}

export default function DestinyMatrixTemplate({ 
  matrixValues, 
  onValueChange, 
  onReset 
}: DestinyMatrixTemplateProps) {
  const mockHandlers = createMockHandlers();

  return (
    <div className="text-center">
      <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8">
        Destiny Matrix Template
      </h3>
      <div className="bg-gray-50 border border-black p-8 rounded-2xl">
        <EmptyMatrixSVGChart 
          matrixData={createMockMatrixData(matrixValues)}
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
          <h4 className="font-space-grotesk text-xl font-bold text-black mb-8 text-center">
            Customize Matrix Values
          </h4>
          
          <MatrixValueGrid
            positions={matrixPositions.main}
            values={matrixValues}
            onChange={onValueChange}
            columns={{ mobile: 1, tablet: 3, desktop: 3 }}
            size="medium"
          />
          
          {/* Ancestral Positions Grid */}
          <MatrixPositionGrid
            positions={matrixPositions.ancestral}
            values={matrixValues}
            onChange={onValueChange}
            title="Ancestral Influences"
            columns={{ mobile: 1, tablet: 2, desktop: 4 }}
          />
          
          {/* Life Aspects Grid */}
          <MatrixPositionGrid
            positions={matrixPositions.lifeAspects}
            values={matrixValues}
            onChange={onValueChange}
            title="Life Aspects"
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          />
          
          {/* Soul Path Positions Grid */}
          <MatrixPositionGrid
            positions={matrixPositions.soulPath}
            values={matrixValues}
            onChange={onValueChange}
            title="Soul Path"
            columns={{ mobile: 1, tablet: 2, desktop: 4 }}
          />
          
          {/* Special Elements Grid */}
          <MatrixPositionGrid
            positions={matrixPositions.special}
            values={matrixValues}
            onChange={onValueChange}
            title="Special Elements"
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
          
          {/* Generational Lines Grid */}
          <GenerationalLineGrid
            positions={matrixPositions.generational}
            values={matrixValues}
            onChange={onValueChange}
          />
          
          {/* Reset Button */}
          <div className="text-center">
            <button
              onClick={onReset}
              className="px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:bg-white hover:text-black hover:-translate-y-0.5"
              style={{ borderRadius: '0' }}
            >
              Reset to Default Values
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
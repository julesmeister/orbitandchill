/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';

interface PersonaSelectorProps {
  activePersonas: string[];
  onTogglePersona: (personaId: string) => void;
  onSetAllActive: (personas: string[], active: boolean) => void;
  className?: string;
}

interface AvailablePersona {
  id: string;
  username: string;
  description: string;
  writingStyle: string;
}

export default function PersonaSelector({
  activePersonas,
  onTogglePersona,
  onSetAllActive,
  className = ""
}: PersonaSelectorProps) {
  const [availablePersonas, setAvailablePersonas] = useState<AvailablePersona[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  // Load available personas from templates
  useEffect(() => {
    const personas = SEED_PERSONA_TEMPLATES.map(template => ({
      id: template.id,
      username: template.username,
      description: template.description,
      writingStyle: template.writingStyle
    }));
    
    setAvailablePersonas(personas);
    
    // If no personas are active yet, activate all by default
    if (activePersonas.length === 0 && personas.length > 0) {
      console.log('PersonaSelector: Auto-activating all personas by default');
      onSetAllActive(personas.map(p => p.id), true);
    }
    
    setLoading(false);
  }, [activePersonas.length, onSetAllActive]); // Add dependencies

  const handleSelectAll = () => {
    const allSelected = activePersonas.length === availablePersonas.length;
    onSetAllActive(availablePersonas.map(p => p.id), !allSelected);
  };

  if (loading) {
    return (
      <div className="bg-white border border-black p-4">
        <h3 className="font-space-grotesk font-semibold text-black mb-2">
          Active Reply Personas
        </h3>
        <p className="text-gray-600 font-open-sans">Loading personas...</p>
      </div>
    );
  }

  const allSelected = activePersonas.length === availablePersonas.length;
  const someSelected = activePersonas.length > 0;

  return (
    <div className={`bg-white border border-black ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-space-grotesk font-semibold text-black">
            Active Reply Personas ({activePersonas.length}/{availablePersonas.length})
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-gray-600 hover:text-gray-800 font-semibold"
            >
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
          <p className="text-sm text-gray-700 font-open-sans">
            <strong>Active personas can generate replies.</strong> Only selected personas will be available for AI reply generation.
          </p>
        </div>

        {/* Persona grid - always show first 3, then expand */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(expanded ? availablePersonas : availablePersonas.slice(0, 6)).map((persona) => {
            const isActive = activePersonas.includes(persona.id);
            
            return (
              <div
                key={persona.id}
                className={`p-3 border rounded cursor-pointer transition-all ${
                  isActive
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onTogglePersona(persona.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isActive
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isActive && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">
                      {persona.username}
                    </div>
                    <div className="text-xs text-gray-600">
                      {persona.description}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      {persona.writingStyle.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more indicator */}
        {!expanded && availablePersonas.length > 6 && (
          <div className="mt-3 text-center">
            <button
              onClick={() => setExpanded(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Show {availablePersonas.length - 6} more personas...
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
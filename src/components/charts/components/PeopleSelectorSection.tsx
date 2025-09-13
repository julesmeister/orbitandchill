/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Suspense } from 'react';
import { Person } from '../../../types/people';
import PeopleSelector from '../../people/PeopleSelector';

interface PeopleSelectorSectionProps {
  people: Person[];
  defaultPerson: Person | null;
  selectedPersonId: string | null;
  onPersonSelect: (person: Person | null) => void;
  onSharedChartSelect: (chart: any) => void;
  onAddNew: () => void;
  onDropdownToggle?: () => void;
}

export default function PeopleSelectorSection({
  people,
  defaultPerson,
  selectedPersonId,
  onPersonSelect,
  onSharedChartSelect,
  onAddNew,
  onDropdownToggle
}: PeopleSelectorSectionProps) {
  return (
    <div className="p-4 overflow-visible">
      <div className="flex items-center mb-3">
        <svg className="w-5 h-5 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h4 className="font-space-grotesk text-sm font-semibold text-black">Generate Chart For</h4>
      </div>

      <Suspense fallback={
        <div className="border border-gray-200 rounded-lg p-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <PeopleSelector
          onPersonSelect={onPersonSelect}
          onSharedChartSelect={onSharedChartSelect}
          onAddNew={onAddNew}
          onDropdownToggle={onDropdownToggle}
          className="w-full"
          people={people}
          defaultPerson={defaultPerson}
          selectedPersonId={selectedPersonId}
        />
      </Suspense>
    </div>
  );
}
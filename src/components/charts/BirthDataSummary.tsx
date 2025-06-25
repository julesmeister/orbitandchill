import React from 'react';
import { BirthData } from '../../types/user';
import ThreadingLines from '../threading/ThreadingLines';

interface BirthDataSummaryProps {
  birthData: BirthData;
  personName?: string;
}

export default function BirthDataSummary({ birthData, personName }: BirthDataSummaryProps) {
  return (
    <div className="bg-white border-black border-t">
      <div className="p-6 border-b border-black">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-space-grotesk text-lg font-bold text-black">Birth Details</h3>
            {personName && (
              <p className="font-inter text-sm text-black/60">for {personName}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-5 ml-12">
          <div className="relative">
            <ThreadingLines 
              isNested={true} 
              isLastChild={false} 
              hasMoreSiblings={true} 
            />
            <div className="pl-4 py-2 ml-3">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-inter text-xs font-medium text-black/60 uppercase tracking-wide">Birth Date</p>
              </div>
              <p className="font-inter text-sm font-semibold text-black">
                {new Date(birthData.dateOfBirth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <ThreadingLines 
              isNested={true} 
              isLastChild={false} 
              hasMoreSiblings={true} 
            />
            <div className="pl-4 py-2 ml-3">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-inter text-xs font-medium text-black/60 uppercase tracking-wide">Birth Time</p>
              </div>
              <p className="font-inter text-sm font-semibold text-black">{birthData.timeOfBirth}</p>
            </div>
          </div>
          
          <div className="relative">
            <ThreadingLines 
              isNested={true} 
              isLastChild={true} 
              hasMoreSiblings={false} 
            />
            <div className="pl-4 py-2 ml-3">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <p className="font-inter text-xs font-medium text-black/60 uppercase tracking-wide">Birth Location</p>
              </div>
              <p className="font-inter text-sm font-semibold text-black break-words">{birthData.locationOfBirth}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
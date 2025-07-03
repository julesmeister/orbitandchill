/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { NewEvent } from '../../hooks/useEventForm';

interface AddEventFormProps {
  newEvent: NewEvent;
  setNewEvent: (event: NewEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isAnalyzing: boolean;
}

export default function AddEventForm({
  newEvent,
  setNewEvent,
  onSubmit,
  onClose,
  isAnalyzing
}: AddEventFormProps) {
  return (
    <div className="bg-white border border-black p-6" data-add-form>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-space-grotesk text-lg font-bold text-black">
          Add Manual Event
        </h3>
        <button
          onClick={onClose}
          className="text-black hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block font-space-grotesk font-medium text-black mb-2">
            Event Title
          </label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-inter"
            placeholder="Enter event title..."
            required
          />
        </div>
        
        <div>
          <label className="block font-space-grotesk font-medium text-black mb-2">
            Date
          </label>
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-inter"
            required
          />
        </div>
        
        <div>
          <label className="block font-space-grotesk font-medium text-black mb-2">
            Time (Optional)
          </label>
          <input
            type="time"
            value={newEvent.time}
            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
            className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-inter"
          />
        </div>
        
        <div>
          <label className="block font-space-grotesk font-medium text-black mb-2">
            Description (Optional)
          </label>
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-inter"
            placeholder="Brief description..."
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Analyzing...
            </>
          ) : (
            'Add Event'
          )}
        </button>
      </form>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from 'react';
import { useUnifiedEventsStore } from '../../../store/unifiedEventsStore';
import { useEventsCompat } from '../../../hooks/useEventsCompat';
import { useUserStore } from '../../../store/userStore';
import { generateEventId } from '../../../utils/eventOperations';
import type { AstrologicalEvent } from '../../../types/events';

export default function EventsTestPage() {
  const { user } = useUserStore();
  const unifiedStore = useUnifiedEventsStore();
  const compatStore = useEventsCompat();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runTests = async () => {
    if (!user?.id) {
      addTestResult('❌ No user found - please sign in');
      return;
    }

    setTestResults([]);
    addTestResult('🧪 Starting unified store tests...');

    try {
      // Test 1: Add a test event
      const testEvent: AstrologicalEvent = {
        id: generateEventId('manual'),
        userId: user.id,
        title: 'Test Event - Unified Store',
        date: '2025-01-20',
        time: '14:30',
        type: 'benefic',
        description: 'Testing the new unified architecture',
        aspects: [],
        planetaryPositions: [],
        score: 8,
        isGenerated: false,
        createdAt: new Date().toISOString(),
        isBookmarked: false
      };

      await unifiedStore.addEvent(testEvent);
      addTestResult('✅ Test 1: Event added successfully');

      // Test 2: Verify event exists
      const foundEvent = unifiedStore.getEventById(testEvent.id);
      if (foundEvent) {
        addTestResult('✅ Test 2: Event found in store');
      } else {
        addTestResult('❌ Test 2: Event not found in store');
      }

      // Test 3: Toggle bookmark
      await unifiedStore.toggleBookmark(testEvent.id);
      const bookmarkedEvent = unifiedStore.getEventById(testEvent.id);
      if (bookmarkedEvent?.metadata.isBookmarked) {
        addTestResult('✅ Test 3: Bookmark toggled successfully');
      } else {
        addTestResult('❌ Test 3: Bookmark toggle failed');
      }

      // Test 4: Compatibility layer
      const compatEvents = compatStore.getAllEvents();
      const compatEvent = compatEvents.find(e => e.id === testEvent.id);
      if (compatEvent && compatEvent.isBookmarked) {
        addTestResult('✅ Test 4: Compatibility layer working');
      } else {
        addTestResult('❌ Test 4: Compatibility layer failed');
      }

      // Test 5: Filtering
      const bookmarkedEvents = unifiedStore.getBookmarkedEvents();
      if (bookmarkedEvents.some(e => e.id === testEvent.id)) {
        addTestResult('✅ Test 5: Filtering working');
      } else {
        addTestResult('❌ Test 5: Filtering failed');
      }

      // Test 6: Remove event
      await unifiedStore.removeEvent(testEvent.id);
      const removedEvent = unifiedStore.getEventById(testEvent.id);
      if (!removedEvent) {
        addTestResult('✅ Test 6: Event removed successfully');
      } else {
        addTestResult('❌ Test 6: Event removal failed');
      }

      addTestResult('🎉 All tests completed!');

    } catch (error) {
      addTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearTests = () => {
    setTestResults([]);
  };

  const stats = unifiedStore.getEventStats();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Unified Events Store Test</h1>
        
        {/* Store Statistics */}
        <div className="bg-gray-50 border border-black p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Store Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.bookmarked}</div>
              <div className="text-sm text-gray-600">Bookmarked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.sources.generated}</div>
              <div className="text-sm text-gray-600">Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.averageScore}</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={runTests}
            className="px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
          >
            Run Tests
          </button>
          <button
            onClick={clearTests}
            className="px-6 py-3 border border-black text-black font-semibold hover:bg-gray-50 transition-colors"
          >
            Clear Results
          </button>
        </div>

        {/* Test Results */}
        <div className="bg-gray-50 border border-black p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click "Run Tests" to start.</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    result.includes('✅') 
                      ? 'bg-green-100 text-green-800' 
                      : result.includes('❌')
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Events Preview */}
        <div className="mt-8 bg-gray-50 border border-black p-6">
          <h2 className="text-xl font-semibold mb-4">Current Events ({unifiedStore.getAllEvents().length})</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {unifiedStore.getAllEvents().slice(0, 10).map(event => (
              <div key={event.id} className="p-3 bg-white border border-gray-200 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-sm text-gray-600">
                      {event.date} {event.time} | Score: {event.score}
                    </div>
                    <div className="text-xs text-gray-500">
                      Source: {event.metadata.source} | 
                      Bookmarked: {event.metadata.isBookmarked ? '✅' : '❌'} |
                      Persisted: {event.metadata.isPersisted ? '✅' : '❌'}
                    </div>
                  </div>
                  <button
                    onClick={() => unifiedStore.toggleBookmark(event.id)}
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      event.metadata.isBookmarked
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {event.metadata.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </div>
            ))}
            {unifiedStore.getAllEvents().length > 10 && (
              <div className="text-sm text-gray-500 text-center">
                ... and {unifiedStore.getAllEvents().length - 10} more events
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
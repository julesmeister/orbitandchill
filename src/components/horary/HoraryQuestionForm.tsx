/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import HoraryTimeForm from "../forms/HoraryTimeForm";
import VoidMoonCountdown from "./VoidMoonCountdown";

const LiveClock = dynamic(() => import("./LiveClock"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faClock} className="text-indigo-600" />
        <span className="text-2xl font-mono font-bold text-slate-800">
          --:--:--
        </span>
      </div>
      <div className="h-8 w-px bg-slate-300"></div>
      <div className="text-lg text-slate-700">
        Loading...
      </div>
    </div>
  ),
});

interface HoraryQuestionFormProps {
  question: string;
  setQuestion: (question: string) => void;
  isAnalyzing: boolean;
  onSubmit: () => void;
  voidStatus: {
    isVoid: boolean;
    isLoading: boolean;
    moonSign?: string;
    nextSignChange?: Date;
  };
  locationDisplay: {
    name: string;
    shortName: string;
    source: 'current' | 'birth' | 'fallback';
  };
  onShowLocationToast: () => void;
  useCustomTime: boolean;
  setUseCustomTime: (use: boolean) => void;
  customTimeData: any;
  setCustomTimeData: (data: any) => void;
}

export default function HoraryQuestionForm({
  question,
  setQuestion,
  isAnalyzing,
  onSubmit,
  voidStatus,
  locationDisplay,
  onShowLocationToast,
  useCustomTime,
  setUseCustomTime,
  customTimeData,
  setCustomTimeData
}: HoraryQuestionFormProps) {
  return (
    <div className="bg-white p-8">
      {/* Compact Oracle & Time Info */}
      <div className="mb-6 border border-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Oracle Header & Time Selection */}
          <div className="lg:border-r border-black flex flex-col" style={{ backgroundColor: '#f0e3ff' }}>
            <div className="p-4 flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-black flex items-center justify-center">
                  <span className="text-white text-lg">🔮</span>
                </div>
                <div>
                  <h2 className="font-space-grotesk text-lg font-bold text-black">Horary Oracle</h2>
                  <p className="font-inter text-xs text-black/70">Astrological guidance at inquiry moment</p>
                </div>
              </div>
              
              {/* Information about time & location when custom time is selected */}
              {useCustomTime && (
                <div className="mt-3 p-3 border border-black/30 bg-white/90">
                  <div className="text-xs text-black/80 space-y-1.5 font-inter">
                    <div className="font-bold text-black mb-1">Why Time & Location Matter</div>
                    <p>Horary requires the exact moment and place to calculate planetary positions. The cosmic snapshot at your question's birth reveals the answer.</p>
                    <div className="space-y-0.5 text-black/60">
                      <p>• <strong>Time:</strong> Determines planetary houses and aspects</p>
                      <p>• <strong>Location:</strong> Sets the ascendant and house cusps</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Selection - Anchored to bottom */}
            <div className="p-4 border-t border-black/20">
              <h4 className="font-space-grotesk text-xs font-bold text-black/80 mb-2">Time Selection</h4>

              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => {
                    setUseCustomTime(false);
                    setCustomTimeData(null);
                  }}
                  className={`px-3 py-2 text-xs font-semibold font-space-grotesk border border-black transition-all duration-300 ${!useCustomTime
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                    }`}
                >
                  🕐 Current
                </button>

                <button
                  onClick={() => {
                    setUseCustomTime(true);
                  }}
                  className={`px-3 py-2 text-xs font-semibold font-space-grotesk border border-black transition-all duration-300 ${useCustomTime
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-black hover:text-white'
                    }`}
                >
                  ⏰ Custom
                </button>
              </div>
            </div>
          </div>

          {/* Time Display or Custom Time Form */}
          {!useCustomTime ? (
            <div className="p-4 bg-white">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-space-grotesk text-sm font-bold text-black">Chart Cast Time</h3>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <LiveClock />

                <div className="flex items-center justify-between text-xs border-t border-gray-200 pt-2">
                  <div className="flex items-center space-x-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${voidStatus.isLoading ? 'bg-gray-400 animate-pulse' : voidStatus.isVoid ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <span className="font-space-grotesk font-bold text-black/70">☽</span>
                    <span className={`font-inter font-bold ${voidStatus.isVoid ? 'text-yellow-700' : 'text-green-700'}`}>
                      {voidStatus.isLoading ? 'Checking' : voidStatus.isVoid ? 'Void' : 'Active'}
                    </span>
                  </div>
                  {voidStatus.moonSign && (
                    <span className="text-black/60 font-inter capitalize text-xs">
                      {voidStatus.moonSign}
                    </span>
                  )}
                </div>

                <div className="text-xs text-black/60">
                  <div className="flex items-center justify-between">
                    <span className="truncate">Using: <span className="font-medium">{locationDisplay.shortName}</span></span>
                    <div className="flex items-center gap-1 ml-2">
                      <span>
                        {locationDisplay.source === 'current' && '📍'}
                        {locationDisplay.source === 'birth' && '🏠'}
                        {locationDisplay.source === 'fallback' && '🏙️'}
                      </span>
                      <button
                        onClick={onShowLocationToast}
                        className="ml-1 px-1 py-0.5 text-xs text-black/40 hover:text-black hover:bg-black/5 rounded transition-all duration-200"
                        title="Change location"
                      >
                        ⚙️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Void Moon Countdown */}
                {voidStatus.isVoid && voidStatus.nextSignChange && (
                  <VoidMoonCountdown
                    nextSignChange={voidStatus.nextSignChange}
                    className="text-xs border-t border-gray-200 pt-2"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-4" style={{ backgroundColor: '#f2e356' }}>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-space-grotesk text-sm font-bold text-black">Custom Chart Time</h3>
                  <div className="flex-1 h-px bg-black"></div>
                </div>
                
                <HoraryTimeForm
                  onSubmit={(data) => {
                    setCustomTimeData(data);
                  }}
                  onCancel={() => {
                    setUseCustomTime(false);
                  }}
                  initialData={customTimeData}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Question Input */}
        <div className="relative">
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your specific question here..."
            className="w-full h-40 px-4 py-3 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-black/20 resize-none font-inter"
          />
          {question.length > 0 && (
            <div className="absolute bottom-3 right-3 text-xs text-black/50">
              {question.length} characters
            </div>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={!question.trim() || isAnalyzing || (useCustomTime && !customTimeData)}
          className="w-full bg-black text-white py-4 px-6 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-space-grotesk font-bold text-lg"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Casting Horary Chart...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-3">✨</span>
              Cast Horary Chart
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
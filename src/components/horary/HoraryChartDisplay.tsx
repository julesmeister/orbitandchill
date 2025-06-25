/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faDownload, faClock, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { HoraryQuestion } from "../../store/horaryStore";
import InteractiveHoraryChart from "./InteractiveHoraryChart";

interface HoraryChartDisplayProps {
  svgContent: string;
  question: HoraryQuestion;
  onShare?: () => void;
}

export default function HoraryChartDisplay({
  svgContent,
  question,
  onShare,
}: HoraryChartDisplayProps) {
  const [showFullQuestion, setShowFullQuestion] = useState(false);
  
  // Debug: Log question structure
  console.log('HoraryChartDisplay question:', {
    id: question.id,
    hasChartData: !!question.chartData,
    chartDataKeys: question.chartData ? Object.keys(question.chartData) : 'none',
    chartDataStructure: question.chartData,
    metadataKeys: question.chartData?.metadata ? Object.keys(question.chartData.metadata) : 'none'
  });

  // Convert to Date object if it's a string (from persistence)
  const questionDate = question.date instanceof Date ? question.date : new Date(question.date);

  const handleDownload = () => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `horary-chart-${questionDate.toISOString().split('T')[0]}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header Section with Question and Answer */}
      <div className="border border-black bg-white p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-black flex items-center justify-center">
                <span className="text-white text-2xl">🔮</span>
              </div>
              <div>
                <h2 className="font-space-grotesk text-3xl font-bold text-black mb-2">Horary Oracle</h2>
                <div className="flex items-center gap-2 text-sm text-black/70 font-inter">
                  <span className="text-black">⏰</span>
                  <span>
                    Cast on {questionDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {questionDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-white border border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-medium"
              title="Download Chart"
            >
              <span className="mr-2">💾</span>
              Download
            </button>
            {onShare && (
              <button
                onClick={onShare}
                className="px-6 py-3 bg-white border border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-medium"
                title="Share Chart"
              >
                <span className="mr-2">📤</span>
                Share
              </button>
            )}
          </div>
        </div>

        {/* Question Display */}
        <div className="border border-black bg-gray-50 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-white text-sm font-bold">Q</span>
            </div>
            <h3 className="font-space-grotesk font-bold text-black">Your Question</h3>
          </div>
          <p className={`text-black font-inter text-lg leading-relaxed ${!showFullQuestion && question.question.length > 150 ? 'line-clamp-3' : ''}`}>
            "{question.question}"
          </p>
          {question.question.length > 150 && (
            <button
              onClick={() => setShowFullQuestion(!showFullQuestion)}
              className="text-black text-sm mt-3 hover:bg-black hover:text-white px-3 py-1 border border-black transition-all duration-300 font-medium"
            >
              {showFullQuestion ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Answer & Timing Cards */}
        {question.answer && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Answer Card */}
            <div className={`border border-black p-6 ${
              question.answer === 'Yes' 
                ? 'bg-green-50' 
                : question.answer === 'No' 
                ? 'bg-red-50' 
                : 'bg-yellow-50'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <h4 className="font-space-grotesk font-bold text-black">Oracle's Answer</h4>
              </div>
              <div className="text-4xl font-bold mb-3 text-black font-space-grotesk">
                {question.answer}
              </div>
              <p className="text-sm text-black font-inter">
                {question.answer === 'Yes' 
                  ? 'The stars favor your inquiry' 
                  : question.answer === 'No' 
                  ? 'The celestial counsel advises against' 
                  : 'The outcome remains in the balance'
                }
              </p>
            </div>

            {/* Timing Card */}
            {question.timing && (
              <div className="border border-black bg-blue-50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-black flex items-center justify-center">
                    <span className="text-white text-sm">⏰</span>
                  </div>
                  <h4 className="font-space-grotesk font-bold text-black">Cosmic Timing</h4>
                </div>
                <div className="text-xl font-bold text-black mb-3 font-space-grotesk">
                  {question.timing}
                </div>
                <p className="text-sm text-black font-inter">
                  When the celestial forces align
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart Display */}
      <div className="border border-black bg-white p-6">
        <div className="w-full flex justify-center">
          <InteractiveHoraryChart
            svgContent={svgContent}
            chartData={question.chartData?.metadata?.chartData}
            question={question}
            className="w-full h-full"
          />
        </div>
      </div>

    </div>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface AICapabilitiesInfoProps {
  aiProvider: string;
}

const AICapabilitiesInfo: React.FC<AICapabilitiesInfoProps> = ({ aiProvider }) => {
  return (
    <div className="bg-gray-50 p-3 border border-gray-300">
      <h4 className="text-sm font-space-grotesk font-semibold mb-2">AI Will:</h4>
      <ul className="text-xs text-gray-600 font-open-sans space-y-1">
        <li>• Rephrase content to make it unique</li>
        <li>• Reorganize thoughts for better flow</li>
        <li>• Assign content to user personas</li>
        <li>• Generate relevant categories and tags</li>
        <li>• Create natural discussion threading</li>
      </ul>
      {aiProvider === 'deepseek' && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs text-blue-800 font-open-sans">
            <strong>DeepSeek R1 Distill Llama 70B:</strong> Free tier available via OpenRouter. 
            Get your API key at <span className="font-mono">openrouter.ai</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AICapabilitiesInfo;
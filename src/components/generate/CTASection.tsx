/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { synapsasColors } from '@/constants/matrixConfig';

export default function CTASection() {
  return (
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
  );
}
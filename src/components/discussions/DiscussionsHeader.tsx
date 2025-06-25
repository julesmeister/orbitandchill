"use client";

import ParticleBackground from './ParticleBackground';

export default function DiscussionsHeader() {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Animated Particle Background */}
      <ParticleBackground />
      
      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Astrology Discussions
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
            Connect with fellow star enthusiasts, share insights, and explore the mysteries of the cosmos together
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 text-sm relative z-10">
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-lg px-4 py-3 border border-white/10">
              <div className="text-xl font-bold text-white">2.4k</div>
              <div className="text-gray-300">Active Members</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-lg px-4 py-3 border border-white/10">
              <div className="text-xl font-bold text-white">15.7k</div>
              <div className="text-gray-300">Discussions</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-lg px-4 py-3 border border-white/10">
              <div className="text-xl font-bold text-white">89k</div>
              <div className="text-gray-300">Messages</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none"></div>
    </div>
  );
}
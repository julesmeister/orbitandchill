/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface DiscussionsErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export default function DiscussionsErrorState({ error, onRetry }: DiscussionsErrorStateProps) {
  return (
    <div className="bg-white min-h-screen">
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
            Astrology Discussions
          </h1>
          <p className="font-inter text-xl text-red-600 leading-relaxed max-w-3xl mx-auto">
            Error loading discussions: {error}
          </p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="mt-4 px-6 py-3 bg-black text-white font-semibold border-2 border-black hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
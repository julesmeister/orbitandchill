/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface DiscussionsHeroProps {
  title?: string;
  description?: string;
}

export default function DiscussionsHero({ 
  title = "Astrology Discussions",
  description = "Connect with fellow star enthusiasts, share insights, and explore the mysteries of the cosmos together"
}: DiscussionsHeroProps) {
  return (
    <>
      {/* Mobile Hero */}
      <section className="md:hidden px-[5%] py-8">
        <div className="text-center">
          <h1 className="font-space-grotesk text-3xl font-bold text-black mb-4">
            {title}
          </h1>
          <p className="font-open-sans text-lg text-black/80 leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Desktop Hero */}
      <section className="hidden md:block px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-space-grotesk text-5xl lg:text-6xl font-bold text-black mb-6">
            {title}
          </h1>
          <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      </section>
    </>
  );
}
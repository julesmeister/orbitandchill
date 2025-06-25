/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function GuidesPage() {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        <section className="bg-white">
          <div className="px-6 md:px-12 lg:px-20 py-20">
            <h1>Test Page</h1>
            <p>This is a test to see if the basic structure works.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../store/userStore';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.username) {
      // Redirect to the dynamic profile route
      router.replace(`/${user.username}`);
    } else {
      // If no user, redirect to home
      router.replace('/');
    }
  }, [user, router]);

  // Show loading while redirecting
  return (
    <div className="bg-white">
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-black animate-bounce"></div>
          </div>
          <h1 className="font-space-grotesk text-4xl font-bold text-black mb-4">
            Redirecting...
          </h1>
          <p className="font-open-sans text-xl text-black/80">Taking you to your profile.</p>
        </div>
      </section>
    </div>
  );
}
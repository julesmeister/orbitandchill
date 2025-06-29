/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateSEOSlug } from "../../../utils/slugify";

export default function DiscussionRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function redirectToSlug() {
      try {
        // Fetch discussion by ID to get the title for slug generation
        const response = await fetch(`/api/discussions/${resolvedParams.id}`, {
          headers: {
            'Accept': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success && data.discussion) {
          // Generate slug from title
          const slug = data.discussion.slug || generateSEOSlug(data.discussion.title);
          
          // Redirect to the new slug-based URL
          router.replace(`/discussions/${slug}`);
        } else {
          // Discussion not found, redirect to discussions list
          setError('Discussion not found');
          setTimeout(() => {
            router.replace('/discussions');
          }, 3000);
        }
      } catch (err) {
        console.error('Error redirecting:', err);
        setError('Failed to redirect to discussion');
        setTimeout(() => {
          router.replace('/discussions');
        }, 3000);
      }
    }

    redirectToSlug();
  }, [resolvedParams.id, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 border border-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600 mb-4">Redirecting to discussions list...</p>
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 border border-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Discussion</h1>
        <p className="text-gray-600 mb-4">Taking you to the updated URL...</p>
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-500">Please wait...</span>
        </div>
      </div>
    </div>
  );
}
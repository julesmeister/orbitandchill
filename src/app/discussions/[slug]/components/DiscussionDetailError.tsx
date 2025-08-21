/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";

interface DiscussionDetailErrorProps {
  error: string | null;
}

export default function DiscussionDetailError({ error }: DiscussionDetailErrorProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || 'Discussion Not Found'}
        </h2>
        <Link
          href="/discussions"
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back to Discussions
        </Link>
      </div>
    </div>
  );
}
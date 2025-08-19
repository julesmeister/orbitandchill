/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Discussion Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The discussion you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          href="/discussions"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          ← Back to Discussions
        </Link>
      </div>
    </div>
  );
}
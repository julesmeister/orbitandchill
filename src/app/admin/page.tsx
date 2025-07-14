"use client";

import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));

// Loading skeleton for admin dashboard
const AdminLoadingSkeleton = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-gray-900 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-gray-900 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-gray-900 animate-bounce"></div>
      </div>
      <div className="text-gray-600 font-open-sans">Loading Admin Dashboard...</div>
    </div>
  </div>
);

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoadingSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
}
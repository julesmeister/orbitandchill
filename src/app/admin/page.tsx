"use client";

import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));

// Loading skeleton for admin dashboard
const AdminLoadingSkeleton = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
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
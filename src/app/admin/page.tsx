"use client";

import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/reusable/LoadingSpinner';

const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));

export default function AdminPage() {
  return (
    <Suspense fallback={
      <LoadingSpinner 
        size="lg"
        title="Loading Admin Dashboard"
        subtitle="Preparing administrative tools and data management interface..."
      />
    }>
      <AdminDashboard />
    </Suspense>
  );
}
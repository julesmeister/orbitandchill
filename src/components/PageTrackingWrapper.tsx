/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Suspense } from 'react';
import { usePageTracking } from '@/hooks/usePageTracking';

interface PageTrackingWrapperProps {
  userId?: string;
}

const PageTrackingContent: React.FC<PageTrackingWrapperProps> = ({ userId }) => {
  usePageTracking(userId);
  return null;
};

const PageTrackingWrapper: React.FC<PageTrackingWrapperProps> = ({ userId }) => {
  return (
    <Suspense fallback={null}>
      <PageTrackingContent userId={userId} />
    </Suspense>
  );
};

export default PageTrackingWrapper;
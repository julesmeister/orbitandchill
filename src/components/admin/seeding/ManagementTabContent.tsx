/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import DiscussionBrowser from '@/components/admin/seeding/DiscussionBrowser';

export interface ManagementTabContentProps {
  showLoadingToast: (title: string, message: string) => void;
  showSuccessToast: (title: string, message: string) => void;
  showErrorToast: (title: string, message: string) => void;
  aiProvider: string;
  aiModel: string;
  aiApiKey: string;
  temperature: number;
}

export default function ManagementTabContent({
  showLoadingToast,
  showSuccessToast,
  showErrorToast,
  aiProvider,
  aiModel,
  aiApiKey,
  temperature
}: ManagementTabContentProps) {
  return (
    <React.Fragment>
      {/* Discussion Browser and Comment Manager */}
      <DiscussionBrowser
        showLoadingToast={showLoadingToast}
        showSuccessToast={showSuccessToast}
        showErrorToast={showErrorToast}
        aiProvider={aiProvider}
        aiModel={aiModel}
        aiApiKey={aiApiKey}
        temperature={temperature}
      />
    </React.Fragment>
  );
}
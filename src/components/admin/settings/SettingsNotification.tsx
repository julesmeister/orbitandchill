/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

import { NotificationData } from '@/types/adminSettings';

interface SettingsNotificationProps {
  notification: NotificationData | null;
}

export default function SettingsNotification({ notification }: SettingsNotificationProps) {
  if (!notification) return null;

  return (
    <section className="px-[5%] py-2">
      <div className="max-w-7xl mx-auto">
        <div className={`border border-black p-3 flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {notification.type === 'success' ? (
            <svg className="h-4 w-4 text-black flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-black flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <p className="font-inter text-sm font-medium text-black">{notification.message}</p>
        </div>
      </div>
    </section>
  );
}
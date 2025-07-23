/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { formatEventDate } from '../../utils/eventUtils';
import { formatTime12Hour } from '../../utils/timeNavigation';
import LoadingSpinner from '../reusable/LoadingSpinner';

interface ChartLoadingDisplayProps {
  eventDate: string;
  selectedTime: string;
}

export default function ChartLoadingDisplay({
  eventDate,
  selectedTime
}: ChartLoadingDisplayProps) {
  return (
    <div className="bg-white border border-black p-12">
      <LoadingSpinner
        variant="dots"
        size="md"
        title="Generating Chart"
        subtitle={`Creating chart for ${formatEventDate(eventDate)} at ${formatTime12Hour(selectedTime)}...`}
        className="py-8"
        centered={true}
      />
    </div>
  );
}
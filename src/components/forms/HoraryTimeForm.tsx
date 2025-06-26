/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import HoraryTimeHeader from './HoraryTimeHeader';
import HoraryDateInput from './HoraryDateInput';
import HoraryTimeInput from './HoraryTimeInput';
import HoraryTimeSubmitButton from './HoraryTimeSubmitButton';

interface HoraryTimeData {
  date: string;
  time: string;
}

interface HoraryTimeFormProps {
  onSubmit: (data: HoraryTimeData) => void;
  onCancel: () => void;
  initialData?: Partial<HoraryTimeData>;
}

const HoraryTimeForm = ({ 
  onSubmit,
  onCancel,
  initialData
}: HoraryTimeFormProps) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
  });

  const [timeInput, setTimeInput] = useState({ hours: '', minutes: '', period: 'AM' });
  const [dateInput, setDateInput] = useState({ month: '', day: '', year: '' });

  // Helper functions for time conversion
  const convertTo24Hour = useCallback((hours: string, minutes: string, period: string) => {
    if (!hours || !minutes) return '';
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }, []);

  const convertTo12Hour = useCallback((time24: string) => {
    if (!time24) return { hours: '', minutes: '', period: 'AM' };
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;
    return {
      hours: hour12.toString(),
      minutes: parseInt(minutes).toString(),
      period: period
    };
  }, []);

  // Helper functions for date conversion
  const convertToDateString = useCallback((month: string, day: string, year: string) => {
    if (!month || !day || !year) return '';
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  }, []);

  const convertFromDateString = useCallback((dateString: string) => {
    if (!dateString) return { month: '', day: '', year: '' };
    const [year, month, day] = dateString.split('-');
    return {
      month: parseInt(month).toString(),
      day: parseInt(day).toString(),
      year: year
    };
  }, []);


  // Initialize form with current date/time and detected location
  useEffect(() => {
    const now = new Date();
    
    // Set current date
    const currentDate = {
      month: (now.getMonth() + 1).toString(),
      day: now.getDate().toString(),
      year: now.getFullYear().toString()
    };
    setDateInput(currentDate);
    
    // Set current time
    const currentTime = convertTo12Hour(now.toTimeString().substring(0, 5));
    setTimeInput(currentTime);
    
    // Set form data
    setFormData(prev => ({
      ...prev,
      date: convertToDateString(currentDate.month, currentDate.day, currentDate.year),
      time: convertTo24Hour(currentTime.hours, currentTime.minutes, currentTime.period)
    }));

    // Apply initial data if provided
    if (initialData) {
      if (initialData.date) {
        const dateObj = convertFromDateString(initialData.date);
        setDateInput(dateObj);
        setFormData(prev => ({ ...prev, date: initialData.date! }));
      }
      if (initialData.time) {
        const timeObj = convertTo12Hour(initialData.time);
        setTimeInput(timeObj);
        setFormData(prev => ({ ...prev, time: initialData.time! }));
      }
    }
  }, [initialData, convertTo12Hour, convertFromDateString, convertToDateString, convertTo24Hour]);


  const handleTimeInputChange = useCallback((field: 'hours' | 'minutes' | 'period', value: string) => {
    const newTimeInput = { ...timeInput, [field]: value };
    setTimeInput(newTimeInput);
    
    const time24 = convertTo24Hour(newTimeInput.hours, newTimeInput.minutes, newTimeInput.period);
    if (time24) {
      setFormData(prev => ({ ...prev, time: time24 }));
    }
  }, [timeInput, convertTo24Hour]);

  const handleDateInputChange = useCallback((field: 'month' | 'day' | 'year', value: string) => {
    const newDateInput = { ...dateInput, [field]: value };
    setDateInput(newDateInput);
    
    const dateString = convertToDateString(newDateInput.month, newDateInput.day, newDateInput.year);
    if (dateString) {
      setFormData(prev => ({ ...prev, date: dateString }));
    }
  }, [dateInput, convertToDateString]);



  const isFormValid = useMemo(() => {
    return !!(formData.date && formData.time);
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    onSubmit(formData);
  }, [formData, isFormValid, onSubmit]);

  return (
    <div className="w-full bg-white border border-black">
      <HoraryTimeHeader />

      <form onSubmit={handleSubmit} className="space-y-0">
        <HoraryDateInput
          dateInput={dateInput}
          onDateChange={handleDateInputChange}
        />

        <HoraryTimeInput
          timeInput={timeInput}
          onTimeChange={handleTimeInputChange}
        />


        <HoraryTimeSubmitButton
          isFormValid={isFormValid}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
};

export default HoraryTimeForm;
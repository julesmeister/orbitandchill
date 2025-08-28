/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

export const FormStyles: React.FC = () => (
  <style jsx>{`
    /* Synapsas Form System */
    .synapsas-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #19181a;
      font-family: 'Inter', sans-serif;
    }

    .synapsas-input, .synapsas-select {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 500;
      color: #19181a;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0;
      outline: none;
      transition: all 0.3s ease;
      font-family: 'Inter', sans-serif;
    }

    .synapsas-input:focus, .synapsas-select:focus {
      border-color: #6b7280;
      box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
    }

    .synapsas-input::placeholder {
      color: #6b7280;
    }

    .synapsas-time-input {
      padding: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #19181a;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0;
      outline: none;
      transition: all 0.3s ease;
      font-family: 'Space Grotesk', sans-serif;
    }

    .synapsas-time-input:focus {
      border-color: #6b7280;
      box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
    }

    .synapsas-time-input::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }

    .synapsas-time-input::-webkit-outer-spin-button,
    .synapsas-time-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .synapsas-time-input[type=number] {
      -moz-appearance: textfield;
    }

    /* Date & Time System from NatalChartForm */
    .synapsas-date-field {
      position: relative;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0;
      padding: 1rem;
      transition: all 0.3s ease;
    }

    .synapsas-date-field:focus-within {
      border-color: #6b7280;
      box-shadow: 0 4px 12px rgba(107, 114, 128, 0.15);
    }

    .synapsas-date-select {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1rem;
      font-weight: 600;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      transition: all 0.3s ease;
    }

    .synapsas-date-select:hover {
      opacity: 0.8;
    }

    .synapsas-date-input {
      width: 100%;
      font-size: 1rem;
      font-weight: 600;
      color: #19181a;
      text-align: center;
      border: none;
      background: transparent;
      outline: none;
      font-family: 'Inter', sans-serif;
    }

    .synapsas-date-input::placeholder {
      color: #6b7280;
      font-weight: 400;
    }

    .synapsas-date-input::-webkit-outer-spin-button,
    .synapsas-date-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .synapsas-date-input[type=number] {
      -moz-appearance: textfield;
    }

    .synapsas-month-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      max-height: 200px;
      overflow-y: auto;
      margin-top: 0.5rem;
    }

    .synapsas-month-option {
      width: 100%;
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 500;
      color: #19181a;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
      font-family: 'Inter', sans-serif;
    }

    .synapsas-month-option:hover {
      background-color: #f3f4f6;
      padding-left: 1.25rem;
    }

    .synapsas-month-option.selected {
      background-color: #19181a;
      color: white;
      font-weight: 600;
    }

    .synapsas-relationship-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      max-height: 200px;
      overflow-y: auto;
      margin-top: 0.5rem;
    }

    .synapsas-relationship-option {
      width: 100%;
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.875rem;
      font-weight: 500;
      color: #19181a;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
      font-family: 'Inter', sans-serif;
      display: flex;
      align-items: center;
    }

    .synapsas-relationship-option:hover {
      background-color: #f3f4f6;
      padding-left: 1.25rem;
    }

    .synapsas-relationship-option.selected {
      background-color: #19181a;
      color: white;
      font-weight: 600;
    }
  `}</style>
);

export default FormStyles;
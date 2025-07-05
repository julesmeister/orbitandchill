/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = ""
}: FormInputProps) {
  return (
    <div className={className}>
      <label className="block font-space-grotesk font-semibold text-black mb-2 text-sm">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-black/20 font-open-sans text-sm"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
"use client";

import React, { useState, type ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export default function Select({
  placeholder = "",
  value,
  onChange,
  options,
}: SelectProps): ReactNode {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="relative w-full">
      {placeholder && (
        <label
          className="absolute ml-1 -top-3 text-sm left-2 transition-all select-none bg-gradient-to-t from-primary dark:from-primary-dark from-50% to-50% to-transparent"
        >
          {placeholder}
        </label>
      )}
      <select
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-pink-500 focus:outline-none p-2 w-full bg-primary dark:bg-primary-dark"
      >
        <option value="">Seleccionar</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

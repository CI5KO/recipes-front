"use client";

import React, { useState, type ReactNode } from "react";

interface TextAreaProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export default function TextArea({
  placeholder = "",
  value,
  onChange,
  rows = 4,
}: TextAreaProps): ReactNode {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="relative w-full">
      {placeholder && (
        <label
          className={`absolute ml-1 ${
            isFocused || value ? "-top-3" : "top-[10px]"
          } text-sm left-2 transition-all select-none bg-gradient-to-t from-primary dark:from-primary-dark from-50% to-50% to-transparent`}
        >
          {placeholder}
        </label>
      )}
      <textarea
        value={value}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-pink-500 focus:outline-none p-2 w-full bg-primary dark:bg-primary-dark resize-none"
      />
    </div>
  );
}

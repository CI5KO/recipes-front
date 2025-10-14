"use client";

import React from "react";

interface InputProps {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function Input({
  placeholder,
  type = "text",
  value,
  onChange,
}: InputProps): React.ReactElement {
  return (
    <input
      placeholder={placeholder || ""}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-slate-600 bg-slate-700 text-white focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
    />
  );
}

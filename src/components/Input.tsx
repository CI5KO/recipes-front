"use client";

import React, { useState, type ReactNode } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";

interface InputProps {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function Input({
  placeholder = "",
  type = "text",
  value,
  onChange,
}: InputProps): ReactNode {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <div className="relative w-full">
      {placeholder && (
        <label
          className={`absolute pl-1 ${
            isFocused || value ? "-top-3" : "top-[10px]"
          } bg-gradient-to-t from-20% from-gray-300 via-60% via-transparent to-transparent text-sm left-2 transition-all select-none`}
        >
          {placeholder}
        </label>
      )}
      <input
        type={type === "password" && isPasswordVisible ? "text" : type}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-pink-500 p-2 w-full bg-gray-300"
      />
      {type === "password" && (
        <div
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {isPasswordVisible ? <PiEyeClosed /> : <PiEye />}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#64748b"
];

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="relative">
      <label className="block mb-2 font-semibold">Color</label>
      <div className="flex gap-2 items-center">
        <div
          onClick={() => setShowPicker(!showPicker)}
          className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-105 transition"
          style={{ backgroundColor: value }}
        ></div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-pink-500 focus:outline-none p-2 bg-primary dark:bg-primary-dark"
          placeholder="#000000"
        />
      </div>
      
      {showPicker && (
        <div className="absolute z-10 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <div className="grid grid-cols-6 gap-2 mb-3">
            {PRESET_COLORS.map((color) => (
              <div
                key={color}
                onClick={() => {
                  onChange(color);
                  setShowPicker(false);
                }}
                className="w-8 h-8 rounded cursor-pointer hover:scale-110 transition border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 cursor-pointer rounded"
          />
        </div>
      )}
    </div>
  );
}

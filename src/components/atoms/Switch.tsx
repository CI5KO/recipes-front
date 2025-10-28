import type { ReactNode } from "react";

interface SwitchProps {
  IconOn: ReactNode;
  IconOff: ReactNode;
  isOn: boolean;
  onToggle: () => void;
}

export default function Switch({
  IconOn,
  IconOff,
  isOn,
  onToggle,
}: SwitchProps) {
  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        onToggle();
      }}
      className={`relative w-20 h-10 border rounded-lg transition-colors duration-300 overflow-hidden ${
        isOn ? "bg-pink-300 border-pink-500" : "bg-gray-300 border-gray-500"
      }`}
    >
      <div className="relative w-full h-full flex items-center">
        <div
          className={`absolute w-6 h-6 transition-transform duration-300 ease-in-out ${
            isOn ? "translate-x-5 sm:translate-x-7" : "translate-x-1"
          }`}
        >
          {isOn ? IconOn : IconOff}
        </div>
      </div>
    </button>
  );
}

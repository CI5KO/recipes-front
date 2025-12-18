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
      className={`relative w-16 h-10 border rounded-lg transition-colors duration-300 cursor-pointer overflow-hidden ${
        isOn
          ? "bg-complementary border-pink-500 dark:border-pink-700 dark:bg-complementary-dark"
          : "bg-gray-300 border-gray-500 dark:border-gray-700 dark:bg-gray-600"
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

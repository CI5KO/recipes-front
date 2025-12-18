import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export default function Button({
  children,
  type = "button",
  onClick,
}: ButtonProps): ReactNode {
  return (
    <button
      type={type}
      onClick={onClick}
      className="cursor-pointer rounded-lg border p-3 border-pink-500 bg-pink-300 dark:border-pink-700 dark:bg-pink-600"
    >
      {children}
    </button>
  );
}

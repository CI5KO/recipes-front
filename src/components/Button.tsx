import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export default function Button({ children, onClick }: ButtonProps): ReactNode {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-pink-500 p-3 bg-pink-300"
    >
      {children}
    </button>
  );
}

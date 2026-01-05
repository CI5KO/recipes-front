"use client";

import { useRef, type ReactNode } from "react";
import { GiKnifeFork } from "react-icons/gi";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ children, isOpen, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  if (!isOpen) return null;

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-primary dark:bg-primary-dark border border-complementary dark:border-complementary-dark p-8 rounded-lg relative w-[90%] max-w-xl"
      >
        {children}
        <GiKnifeFork
          className="absolute top-4 right-4 text-xl cursor-pointer hover:text-complementary dark:hover:text-complementary-dark"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

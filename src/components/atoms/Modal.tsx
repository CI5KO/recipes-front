"use client";

import { useRef, type ReactNode } from "react";
import { MdClose } from "react-icons/md";

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
      className="fixed inset-0 bg-primary-dark/75 dark:bg-primary/75 flex justify-center items-center"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-primary dark:bg-primary-dark p-8 rounded-lg relative w-[90%] max-w-xl"
      >
        {children}
        <MdClose
          className="absolute top-2 right-2 text-xl cursor-pointer"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

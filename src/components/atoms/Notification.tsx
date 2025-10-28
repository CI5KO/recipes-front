import type { ReactNode } from "react";

// Notification that pops up to show messages to the user and close after a few seconds

interface NotificationProps {
  message: string;
  durationInSeconds?: number;
  isOpen?: boolean;
  onClose?: () => void;
  type?: "info" | "error" | "success";
}

const notificationStyles = {
  info: "bg-blue-100 text-blue-800",
  error: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
};

export default function Notification({
  message,
  durationInSeconds = 3,
  isOpen = false,
  onClose = () => {},
  type = "info",
}: NotificationProps): ReactNode {
  const colors = notificationStyles[type];
  const duration = durationInSeconds * 1000;

  if (!isOpen) return null;

  setTimeout(() => {
    onClose();
  }, duration);

  return (
    <div
      className={`fixed flex flex-row w-3/4 bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow ${colors}`}
    >
      <p className="w-[90%]">{message}</p>
      <button className="w-[10%] text-lg font-bold" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}

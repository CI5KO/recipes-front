"use client";

import { useEffect, useState } from "react";
import { RiSignalWifiOffLine } from "react-icons/ri";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <RiSignalWifiOffLine className="animate-pulse text-3xl hover:bg-gray-200 text-gray-800 dark:hover:bg-gray-800 dark:text-gray-200" />
  );
}

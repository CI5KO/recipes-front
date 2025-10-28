"use client";

import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, []);
  return <>{children}</>;
}

"use client";

import { ReactNode } from "react";
import Header from "@/src/components/organisms/Header";

export default function LoggedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-4xl text-stone-800 dark:text-stone-200">
        {children}
      </main>
    </>
  );
}

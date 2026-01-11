"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "./Sidebar";
import AppLogo from "../../../public/logo.png";
import { MdMenu } from "react-icons/md";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="w-full py-1 flex flex-row items-center justify-between px-4 bg-gray-100 dark:bg-gray-900 shadow">
        <Image src={AppLogo.src} alt="Logo" width={40} height={40} />
        <MdMenu
          onClick={() => setSidebarOpen(true)}
          className="text-3xl hover:bg-gray-200 text-gray-800 dark:hover:bg-gray-800 dark:text-gray-200 rounded"
        />
      </header>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

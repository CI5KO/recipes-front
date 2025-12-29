"use client";

import Image from "next/image";
import ThemeSwitcher from "../molecules/ThemeSwitcher";

import AppLogo from "../../../public/logo.png";

export default function Header() {
  return (
    <header className="w-full py-1 flex flex-row items-center justify-between px-4 bg-gray-100 dark:bg-gray-900 shadow">
      <Image src={AppLogo.src} alt="Logo" width={40} height={40} />
      <ThemeSwitcher />
    </header>
  );
}

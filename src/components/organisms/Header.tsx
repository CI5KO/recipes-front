"use client";

import ThemeSwitcher from "../molecules/ThemeSwitcher";

export default function Header() {
  return (
    <div className="w-full bg-complementary dark:bg-complementary-dark">
      <ThemeSwitcher />
    </div>
  );
}

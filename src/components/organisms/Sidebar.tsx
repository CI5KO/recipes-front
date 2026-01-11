"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { logoutAction } from "@/src/actions/auth.actions";
import ThemeSwitcher from "../molecules/ThemeSwitcher";
import { storageUtils } from "@/src/lib/storage";
import { Recipe } from "@/src/types";
import { usePathname } from "next/navigation";

import {
  MdHome,
  MdLibraryBooks,
  MdArrowDropDown,
  MdSave,
  MdLogout,
  MdInfo,
} from "react-icons/md";
import { PiTagFill } from "react-icons/pi";
import { GiFruitBowl, GiKnifeFork } from "react-icons/gi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      setRecipes(storageUtils.getRecipes());
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/75 z-40" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Menú</h2>
            <GiKnifeFork onClick={onClose} className="text-xl" />
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto">
            <Link
              href="/home"
              onClick={onClose}
              className={`${
                pathname === "/home"
                  ? "text-complementary dark:text-complementary-dark"
                  : ""
              } flex flex-row items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <MdHome className="mr-2" /> Inicio
            </Link>

            <div>
              <div className="w-full px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center">
                <Link
                  href="/recipes"
                  onClick={onClose}
                  className={`${
                    pathname === "/recipes"
                      ? "text-complementary dark:text-complementary-dark"
                      : ""
                  } flex flex-row items-center flex-1`}
                >
                  <MdLibraryBooks className="mr-2" /> Recetas
                </Link>
                <MdArrowDropDown
                  onClick={() => setRecipesOpen(!recipesOpen)}
                  className={`${
                    recipesOpen ? "rotate-180" : "rotate-0"
                  } transition-all ease-in-out duration-200 cursor-pointer`}
                />
              </div>
              {recipesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {recipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={`/recipes/${recipe.id}`}
                      onClick={onClose}
                      className="block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      {recipe.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/ingredients"
              onClick={onClose}
              className={`${
                pathname === "/ingredients"
                  ? "text-complementary dark:text-complementary-dark"
                  : ""
              } flex flex-row items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <GiFruitBowl className="mr-2" /> Ingredientes
            </Link>

            <Link
              href="/tags"
              onClick={onClose}
              className={`${
                pathname === "/tags"
                  ? "text-complementary dark:text-complementary-dark"
                  : ""
              } flex flex-row items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <PiTagFill className="mr-2" /> Tags
            </Link>

            <Link
              href="/dataTransfer"
              onClick={onClose}
              className={`${
                pathname === "/dataTransfer"
                  ? "text-complementary dark:text-complementary-dark"
                  : ""
              } flex flex-row items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <MdSave className="mr-2" /> Importar/exportar
            </Link>

            <Link
              href="/about"
              onClick={onClose}
              className={`${
                pathname === "/about"
                  ? "text-complementary dark:text-complementary-dark"
                  : ""
              } flex flex-row items-center px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700`}
            >
              <MdInfo className="mr-2" /> Acerca de
            </Link>
          </nav>

          <div className="border-t pt-4 space-y-4">
            <div className="px-4 py-2 flex items-center justify-between">
              <span>Tema</span>
              <ThemeSwitcher />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex justify-center items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
            >
              <MdLogout size={20} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

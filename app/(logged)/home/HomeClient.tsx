"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Recipe, Ingredient, Tag } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";
import { calculateRecipeCost } from "@/src/lib/recipeUtils";
import { PiBowlFood } from "react-icons/pi";
import { GiCookingPot } from "react-icons/gi";
import { MdLabel, MdImportExport } from "react-icons/md";

export default function HomeClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setRecipes(storageUtils.getRecipes().slice(0, 3));
    setIngredients(storageUtils.getIngredients().slice(0, 6));
    setTags(storageUtils.getTags().slice(0, 8));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center pb-6">
        <h1 className="text-3xl font-bold">Inicio</h1>
        <Link
          href="/dataTransfer"
          className="flex items-center gap-2 bg-complementary dark:bg-complementary-dark text-white px-4 py-2 rounded-lg font-semibold transition shadow"
        >
          <MdImportExport size={20} /> Importar/Exportar
        </Link>
      </div>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <PiBowlFood className="text-2xl" />
          <Link
            href="/recipes"
            className="text-2xl font-semibold hover:text-pink-500 transition"
          >
            Recetas Recientes
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.length > 0 ? (
            recipes.map((recipe) => {
              const totalCost = calculateRecipeCost(
                recipe,
                storageUtils.getIngredients()
              );
              return (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.id}`}
                  className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition bg-white dark:bg-gray-800"
                >
                  <h3 className="font-semibold text-lg mb-2">{recipe.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>⏱️ {recipe.preparationTime} min</span>
                    <span>🍽️ {recipe.servings} porciones</span>
                  </div>
                  <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                    💵 Costo: ${totalCost.toFixed(2)}
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">
              No hay recetas disponibles
            </p>
          )}
        </div>
        <Link
          href="/recipes"
          className="inline-block mt-4 text-pink-500 hover:text-pink-700 font-semibold"
        >
          Ver todas las recetas →
        </Link>
      </section>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <GiCookingPot className="text-2xl" />
          <Link
            href="/ingredients"
            className="text-2xl font-semibold hover:text-pink-500 transition"
          >
            Ingredientes
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.length > 0 ? (
            ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex justify-between items-center border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
              >
                <span className="font-medium">{ingredient.name}</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {ingredient.unitOfMeasure} - ${ingredient.pricePerUnit}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">
              No hay ingredientes disponibles
            </p>
          )}
        </div>
        <Link
          href="/ingredients"
          className="inline-block mt-4 text-pink-500 hover:text-pink-700 font-semibold"
        >
          Ver todos los ingredientes →
        </Link>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <MdLabel className="text-2xl" />
          <Link
            href="/tags"
            className="text-2xl font-semibold hover:text-pink-500 transition"
          >
            Tags
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tag.color }}
                ></div>
                <span>{tag.name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No hay tags disponibles
            </p>
          )}
        </div>
        <Link
          href="/tags"
          className="inline-block mt-4 text-pink-500 hover:text-pink-700 font-semibold"
        >
          Ver todos los tags →
        </Link>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Recipe, Ingredient, Tag } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";

export default function HomeClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    setRecipes(storageUtils.getRecipes().slice(0, 3));
    setIngredients(storageUtils.getIngredients().slice(0, 5));
    setTags(storageUtils.getTags().slice(0, 5));
  }, []);

  return (
    <div className="grid gap-4 p-6">
      <section>
        <Link href="/recipes" className="text-2xl font-semibold">
          Recetas
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg">{recipe.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {recipe.description}
              </p>
              <p className="text-sm mt-2">
                Tiempo: {recipe.preparationTime} min
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <Link href="/ingredients" className="text-2xl font-semibold">
          Ingredientes
        </Link>
        <ul className="space-y-2 pt-2">
          {ingredients.map((ingredient) => (
            <li
              key={ingredient.id}
              className="flex justify-between border rounded-lg p-4"
            >
              <span>{ingredient.name}</span>
              <span className="text-gray-600 dark:text-gray-400">
                {ingredient.unitOfMeasure} - ${ingredient.pricePerUnit}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Link href="/tags" className="text-2xl font-semibold">
          Tags
        </Link>
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 border rounded-lg px-4 py-2"
            >
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: tag.color }}
              ></div>
              <span>{tag.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

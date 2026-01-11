"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Recipe, Ingredient, Tag } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";
import { calculateRecipeCost } from "@/src/lib/recipeUtils";
import { IoArrowBack } from "react-icons/io5";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function RecipeDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [servings, setServings] = useState<number>(1);

  useEffect(() => {
    const recipes = storageUtils.getRecipes();
    const found = recipes.find((r) => r.id === params.id);
    if (found) {
      setRecipe(found);
      setServings(found.servings);
      setIngredients(storageUtils.getIngredients());
      setTags(storageUtils.getTags());
    }
  }, [params.id]);

  if (!recipe) {
    return <div className="p-6">Receta no encontrada</div>;
  }

  const getIngredient = (id: string) => ingredients.find((i) => i.id === id);
  const getTag = (id: string) => tags.find((t) => t.id === id);

  const multiplier = servings / recipe.servings;
  const totalCost = calculateRecipeCost(recipe, ingredients) * multiplier;
  const costPerServing = totalCost / servings;

  const adjustServings = (delta: number) => {
    const newServings = servings + delta;
    if (newServings > 0) setServings(newServings);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-pink-500 hover:text-pink-700 font-semibold transition"
      >
        <IoArrowBack /> Volver
      </button>

      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-lg mb-6">
        <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {recipe.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Tiempo
            </p>
            <p className="text-lg font-bold">⏱️ {recipe.preparationTime} min</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Dificultad
            </p>
            <p className="text-lg font-bold">{recipe.difficulty}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 col-span-2 row-start-1 md:col-span-1">
            <p className="text-xs text-center md:text-left text-gray-500 dark:text-gray-400 mb-1">
              Porciones
            </p>
            <div className="flex items-center justify-around gap-2">
              <button
                onClick={() => adjustServings(-1)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 md:p-1 transition"
              >
                <FiMinus size={16} />
              </button>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                🍽️ {servings}
              </p>
              <button
                onClick={() => adjustServings(1)}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 md:p-1 transition"
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Costo Total
            </p>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              💵 ${totalCost.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Por Porción
            </p>
            <p className="text-lg font-bold text-green-700 dark:text-green-300">
              ${costPerServing.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🥘 Ingredientes
          </h2>
          <ul className="space-y-3">
            {recipe.recipeIngredients.map((ri) => {
              const ing = getIngredient(ri.ingredient);
              const adjustedQuantity = ri.quantity * multiplier;
              const ingredientCost = ing
                ? adjustedQuantity * ing.pricePerUnit
                : 0;
              return (
                <li
                  key={ri.id}
                  className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-3"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      {ing?.name || "Desconocido"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {adjustedQuantity.toFixed(2)} {ing?.unitOfMeasure}
                      {ri.notes && (
                        <span className="italic ml-1">({ri.notes})</span>
                      )}
                    </p>
                  </div>
                  <span className="text-green-700 dark:text-green-300 font-bold ml-4">
                    ${ingredientCost.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📝 Instrucciones
          </h2>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
            {recipe.instructions}
          </p>
        </div>
      </div>

      {recipe.tags.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🏷️ Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tagId) => {
              const tag = getTag(tagId);
              return tag ? (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <span className="font-medium">{tag.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

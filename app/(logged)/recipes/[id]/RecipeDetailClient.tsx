"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Recipe, Ingredient, Tag } from "@/src/types";
import { storageUtils } from "@/src/lib/storage";

export default function RecipeDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const recipes = storageUtils.getRecipes();
    const found = recipes.find(r => r.id === params.id);
    if (found) {
      setRecipe(found);
      setIngredients(storageUtils.getIngredients());
      setTags(storageUtils.getTags());
    }
  }, [params.id]);

  if (!recipe) {
    return <div className="p-6">Receta no encontrada</div>;
  }

  const getIngredient = (id: string) => ingredients.find(i => i.id === id);
  const getTag = (id: string) => tags.find(t => t.id === id);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline">← Volver</button>
      
      <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div className="border rounded p-3">
          <span className="text-gray-600">Tiempo:</span>
          <p className="font-bold">{recipe.preparationTime} min</p>
        </div>
        <div className="border rounded p-3">
          <span className="text-gray-600">Dificultad:</span>
          <p className="font-bold">{recipe.difficulty}</p>
        </div>
        <div className="border rounded p-3">
          <span className="text-gray-600">Porciones:</span>
          <p className="font-bold">{recipe.servings}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Descripción</h2>
        <p className="text-gray-700">{recipe.description}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">Ingredientes</h2>
        <ul className="space-y-2">
          {recipe.recipeIngredients.map(ri => {
            const ing = getIngredient(ri.ingredient);
            return (
              <li key={ri.id} className="flex justify-between border-b pb-2">
                <span className="font-medium">{ing?.name || "Desconocido"}</span>
                <span className="text-gray-600">{ri.quantity} {ing?.unitOfMeasure} {ri.notes && `(${ri.notes})`}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">Instrucciones</h2>
        <p className="whitespace-pre-line text-gray-700">{recipe.instructions}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-3">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map(tagId => {
            const tag = getTag(tagId);
            return tag ? (
              <div key={tag.id} className="flex items-center gap-2 border rounded-lg px-4 py-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: tag.color }}></div>
                <span>{tag.name}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

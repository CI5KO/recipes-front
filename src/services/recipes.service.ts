"use server";

import { Recipe } from "@/src/types";

export async function createRecipe(recipe: Omit<Recipe, "id">): Promise<Recipe> {
  return { id: crypto.randomUUID(), ...recipe };
}

export async function updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe | null> {
  return { id, ...recipe } as Recipe;
}

export async function deleteRecipe(id: string): Promise<boolean> {
  return true;
}

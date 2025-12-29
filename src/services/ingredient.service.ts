"use server";

import { Ingredient } from "@/src/types";

export async function createIngredient(ingredient: Omit<Ingredient, "id">): Promise<Ingredient> {
  return { id: crypto.randomUUID(), ...ingredient };
}

export async function updateIngredient(id: string, ingredient: Partial<Ingredient>): Promise<Ingredient | null> {
  return { id, ...ingredient } as Ingredient;
}

export async function deleteIngredient(id: string): Promise<boolean> {
  return true;
}

import { Tag, Ingredient, Recipe } from "@/src/types";

const STORAGE_KEYS = {
  TAGS: "recipes_tags",
  INGREDIENTS: "recipes_ingredients",
  RECIPES: "recipes_recipes",
};

export const storageUtils = {
  getTags: (): Tag[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.TAGS);
    return data ? JSON.parse(data) : [];
  },

  setTags: (tags: Tag[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  getIngredients: (): Ingredient[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
    return data ? JSON.parse(data) : [];
  },

  setIngredients: (ingredients: Ingredient[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
  },

  getRecipes: (): Recipe[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.RECIPES);
    return data ? JSON.parse(data) : [];
  },

  setRecipes: (recipes: Recipe[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  },
};

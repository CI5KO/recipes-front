import { Recipe, Ingredient, RecipeIngredient } from "@/src/types";

export const calculateRecipeCost = (
  recipe: Recipe,
  ingredients: Ingredient[]
): number => {
  return recipe.recipeIngredients.reduce((total, ri) => {
    const ingredient = ingredients.find((i) => i.id === ri.ingredient);
    if (ingredient) {
      return total + ri.quantity * ingredient.pricePerUnit;
    }
    return total;
  }, 0);
};
